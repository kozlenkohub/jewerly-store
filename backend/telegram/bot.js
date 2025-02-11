import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import TelegramUser from '../models/telegramModel.js';
import { setupOrderHandlers } from './handlers/orderHandlers.js';
import { setupAdminHandlers } from './handlers/adminHandlers.js';
import { setupProductHandlers } from './handlers/productHandlers.js';
import { setupTranslationHandlers } from './handlers/translationsHandlers.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Setup handlers
setupOrderHandlers(bot);
setupAdminHandlers(bot);
setupProductHandlers(bot);
setupTranslationHandlers(bot);

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username;

  const isAuthorized = await TelegramUser.checkAuthorization(chatId);

  if (!isAuthorized) {
    await TelegramUser.createOrUpdate(chatId, username);
    return bot.sendMessage(
      chatId,
      'Извините, у вас нет доступа к боту. Обратитесь к администратору.',
    );
  }
});

// Make bot instance available for notifications
export { bot };
export default bot;
