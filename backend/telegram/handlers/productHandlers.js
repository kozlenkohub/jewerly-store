import { handleBasicInfo } from './components/basicInfoHandler.js';
import { handleSpecifications } from './components/specificationsHandler.js';
import { handleMessageWithPhotos } from './components/messageHandler.js';
import {
  handlePhotoUpload,
  handleDocumentUpload,
  handleVideoUpload,
} from './components/mediaHandler.js';

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

  bot.on('message', async (msg) => handleMessageWithPhotos(bot, msg, productStates));
  bot.on('photo', async (msg) => handlePhotoUpload(bot, msg, productStates));
  bot.on('document', async (msg) => handleDocumentUpload(bot, msg, productStates));
  bot.on('video', async (msg) => handleVideoUpload(bot, msg, productStates));
}
