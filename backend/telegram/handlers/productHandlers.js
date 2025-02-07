import Product from '../../models/productModel.js';
import { uploadToCloudinary, detectFileType } from '../../utils/cloudinaryHelper.js';
import { STEPS, getPromptForStep, getNextStep } from '../../constants/productSteps.js';

const productCreationStates = new Map();

export const setupProductHandlers = (bot) => {
  bot.onText(/\/create_product/, async (msg) => {
    const chatId = msg.chat.id;
    productCreationStates.set(chatId, {
      step: STEPS.NAME_EN,
      data: {},
    });
    await bot.sendMessage(chatId, getPromptForStep(STEPS.NAME_EN));
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const state = productCreationStates.get(chatId);

    // Проверяем что есть состояние и сообщение не является командой
    if (!state || (msg.text?.startsWith('/') && msg.text !== '/done_photos')) return;

    try {
      const { step, data } = state;

      // Обработка медиафайлов
      if (step === STEPS.IMAGES) {
        if (!data.tempImages) {
          data.tempImages = [];
        }

        // Проверяем наличие медиафайла
        const mediaFile =
          msg.photo?.[msg.photo.length - 1] ||
          msg.video ||
          (msg.document?.mime_type &&
          (msg.document.mime_type.startsWith('video/') || msg.document.mime_type.includes('webp'))
            ? msg.document
            : null);

        if (mediaFile) {
          let loadingMessage;
          try {
            // Отправляем сообщение о загрузке только если есть что загружать
            loadingMessage = await bot.sendMessage(
              chatId,
              '⏳ Processing media...\n[□□□□□□□□□□] 0%',
              { parse_mode: 'HTML' }, // Добавляем поддержку HTML форматирования
            );

            await bot.editMessageText(
              '⏳ Processing media...\n[■■□□□□□□□□] 20%\nGetting file from Telegram...',
              { chat_id: chatId, message_id: loadingMessage.message_id },
            );

            const fileId = mediaFile.file_id;
            const fileUrl = await bot.getFileLink(fileId);

            await bot.editMessageText(
              '⏳ Processing media...\n[■■■■□□□□□□] 40%\nUploading to Cloudinary...',
              { chat_id: chatId, message_id: loadingMessage.message_id },
            );

            const fileType = msg.photo
              ? 'image'
              : msg.video
              ? 'video'
              : detectFileType(msg.document.mime_type);

            const cloudinaryUrl = await uploadToCloudinary(fileUrl, fileType);
            data.tempImages.push(cloudinaryUrl);

            const mediaType = fileType === 'video' ? '🎥' : '🖼️';

            // Обновляем сообщение о загрузке
            if (loadingMessage) {
              await bot.editMessageText(
                `✅ ${mediaType} Media uploaded successfully!\n[■■■■■■■■■■] 100%`,
                { chat_id: chatId, message_id: loadingMessage.message_id },
              );
            }

            // Отправляем новое сообщение с кнопками
            const keyboard = {
              inline_keyboard: [
                [{ text: "✅ Yes, that's all media", callback_data: 'photos_done' }],
                [{ text: '➕ Add more media', callback_data: 'photos_more' }],
              ],
            };

            await bot.sendMessage(
              chatId,
              `📁 Total media uploaded: ${data.tempImages.length}\nDo you want to add more?`,
              { reply_markup: keyboard },
            );

            productCreationStates.set(chatId, { step, data });
          } catch (error) {
            console.error('Error processing media:', error);
            if (loadingMessage) {
              await bot
                .editMessageText('❌ Error uploading media. Please try again.', {
                  chat_id: chatId,
                  message_id: loadingMessage.message_id,
                  parse_mode: 'HTML',
                })
                .catch(console.error); // Добавляем обработку ошибок
            }
          }
          return;
        }

        // Если нет медиафайла и нет текста, игнорируем сообщение
        if (!msg.text) return;
      }

      // Проверяем наличие текста для текстовых полей
      if (msg.text === undefined || msg.text.trim() === '') {
        await bot.sendMessage(chatId, '❌ Please provide a valid input.');
        return;
      }

      // Обработка текстовых полей
      switch (step) {
        case STEPS.NAME_EN:
          data.name_en = msg.text;
          break;
        case STEPS.NAME_RU:
          data.name_ru = msg.text;
          break;
        case STEPS.NAME_UK:
          data.name_uk = msg.text;
          break;
        case STEPS.IMAGES:
          data.images = msg.text.split(',').map((url) => url.trim());
          break;
        case STEPS.METAL:
          data.metal = msg.text.trim();
          break;
        case STEPS.CUT_FORM:
          data.cutForm = msg.text.trim();
          break;
        case STEPS.WEIGHT:
          data.weight = parseFloat(msg.text);
          break;
        case STEPS.PRICE:
          data.price = parseFloat(msg.text);
          break;
        case STEPS.COLLECTION:
          data.collection = msg.text;
          break;
        case STEPS.DESC_EN:
          data.desc_en = msg.text;
          break;
        case STEPS.DESC_RU:
          data.desc_ru = msg.text;
          break;
        case STEPS.DESC_UK:
          data.desc_uk = msg.text;
          break;
        case STEPS.SIZES:
          data.sizes = msg.text.split(',').map((size) => parseFloat(size.trim()));
          break;
      }

      const nextStep = getNextStep(step);

      if (nextStep === STEPS.COMPLETE) {
        try {
          const newProduct = new Product({
            name: {
              en: data.name_en,
              ru: data.name_ru,
              uk: data.name_uk,
            },
            image: data.images,
            metal: {
              value: data.metal,
            },
            cutForm: {
              value: data.cutForm,
            },
            weight: data.weight,
            price: data.price,
            collection: data.collection,
            description: {
              en: data.desc_en,
              ru: data.desc_ru,
              uk: data.desc_uk,
            },
            size: data.sizes,
          });

          await newProduct.save();
          await bot.sendMessage(
            chatId,
            `✅ Product created successfully!\nID: ${newProduct._id}\nName: ${newProduct.name.en}`,
            { parse_mode: 'HTML' },
          );
          productCreationStates.delete(chatId);
        } catch (error) {
          console.error('Error saving product:', error);
          await bot.sendMessage(chatId, '❌ Error saving product. Please try again.', {
            parse_mode: 'HTML',
          });
          productCreationStates.delete(chatId);
        }
      } else {
        productCreationStates.set(chatId, {
          step: nextStep,
          data,
        });
        await bot.sendMessage(chatId, getPromptForStep(nextStep), { parse_mode: 'HTML' });
      }
    } catch (error) {
      console.error('Error in product creation:', error);
      await bot
        .sendMessage(
          chatId,
          '❌ Error processing your input. Please try again or use /create_product to start over.',
          { parse_mode: 'HTML' },
        )
        .catch(console.error);
      productCreationStates.delete(chatId);
    }
  });

  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const state = productCreationStates.get(chatId);

    if (!state) return;

    if (query.data === 'photos_done') {
      const { data } = state;
      data.images = data.tempImages;
      delete data.tempImages;

      productCreationStates.set(chatId, {
        step: getNextStep(STEPS.IMAGES),
        data,
      });

      await bot.deleteMessage(chatId, query.message.message_id);
      await bot.sendMessage(chatId, `Great! ${data.images.length} photos have been saved.`);
      await bot.sendMessage(chatId, getPromptForStep(getNextStep(STEPS.IMAGES)));
    } else if (query.data === 'photos_more') {
      await bot.deleteMessage(chatId, query.message.message_id);
      await bot.sendMessage(chatId, 'OK, send me more photos!');
    }

    await bot.answerCallbackQuery(query.id);
  });
};
