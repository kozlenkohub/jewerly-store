export const mainKeyboard = {
  reply_markup: {
    keyboard: [['📦 Товары', '🛍 Заказы'], ['🌐 Переводы', '⚙️ Админ панель'], ['❓ Помощь']],
    resize_keyboard: true,
  },
};

export const productsKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '➕ Добавить товар', callback_data: 'add_product' }],
      [{ text: '📋 Список товаров', callback_data: 'list_products' }],
    ],
  },
};

export const adminKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: '➕ Добавить пользователя по username', callback_data: 'add_user_prompt' }],
      [{ text: '➕ Добавить пользователя по ID', callback_data: 'add_id_prompt' }],
    ],
  },
};
