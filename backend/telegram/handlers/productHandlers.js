import Product from '../../models/productModel.js';

const productStates = {};

export function setupProductHandlers(bot) {
  bot.onText(/\/addproduct/, async (msg) => {
    const chatId = msg.chat.id;
    productStates[chatId] = {
      step: 'name_en',
      product: {},
    };

    bot.sendMessage(
      chatId,
      '🆕 Давайте создадим новый продукт!\nВведите название продукта на английском:',
    );
  });

  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if (!productStates[chatId]) return;

    const state = productStates[chatId];

    switch (state.step) {
      case 'name_en':
        state.product.name = { en: text };
        state.step = 'name_ru';
        bot.sendMessage(chatId, '📝 Введите название продукта на русском:');
        break;

      case 'name_ru':
        state.product.name.ru = text;
        state.step = 'name_uk';
        bot.sendMessage(chatId, '📝 Введите название продукта на украинском:');
        break;

      case 'name_uk':
        state.product.name.uk = text;
        state.step = 'metal';
        bot.sendMessage(chatId, '🪙 Выберите тип металла:', {
          reply_markup: {
            keyboard: [['white gold', 'yellow gold', 'rose gold']],
            one_time_keyboard: true,
          },
        });
        break;

      case 'metal':
        if (!['white gold', 'yellow gold', 'rose gold'].includes(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите корректный тип металла:');
          return;
        }
        state.product.metal = { value: text };
        state.step = 'cutForm';
        bot.sendMessage(chatId, '💎 Выберите форму огранки:', {
          reply_markup: {
            keyboard: [
              ['asher', 'pear', 'round'],
              ['cushion', 'marquise', 'oval'],
              ['princess', 'radiant', 'heart'],
              ['emerald'],
            ],
            one_time_keyboard: true,
          },
        });
        break;

      case 'cutForm':
        const validCutForms = [
          'asher',
          'pear',
          'round',
          'cushion',
          'marquise',
          'oval',
          'princess',
          'radiant',
          'heart',
          'emerald',
        ];
        if (!validCutForms.includes(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите корректную форму огранки:');
          return;
        }
        state.product.cutForm = { value: text };
        state.step = 'style';
        bot.sendMessage(chatId, '🎨 Выберите стиль:', {
          reply_markup: {
            keyboard: [
              ['solitaire', 'halo', 'three-stone'],
              ['vintage', 'cluster', 'sidestone'],
            ],
            one_time_keyboard: true,
          },
        });
        break;

      case 'style':
        const validStyles = ['solitaire', 'halo', 'three-stone', 'vintage', 'cluster', 'sidestone'];
        if (!validStyles.includes(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите корректный стиль:');
          return;
        }
        state.product.style = text;
        state.step = 'color';
        bot.sendMessage(chatId, '🎨 Введите цвет изделия:');
        break;

      case 'color':
        state.product.color = text;
        state.step = 'weight';
        bot.sendMessage(chatId, '⚖️ Введите вес изделия (в граммах):');
        break;

      case 'weight':
        if (isNaN(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, введите корректное число для веса:');
          return;
        }
        state.product.weight = Number(text);
        state.step = 'carats';
        bot.sendMessage(chatId, '💎 Введите караты (если есть) или напишите "нет":');
        break;

      case 'carats':
        if (text.toLowerCase() !== 'нет') {
          if (isNaN(text)) {
            bot.sendMessage(chatId, '❌ Пожалуйста, введите корректное число для карат:');
            return;
          }
          state.product.carats = Number(text);
        }
        state.step = 'clarity';
        bot.sendMessage(chatId, '✨ Выберите чистоту камня:', {
          reply_markup: {
            keyboard: [
              ['IF', 'VVS1', 'VVS2'],
              ['VS1', 'VS2', 'SI1'],
              ['SI2', 'I1', 'I2'],
              ['I3', 'Нет'],
            ],
            one_time_keyboard: true,
          },
        });
        break;

      case 'clarity':
        const validClarity = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'];
        if (text !== 'Нет' && !validClarity.includes(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите корректную чистоту:');
          return;
        }
        if (text !== 'Нет') {
          state.product.clarity = text;
        }
        state.step = 'purity';
        bot.sendMessage(chatId, '💯 Выберите пробу:', {
          reply_markup: {
            keyboard: [['750', '585', '375', '916', '999']],
            one_time_keyboard: true,
          },
        });
        break;

      case 'purity':
        const validPurity = [750, 585, 375, 916, 999];
        if (!validPurity.includes(Number(text))) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите корректную пробу:');
          return;
        }
        state.product.purity = Number(text);
        state.step = 'price';
        bot.sendMessage(chatId, '💰 Введите цену:');
        break;

      case 'price':
        if (isNaN(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, введите корректное число для цены:');
          return;
        }
        state.product.price = Number(text);
        state.step = 'discount';
        bot.sendMessage(chatId, '🏷️ Введите скидку в процентах (0-100) или напишите "0":');
        break;

      case 'discount':
        const discount = Number(text);
        if (isNaN(discount) || discount < 0 || discount > 100) {
          bot.sendMessage(chatId, '❌ Пожалуйста, введите корректное число для скидки (0-100):');
          return;
        }
        state.product.discount = discount;
        state.step = 'bestseller';
        bot.sendMessage(chatId, '🌟 Является ли товар бестселлером?', {
          reply_markup: {
            keyboard: [['Да', 'Нет']],
            one_time_keyboard: true,
          },
        });
        break;

      case 'bestseller':
        if (!['Да', 'Нет'].includes(text)) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите "Да" или "Нет":');
          return;
        }
        state.product.bestseller = text === 'Да';
        state.step = 'description_en';
        bot.sendMessage(chatId, '📋 Введите описание продукта на английском:');
        break;

      case 'description_en':
        state.product.description = { en: text };
        state.step = 'description_ru';
        bot.sendMessage(chatId, '📋 Введите описание продукта на русском:');
        break;

      case 'description_ru':
        state.product.description.ru = text;
        state.step = 'description_uk';
        bot.sendMessage(chatId, '📋 Введите описание продукта на украинском:');
        break;

      case 'description_uk':
        state.product.description.uk = text;
        state.step = 'collection';
        bot.sendMessage(chatId, '📁 Введите название коллекции:');
        break;

      case 'collection':
        state.product.collection = text;
        state.step = 'size';
        bot.sendMessage(
          chatId,
          '📏 Введите доступные размеры (числа через запятую, например: 16.5,17,17.5) или выберите "Все размеры":',
          {
            reply_markup: {
              keyboard: [['Все размеры']],
              one_time_keyboard: true,
            },
          },
        );
        break;

      case 'size':
        try {
          let sizes;
          if (text === 'Все размеры') {
            sizes = Array.from({ length: 10 }, (_, i) => 15 + i * 0.5);
          } else {
            sizes = text.split(',').map((size) => Number(size.trim()));
            if (sizes.some((size) => isNaN(size))) throw new Error('Invalid size');
          }
          state.product.size = sizes;

          try {
            const newProduct = new Product({
              ...state.product,
              image: ['placeholder.jpg'],
              isAvailable: true,
              reviews: [],
              sales: 0,
            });
            await newProduct.save();
            bot.sendMessage(
              chatId,
              `✅ Продукт успешно создан!\nВыбранные размеры: ${sizes.join(', ')}`,
            );
          } catch (error) {
            bot.sendMessage(chatId, `❌ Ошибка при создании продукта: ${error.message}`);
          }

          delete productStates[chatId];
        } catch (error) {
          bot.sendMessage(
            chatId,
            '❌ Пожалуйста, введите корректные размеры в правильном формате или выберите "Все размеры":',
          );
        }
        break;
    }
  });
}
