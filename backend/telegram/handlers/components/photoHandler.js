import telegramCloudinaryHandler from '../../../utils/telegramCloudinaryHandler.js';

export const handlePhotos = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.toLowerCase() === 'готово') {
    if (state.product.image.length === 0) {
      bot.sendMessage(chatId, '❌ Пожалуйста, загрузите хотя бы одну фотографию');
      return false;
    }
    return true;
  }
  return true;
};

export const handlePhotoUpload = async (bot, msg, state) => {
  const chatId = msg.chat.id;

  try {
    const photoSizes = msg.photo;
    const photo = photoSizes[photoSizes.length - 1]; // Get highest quality

    const uploadResult = await telegramCloudinaryHandler.uploadFromTelegramToCloudinary(
      photo.file_id,
    );
    state.product.image.push(uploadResult.secure_url);

    bot.sendMessage(
      chatId,
      `✅ Фото ${state.product.image.length} успешно загружено. Отправьте следующее фото или напишите "готово"`,
    );
    return true;
  } catch (error) {
    bot.sendMessage(chatId, `❌ Ошибка при загрузке фото: ${error.message}`);
    return false;
  }
};

export const handleDocumentUpload = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const file = msg.document;

  if (!file.mime_type.startsWith('image/')) {
    bot.sendMessage(chatId, '❌ Пожалуйста, отправьте только изображения');
    return false;
  }

  try {
    const uploadResult = await telegramCloudinaryHandler.uploadFromTelegramToCloudinary(
      file.file_id,
    );
    state.product.image.push(uploadResult.secure_url);

    bot.sendMessage(
      chatId,
      `✅ Фото ${state.product.image.length} успешно загружено. Отправьте следующее фото или напишите "готово"`,
    );
    return true;
  } catch (error) {
    bot.sendMessage(chatId, `❌ Ошибка при загрузке фото: ${error.message}`);
    return false;
  }
};

async function downloadPhoto(bot, filePath) {
  try {
    const response = await fetch(
      `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${filePath}`,
    );
    return await response.buffer();
  } catch (error) {
    throw new Error('Failed to download photo');
  }
}
