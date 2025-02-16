import Order from '../../models/orderModel.js';
import TelegramUser from '../../models/telegramModel.js';
import { formatOrderDetails } from './components/order/formatOrderDetails.js';
import { getOrdersKeyboard } from './components/order/getOrdersKeyboard.js';
import { getStatusKeyboard } from './components/order/getStatusKeyboard.js';
import sendEmail from '../../utils/emailServices.js';
import { createOrderStatusUpdateMessage } from '../../utils/messageServices.js';

export const sendOrderNotification = async (bot, order) => {
  try {
    const authorizedUsers = await TelegramUser.find({ isAllowed: true });
    if (!authorizedUsers.length) return;

    const message = formatOrderDetails(order);

    for (const user of authorizedUsers) {
      try {
        await bot.sendMessage(user.chatId, '🔔 Новый заказ!\n' + message);
      } catch (error) {
        // Тихо пропускаем ошибки отправки конкретному пользователю
      }
    }
  } catch (error) {
    throw error;
  }
};

export async function handleOrders(bot, msg) {
  const chatId = msg.chat.id;

  // Prevent duplicate handling
  if (msg._processed) {
    return;
  }
  msg._processed = true;

  const isAuthorized = await TelegramUser.checkAuthorization(chatId);

  if (!isAuthorized) {
    return bot.sendMessage(chatId, 'У вас нет доступа к этой команде.');
  }

  try {
    const { keyboard, totalOrders } = await getOrdersKeyboard(1);

    if (totalOrders === 0) {
      return bot.sendMessage(chatId, 'Заказов пока нет.');
    }

    await bot.sendMessage(chatId, 'Список заказов:', {
      reply_markup: {
        inline_keyboard: keyboard,
      },
    });
  } catch (error) {
    console.error('Error in orders handler:', error);
    bot.sendMessage(chatId, 'Произошла ошибка при получении заказов.');
  }
}

export const setupOrderHandlers = (bot) => {
  // Register both handlers
  bot.onText(/\/orders/, (msg) => handleOrders(bot, msg));

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const messageId = query.message.message_id;
    const isAuthorized = await TelegramUser.checkAuthorization(chatId);

    if (!isAuthorized) {
      return bot.answerCallbackQuery(query.id, 'У вас нет доступа к этой команде.');
    }

    if (query.data.startsWith('page_')) {
      const page = parseInt(query.data.split('_')[1]);
      const { keyboard } = await getOrdersKeyboard(page);

      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: keyboard,
        },
        {
          chat_id: chatId,
          message_id: messageId,
        },
      );
      await bot.answerCallbackQuery(query.id);
    } else if (query.data === 'current_page') {
      await bot.answerCallbackQuery(query.id);
    } else if (query.data.startsWith('order_')) {
      const orderId = query.data.split('_')[1];
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          return bot.answerCallbackQuery(query.id, 'Заказ не найден.');
        }

        const statusKeyboard = getStatusKeyboard(orderId);
        await bot.sendMessage(chatId, formatOrderDetails(order), {
          reply_markup: {
            inline_keyboard: [
              [{ text: '✏️ Изменить статус', callback_data: `change_status_${orderId}` }],
            ],
          },
        });
        await bot.answerCallbackQuery(query.id);
      } catch (error) {
        bot.answerCallbackQuery(query.id, 'Произошла ошибка при получении заказа.');
      }
    } else if (query.data.startsWith('change_status_')) {
      const orderId = query.data.split('_')[2];
      const statusKeyboard = getStatusKeyboard(orderId);

      await bot.editMessageReplyMarkup(
        {
          inline_keyboard: statusKeyboard,
        },
        {
          chat_id: chatId,
          message_id: messageId,
        },
      );
      await bot.answerCallbackQuery(query.id);
    } else if (query.data.startsWith('status_')) {
      const [, orderId, newStatus] = query.data.split('_');
      try {
        const order = await Order.findById(orderId);
        if (!order) {
          return bot.answerCallbackQuery(query.id, 'Заказ не найден.');
        }

        const oldStatus = order.status;
        order.status = newStatus;
        await order.save();

        // Send email notification about status change
        await sendEmail({
          email: order.shippingFields.email,
          subject: `Order Status Update: ${newStatus}`,
          html: createOrderStatusUpdateMessage(order),
        });

        await bot.editMessageText(formatOrderDetails(order), {
          chat_id: chatId,
          message_id: messageId,
          reply_markup: {
            inline_keyboard: [
              [{ text: '✏️ Изменить статус', callback_data: `change_status_${orderId}` }],
            ],
          },
        });

        await bot.answerCallbackQuery(query.id, `Статус заказа изменен на ${newStatus}`);
      } catch (error) {
        bot.answerCallbackQuery(query.id, 'Произошла ошибка при обновлении статуса.');
      }
    }
  });
};
