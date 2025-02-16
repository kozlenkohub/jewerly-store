import { mainKeyboard, productsKeyboard, adminKeyboard } from '../config/keyboards.js';
import TelegramUser from '../../models/telegramModel.js';
import { handleOrders } from './orderHandlers.js'; // Import the new function

let adminState = {};

export const setupMainHandlers = (bot) => {
  bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    const isAuthorized = await TelegramUser.checkAuthorization(chatId);

    if (!isAuthorized) {
      return bot.sendMessage(
        chatId,
        'Извините, у вас нет доступа к боту. Обратитесь к администратору.',
      );
    }

    bot.sendMessage(
      chatId,
      'Добро пожаловать в панель управления! Выберите нужный раздел:',
      mainKeyboard,
    );
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const username = msg.from.username;
    const text = msg.text;

    const isAuthorized = await TelegramUser.checkAuthorization(chatId);

    if (!isAuthorized) {
      await TelegramUser.createOrUpdate(chatId, username);
      return bot.sendMessage(
        chatId,
        'Извините, у вас нет доступа к боту. Обратитесь к администратору.',
      );
    }

    // Handle admin state inputs
    if (adminState[chatId]) {
      const { action } = adminState[chatId];

      if (action === 'add_user') {
        bot.emit('text', msg, [`/adduser ${text}`]);
        delete adminState[chatId];
        return;
      } else if (action === 'add_id') {
        bot.emit('text', msg, [`/addid ${text}`]);
        delete adminState[chatId];
        return;
      }
    }

    switch (text) {
      case '📦 Товары':
        bot.sendMessage(chatId, 'Выберите действие:', productsKeyboard);
        break;
      case '🛍 Заказы':
        handleOrders(bot, msg); // Call the exported function directly
        break;
      case '🌐 Переводы':
        bot.emit('text', msg, ['/edit_translations']);
        break;
      case '⚙️ Админ панель':
        bot.sendMessage(chatId, 'Панель управления пользователями:', adminKeyboard);
        break;
      case '❓ Помощь':
        bot.sendMessage(
          chatId,
          'Доступные команды:\n' +
            '/start - Показать главное меню\n' +
            '/addproduct - Добавить новый товар\n' +
            '/orders - Просмотр заказов\n' +
            '/edit_translations - Редактирование переводов\n',
        );
        break;
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;

    if (query.data === 'add_user_prompt') {
      adminState[chatId] = { action: 'add_user' };
      bot.sendMessage(chatId, '👤 Введите username пользователя (без @):');
      bot.answerCallbackQuery(query.id);
    } else if (query.data === 'add_id_prompt') {
      adminState[chatId] = { action: 'add_id' };
      bot.sendMessage(chatId, '🆔 Введите ID пользователя:');
      bot.answerCallbackQuery(query.id);
    } else if (query.data === 'add_product') {
      bot.emit('text', { chat: { id: chatId } }, ['/addproduct']);
    } else if (query.data === 'list_products') {
      bot.sendMessage(chatId, 'Функция просмотра списка товаров находится в разработке');
    } else if (query.data === 'view_orders') {
      bot.emit('text', { chat: { id: chatId } }, ['/orders']);
      bot.answerCallbackQuery(query.id);
    }
  });
};
