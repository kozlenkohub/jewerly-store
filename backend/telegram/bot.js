import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { setupOrderHandlers } from './handlers/orderHandlers.js';
import { setupAdminHandlers } from './handlers/adminHandlers.js';
import { setupProductHandlers } from './handlers/productHandlers.js';
import { setupTranslationHandlers } from './handlers/translationsHandlers.js';
import { setupMainHandlers } from './handlers/mainHandler.js';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

// Setup handlers
setupMainHandlers(bot);
setupOrderHandlers(bot);
setupAdminHandlers(bot);
setupProductHandlers(bot);
setupTranslationHandlers(bot);

bot.on('polling_error', (error) => {
  console.error('Polling error:', error); // Add error logging
});

export { bot };
export default bot;
