import { handleBasicInfo } from './basicInfoHandler.js';
import { handleSpecifications } from './specificationsHandler.js';

export async function handleMessageWithPhotos(bot, msg, states) {
  const chatId = msg.chat.id;
  if (!states[chatId]) return;

  const state = states[chatId];
  let success = false;

  if (state.step === 'photos') {
    if (msg.text?.toLowerCase() === 'готово' && state.product.image.length > 0) {
      state.step = 'name_en';
      await bot.sendMessage(chatId, '📝 Теперь введите название продукта на английском:');
      return true;
    }
    return false;
  }

  if (['name_en', 'name_ru', 'name_uk', 'metal', 'cutForm', 'style'].includes(state.step)) {
    success = await handleBasicInfo(bot, msg, state);
  } else if (
    [
      'color',
      'weight',
      'carats',
      'clarity',
      'purity',
      'price',
      'discount',
      'bestseller',
      'description_en',
      'description_ru',
      'description_uk',
      'category',
      'collection',
      'size',
    ].includes(state.step)
  ) {
    success = await handleSpecifications(bot, msg, state);
  }

  return success;
}
