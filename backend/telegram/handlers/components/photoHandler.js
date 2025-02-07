import telegramCloudinaryHandler from '../../../utils/telegramCloudinaryHandler.js';

// Maximum file sizes in bytes (20MB for bots via API)
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB is Telegram's bot API limit
const MAX_VIDEO_DURATION = 60; // seconds

export const handlePhotos = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text && text.toLowerCase() === 'готово') {
    if (state.product.image.length === 0) {
      bot.sendMessage(chatId, '❌ Пожалуйста, загрузите хотя бы одно фото или видео');
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
    const photo = photoSizes[photoSizes.length - 1];

    const uploadResult = await telegramCloudinaryHandler.uploadFromTelegramToCloudinary(
      photo.file_id,
      'image',
    );
    state.product.image.push(uploadResult.secure_url);

    bot.sendMessage(
      chatId,
      `✅ Фото ${state.product.image.length} успешно загружено. Отправьте следующее фото/видео или напишите "готово"`,
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

  if (!file.mime_type.startsWith('image/') && !file.mime_type.startsWith('video/')) {
    bot.sendMessage(chatId, '❌ Пожалуйста, отправьте только изображения или видео');
    return false;
  }

  if (file.file_size > MAX_FILE_SIZE) {
    bot.sendMessage(
      chatId,
      `❌ Файл слишком большой. Максимальный размер файла: 20MB\nПопробуйте сжать файл или отправить в меньшем качестве`,
    );
    return false;
  }

  try {
    const resourceType = file.mime_type.startsWith('image/') ? 'image' : 'video';
    const uploadResult = await telegramCloudinaryHandler.uploadFromTelegramToCloudinary(
      file.file_id,
      resourceType,
    );
    state.product.image.push(uploadResult.secure_url);

    const mediaType = resourceType === 'image' ? 'Фото' : 'Видео';
    bot.sendMessage(
      chatId,
      `✅ ${mediaType} ${state.product.image.length} успешно загружено. Отправьте следующее фото/видео или напишите "готово"`,
    );
    return true;
  } catch (error) {
    console.error('Upload error:', error);
    let errorMessage = '❌ Ошибка при загрузке файла. ';
    if (error.message.includes('too big')) {
      errorMessage +=
        'Файл слишком большой (максимум 20MB). Попробуйте сжать файл или отправить в меньшем качестве.';
    } else {
      errorMessage += error.message;
    }
    bot.sendMessage(chatId, errorMessage);
    return false;
  }
};

export const handleVideoUpload = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const video = msg.video;

  if (video.file_size > MAX_FILE_SIZE) {
    bot.sendMessage(
      chatId,
      `❌ Видео слишком большое. Максимальный размер: 20MB\nПопробуйте сжать видео или отправить в меньшем качестве`,
    );
    return false;
  }

  if (video.duration > MAX_VIDEO_DURATION) {
    bot.sendMessage(chatId, '❌ Видео должно быть не длиннее 60 секунд');
    return false;
  }

  try {
    const uploadResult = await telegramCloudinaryHandler.uploadFromTelegramToCloudinary(
      video.file_id,
      'video',
    );
    state.product.image.push(uploadResult.secure_url);

    bot.sendMessage(
      chatId,
      `✅ Видео успешно загружено. Отправьте следующее фото/видео или напишите "готово"`,
    );
    return true;
  } catch (error) {
    bot.sendMessage(chatId, `❌ Ошибка при загрузке видео: ${error.message}`);
    return false;
  }
};
