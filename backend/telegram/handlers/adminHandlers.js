import TelegramUser from '../../models/telegramModel.js';

export const setupAdminHandlers = (bot) => {
  bot.onText(/\/adduser (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = process.env.ADMIN_CHAT_ID;

    if (chatId.toString() !== adminId) {
      return bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
    }

    const username = match[1];
    if (!username) {
      return bot.sendMessage(chatId, 'Пожалуйста, укажите имя пользователя.');
    }

    try {
      await TelegramUser.updateOne(
        { username },
        { $set: { isAuthorized: true } },
        { upsert: true },
      );
      bot.sendMessage(chatId, `Пользователь @${username} успешно добавлен.`);
    } catch (error) {
      bot.sendMessage(chatId, 'Произошла ошибка при добавлении пользователя.');
    }
  });

  bot.onText(/\/addid (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const adminId = process.env.ADMIN_CHAT_ID;

    if (chatId.toString() !== adminId) {
      return bot.sendMessage(chatId, 'У вас нет прав для выполнения этой команды.');
    }

    const targetChatId = Number(match[1]);
    if (isNaN(targetChatId)) {
      return bot.sendMessage(chatId, 'Пожалуйста, укажите корректный ID чата.');
    }

    try {
      await TelegramUser.findOneAndUpdate(
        { chatId: targetChatId },
        { $set: { isAllowed: true } },
        { upsert: true },
      );
      bot.sendMessage(chatId, `Пользователь с ID ${targetChatId} успешно добавлен.`);
    } catch (error) {
      bot.sendMessage(chatId, 'Произошла ошибка при добавлении пользователя.');
    }
  });
};
