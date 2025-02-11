export const displayFields = async (
  bot,
  chatId,
  category,
  categoryData,
  path = '',
  localesDir,
  lang,
) => {
  if (!categoryData || typeof categoryData !== 'object') {
    return bot.sendMessage(chatId, '❌ Invalid category data.');
  }

  const keyboard = [];

  for (const field in categoryData) {
    const fullPath = path ? `${path}.${field}` : field;
    const text =
      typeof categoryData[field] === 'object'
        ? `📁 ${field}`
        : `✏️ ${field}: ${categoryData[field]}`;

    keyboard.push([
      {
        text: text,
        callback_data:
          typeof categoryData[field] === 'object'
            ? `browse_field:${category}:${fullPath}`
            : `edit_field:${category}:${fullPath}`,
      },
    ]);
  }

  bot.sendMessage(chatId, `*Select a field to edit in ${category}:*`, {
    reply_markup: {
      inline_keyboard: keyboard,
    },
    parse_mode: 'Markdown',
  });
};
