import Product from '../../../models/productModel.js';
import Category from '../../../models/categoryModel.js';
import { productStates } from '../productHandlers.js';

const goldColors = ['Y', 'W', 'R', 'RG', 'H', 'C', 'I', 'G', 'B'];

export const handleSpecifications = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  switch (state.step) {
    case 'color':
      if (!goldColors.includes(text.toUpperCase())) {
        bot.sendMessage(chatId, '❌ Пожалуйста, выберите цвет из предложенных:', {
          reply_markup: {
            keyboard: [
              ['Y', 'W', 'R'],
              ['RG', 'H', 'C'],
              ['I', 'G', 'B'],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return false;
      }
      state.product.color = text.toUpperCase();
      state.step = 'weight';
      bot.sendMessage(chatId, '⚖️ Введите вес изделия (в граммах):', {
        reply_markup: { remove_keyboard: true },
      });
      break;

    case 'weight':
      const weight = parseFloat(text);
      if (isNaN(weight) || weight <= 0) {
        bot.sendMessage(chatId, '❌ Пожалуйста, введите корректный вес в граммах (например: 2.5)');
        return false;
      }
      state.product.weight = weight;
      state.step = 'carats';
      bot.sendMessage(chatId, '💎 Введите караты или выберите вариант:', {
        reply_markup: {
          keyboard: [['0.5', '1.0', '1.5'], ['2.0', '2.5', '3.0'], ['нет']],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      break;

    case 'carats':
      if (text.toLowerCase() === 'нет') {
        state.step = 'clarity';
        bot.sendMessage(chatId, '✨ Выберите чистоту камня:', {
          reply_markup: {
            keyboard: [['IF', 'VVS1', 'VVS2'], ['VS1', 'VS2', 'SI1'], ['SI2', 'I1', 'I2'], ['нет']],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        break;
      }
      const carats = parseFloat(text);
      if (isNaN(carats) || carats <= 0) {
        bot.sendMessage(chatId, '❌ Пожалуйста, введите корректное значение карат или "нет"');
        return false;
      }
      state.product.carats = carats;
      state.step = 'clarity';
      bot.sendMessage(chatId, '✨ Выберите чистоту камня:', {
        reply_markup: {
          keyboard: [['IF', 'VVS1', 'VVS2'], ['VS1', 'VS2', 'SI1'], ['SI2', 'I1', 'I2'], ['нет']],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      break;

    case 'clarity':
      const validClarity = ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2'];
      if (text.toLowerCase() === 'нет') {
        state.step = 'purity';
        bot.sendMessage(chatId, '💯 Выберите пробу:', {
          reply_markup: {
            keyboard: [
              ['750', '585'],
              ['375', '916', '999'],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        break;
      }
      if (!validClarity.includes(text)) {
        bot.sendMessage(chatId, '❌ Пожалуйста, выберите чистоту из предложенных вариантов');
        return false;
      }
      state.product.clarity = text;
      state.step = 'purity';
      bot.sendMessage(chatId, '💯 Выберите пробу:', {
        reply_markup: {
          keyboard: [
            ['750', '585'],
            ['375', '916', '999'],
          ],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      break;

    case 'purity':
      const validPurity = [750, 585, 375, 916, 999];
      if (!validPurity.includes(Number(text))) {
        bot.sendMessage(chatId, '❌ Пожалуйста, выберите пробу из предложенных вариантов:', {
          reply_markup: {
            keyboard: [
              ['750', '585'],
              ['375', '916', '999'],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return false;
      }
      state.product.purity = Number(text);
      state.step = 'price';
      bot.sendMessage(chatId, '💰 Введите цену:', {
        reply_markup: { remove_keyboard: true },
      });
      break;

    case 'price':
      const price = parseFloat(text);
      if (isNaN(price) || price <= 0) {
        bot.sendMessage(chatId, '❌ Пожалуйста, введите корректную цену цифрами');
        return false;
      }
      state.product.price = price;
      state.step = 'discount';
      bot.sendMessage(chatId, '🏷️ Введите скидку или выберите вариант:', {
        reply_markup: {
          keyboard: [
            ['0', '5', '10'],
            ['15', '20', '25'],
          ],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      return true;

    case 'discount':
      const discount = Number(text);
      if (isNaN(discount) || discount < 0 || discount > 100) {
        bot.sendMessage(chatId, '❌ Пожалуйста, введите скидку от 0 до 100:', {
          reply_markup: {
            keyboard: [
              ['0', '5', '10'],
              ['15', '20', '25'],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return false;
      }
      state.product.discount = discount;
      state.step = 'bestseller';
      bot.sendMessage(chatId, '🌟 Является ли товар бестселлером?', {
        reply_markup: {
          keyboard: [['Да', 'Нет']],
          one_time_keyboard: true,
          resize_keyboard: true,
        },
      });
      return true;

    case 'bestseller':
      if (!['Да', 'Нет'].includes(text)) {
        bot.sendMessage(chatId, '❌ Пожалуйста, выберите "Да" или "Нет":', {
          reply_markup: {
            keyboard: [['Да', 'Нет']],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return false;
      }
      state.product.bestseller = text === 'Да';
      state.step = 'description_en';
      bot.sendMessage(chatId, '📋 Введите описание продукта на английском:');
      return true;

    case 'description_en':
      state.product.description = { en: text };
      state.step = 'description_ru';
      bot.sendMessage(chatId, '📋 Введите описание продукта на русском:');
      return true;

    case 'description_ru':
      state.product.description.ru = text;
      state.step = 'description_uk';
      bot.sendMessage(chatId, '📋 Введите описание продукта на украинском:');
      return true;

    case 'description_uk':
      state.product.description.uk = text;
      state.step = 'category';
      try {
        const categories = await Category.find({});
        let categoryKeyboard = categories.map((cat) => [cat.name.ru || cat.name.en]);
        if (categories.length === 0) {
          categoryKeyboard = [['Null']]; // Add "Null" button if no categories
          bot.sendMessage(
            chatId,
            '❌ Категории не найдены. Выберите "Null" или обратитесь к администратору.',
            {
              reply_markup: {
                keyboard: categoryKeyboard,
                one_time_keyboard: true,
                resize_keyboard: true,
              },
            },
          );
          return true;
        }
        categoryKeyboard.push(['Null']); // Add "Null" button
        bot.sendMessage(chatId, '📁 Выберите категорию:', {
          reply_markup: {
            keyboard: categoryKeyboard,
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return true;
      } catch (error) {
        bot.sendMessage(chatId, `❌ Ошибка при получении категорий: ${error.message}`);
        return false;
      }

    case 'category':
      if (text === 'Null') {
        state.product.category = null;
        state.step = 'collection';
        bot.sendMessage(chatId, '📁 Введите название коллекции:');
        return true;
      }
      try {
        const selectedCategory = await Category.findOne({
          $or: [{ 'name.ru': text }, { 'name.en': text }],
        });
        if (!selectedCategory) {
          bot.sendMessage(chatId, '❌ Пожалуйста, выберите категорию из предложенных.');
          return false;
        }
        state.product.category = selectedCategory._id;
        state.step = 'collection';
        bot.sendMessage(chatId, '📁 Введите название коллекции:');
        return true;
      } catch (error) {
        bot.sendMessage(chatId, `❌ Ошибка при выборе категории: ${error.message}`);
        return false;
      }

    case 'collection':
      if (!text || text.trim().length === 0) {
        bot.sendMessage(chatId, '❌ Название коллекции не может быть пустым');
        return false;
      }
      state.product.collection = text.trim();
      state.step = 'size';
      bot.sendMessage(
        chatId,
        '📏 Введите доступные размеры (числа через запятую, например: 16.5,17,17.5) или выберите "Все размеры":',
        {
          reply_markup: {
            keyboard: [['Все размеры']],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        },
      );
      return true;

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

        // Final validation before creating product
        if (!state.product.collection) {
          bot.sendMessage(chatId, '❌ Ошибка: не указано название коллекции');
          state.step = 'collection';
          bot.sendMessage(chatId, '📁 Введите название коллекции:');
          return false;
        }

        try {
          const newProduct = new Product({
            ...state.product,
            isAvailable: true,
            reviews: [],
            sales: 0,
          });
          await newProduct.save();
          bot.sendMessage(
            chatId,
            `✅ Продукт успешно создан!\nДобавлено фотографий: ${state.product.image.length}`,
            { reply_markup: { remove_keyboard: true } },
          );
          delete productStates[chatId];
        } catch (error) {
          bot.sendMessage(chatId, `❌ Ошибка при создании продукта: ${error.message}`);
          return false;
        }
        return true;
      } catch (error) {
        bot.sendMessage(
          chatId,
          '❌ Пожалуйста, введите корректные размеры в правильном формате или выберите "Все размеры":',
        );
        return false;
      }
  }
  return true;
};
