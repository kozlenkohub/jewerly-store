import Order from '../../models/orderModel.js';
import TelegramUser from '../../models/telegramModel.js';

const formatOrderDetails = (order) => {
  const items = order.orderItems
    .map((item) => `- ${item.name.ru || item.name.en} (${item.quantity} шт.)`)
    .join('\n');

  // Преобразуем метод оплаты в читаемый текст
  const paymentMethodText =
    {
      cash: 'Наличные',
      stripe: 'Stripe',
      liqpay: 'LiqPay',
    }[order.paymentMethod] || order.paymentMethod;

  return `
📦 Заказ #${order._id}
📅 Дата: ${new Date(order.dateOrdered).toLocaleString()}
👤 Покупатель: ${order.shippingFields.firstName} ${order.shippingFields.lastName}
📱 Телефон: ${order.shippingFields.phone}
📧 Email: ${order.email}
🏠 Адрес: ${order.shippingFields.country}, ${order.shippingFields.city}, ${
    order.shippingFields.street
  }
💰 Сумма: ${order.totalPrice}₴
💳 Оплата: ${paymentMethodText}
🚚 Статус: ${order.status}

Товары:
${items}`;
};

const ORDERS_PER_PAGE = 5;

const getOrdersKeyboard = async (page = 1) => {
  const skip = (page - 1) * ORDERS_PER_PAGE;
  const orders = await Order.find().sort({ dateOrdered: -1 }).skip(skip).limit(ORDERS_PER_PAGE);

  const totalOrders = await Order.countDocuments();
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  const keyboard = [];

  // Add order buttons
  orders.forEach((order) => {
    keyboard.push([
      {
        text: `Заказ #${order._id}`,
        callback_data: `order_${order._id}`,
      },
    ]);
  });

  // Add navigation buttons
  const navRow = [];
  if (page > 1) {
    navRow.push({
      text: '⬅️ Назад',
      callback_data: `page_${page - 1}`,
    });
  }
  navRow.push({
    text: `${page} из ${totalPages}`,
    callback_data: 'current_page',
  });
  if (page < totalPages) {
    navRow.push({
      text: 'Вперед ➡️',
      callback_data: `page_${page + 1}`,
    });
  }
  if (navRow.length > 0) {
    keyboard.push(navRow);
  }

  return {
    keyboard,
    totalOrders,
    currentPage: page,
    totalPages,
  };
};

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

export const setupOrderHandlers = (bot) => {
  bot.onText(/\/orders/, async (msg) => {
    const chatId = msg.chat.id;
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
      bot.sendMessage(chatId, 'Произошла ошибка при получении заказов.');
    }
  });

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
        await bot.sendMessage(chatId, formatOrderDetails(order));
        await bot.answerCallbackQuery(query.id);
      } catch (error) {
        bot.answerCallbackQuery(query.id, 'Произошла ошибка при получении заказа.');
      }
    }
  });
};
