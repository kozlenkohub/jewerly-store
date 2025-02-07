export async function handlePhotoUpload(bot, msg, states) {
  const chatId = msg.chat.id;
  if (!states[chatId] || states[chatId].step !== 'photos') return;

  const photo = msg.photo[msg.photo.length - 1];
  states[chatId].product.image.push(photo.file_id);
  await bot.sendMessage(chatId, '✅ Фото добавлено! Отправьте следующее или напишите "готово"');
}

export async function handleDocumentUpload(bot, msg, states) {
  const chatId = msg.chat.id;
  if (!states[chatId] || states[chatId].step !== 'photos') return;

  states[chatId].product.image.push(msg.document.file_id);
  await bot.sendMessage(chatId, '✅ Документ добавлен! Отправьте следующий или напишите "готово"');
}

export async function handleVideoUpload(bot, msg, states) {
  const chatId = msg.chat.id;
  if (!states[chatId] || states[chatId].step !== 'photos') return;

  states[chatId].product.image.push(msg.video.file_id);
  await bot.sendMessage(chatId, '✅ Видео добавлено! Отправьте следующее или напишите "готово"');
}
