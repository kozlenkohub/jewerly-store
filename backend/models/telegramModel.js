import mongoose from 'mongoose';

const ADMIN_CHAT_ID = 330464669; // Добавляем прямо в модель

const telegramUserSchema = new mongoose.Schema(
  {
    chatId: {
      type: Number,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    isAllowed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

telegramUserSchema.statics.checkAuthorization = async function (chatId) {
  // Преобразуем chatId в число для корректного сравнения
  const numericChatId = Number(chatId);

  // Пропускаем админа без проверки базы данных
  if (numericChatId === ADMIN_CHAT_ID) return true;

  // Для всех остальных проверяем права в базе
  const user = await this.findOne({ chatId: numericChatId });
  return user && user.isAllowed;
};

telegramUserSchema.statics.createOrUpdate = async function (chatId, username) {
  return await this.findOneAndUpdate(
    { chatId },
    {
      chatId,
      username,
      isAllowed: Number(chatId) === ADMIN_CHAT_ID, // автоматически разрешаем доступ админу
    },
    { upsert: true, new: true },
  );
};

export default mongoose.model('TelegramUser', telegramUserSchema);
