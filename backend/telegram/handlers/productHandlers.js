import { handleBasicInfo } from './components/basicInfoHandler.js';
import { handleSpecifications } from './components/specificationsHandler.js';
import {
  handlePhotos,
  handlePhotoUpload,
  handleDocumentUpload,
} from './components/photoHandler.js';

export const productStates = {};

export function setupProductHandlers(bot) {
  bot.onText(/\/addproduct/, async (msg) => {
    const chatId = msg.chat.id;
    productStates[chatId] = {
      step: 'photos',
      product: {
        image: [],
      },
    };

    bot.sendMessage(
      chatId,
      '🆕 Давайте создадим новый продукт!\n📸 Сначала отправьте фотографии продукта (по одной). Когда закончите, напишите "готово"',
    );
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (!productStates[chatId]) return;

    const state = productStates[chatId];
    let success = false;

    // Route to appropriate handler based on current step
    if (state.step === 'photos') {
      success = await handlePhotos(bot, msg, state);
      // If photos are completed, move to basic info
      if (success && msg.text?.toLowerCase() === 'готово') {
        state.step = 'name_en';
        bot.sendMessage(chatId, '📝 Теперь введите название продукта на английском:');
        return;
      }
    } else if (
      ['name_en', 'name_ru', 'name_uk', 'metal', 'cutForm', 'style'].includes(state.step)
    ) {
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

    if (!success) {
      return;
    }
  });

  // Photo handler
  bot.on('photo', async (msg) => {
    const chatId = msg.chat.id;
    if (!productStates[chatId] || productStates[chatId].step !== 'photos') return;
    await handlePhotoUpload(bot, msg, productStates[chatId]);
  });

  // Document handler
  bot.on('document', async (msg) => {
    const chatId = msg.chat.id;
    if (!productStates[chatId] || productStates[chatId].step !== 'photos') return;
    await handleDocumentUpload(bot, msg, productStates[chatId]);
  });
}
