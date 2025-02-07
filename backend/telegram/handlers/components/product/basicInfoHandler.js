export const handleBasicInfo = async (bot, msg, state) => {
  const chatId = msg.chat.id;
  const text = msg.text;

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
        return false;
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
        return false;
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
          resize_keyboard: true,
        },
      });
      break;

    case 'style':
      const validStyles = ['solitaire', 'halo', 'three-stone', 'vintage', 'cluster', 'sidestone'];
      if (!validStyles.includes(text.toLowerCase())) {
        bot.sendMessage(chatId, '❌ Пожалуйста, выберите стиль из предложенных вариантов:', {
          reply_markup: {
            keyboard: [
              ['solitaire', 'halo', 'three-stone'],
              ['vintage', 'cluster', 'sidestone'],
            ],
            one_time_keyboard: true,
            resize_keyboard: true,
          },
        });
        return false;
      }
      state.product.style = text.toLowerCase();
      state.step = 'color';
      bot.sendMessage(chatId, '🎨 Выберите цвет изделия:', {
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
      return true;

    default:
      return true;
  }
  return true;
};
