import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text.toLowerCase() === '/start') {
    bot.sendMessage(chatId, 'Привет! Я твой бот. Чем могу помочь?');
  } else {
    bot.sendMessage(chatId, `Вы сказали: ${text}`);
  }
});

export default bot;
