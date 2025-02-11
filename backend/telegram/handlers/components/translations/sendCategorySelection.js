import fs from 'fs';
import path from 'path';

const categoriesPerPage = 5; // Number of categories per page

export const sendCategorySelection = async (
  bot,
  chatId,
  localesDir,
  lang,
  currentPage,
  categoryListMessageId,
  messageId = null,
  page = 0,
) => {
  try {
    const filePath = path.join(localesDir, `${lang}.json`);
    const rawData = fs.readFileSync(filePath, 'utf8');
    const translations = JSON.parse(rawData);

    const categories = Object.keys(translations);
    const totalPages = Math.ceil(categories.length / categoriesPerPage);
    currentPage[chatId] = page;

    const startIndex = page * categoriesPerPage;
    const endIndex = startIndex + categoriesPerPage;
    const currentCategories = categories.slice(startIndex, endIndex);

    const keyboard = currentCategories.map((category) => [
      {
        text: category,
        callback_data: `select_category:${category}`,
      },
    ]);

    // Add pagination buttons
    const paginationButtons = [];
    if (page > 0) {
      paginationButtons.push({
        text: '⬅️ Previous',
        callback_data: `page:previous`,
      });
    }
    if (page < totalPages - 1) {
      paginationButtons.push({
        text: 'Next ➡️',
        callback_data: `page:next`,
      });
    }

    if (paginationButtons.length > 0) {
      keyboard.push(paginationButtons);
    }

    const messageOptions = {
      reply_markup: {
        inline_keyboard: keyboard,
      },
      parse_mode: 'Markdown',
    };

    if (messageId) {
      // Edit the existing message
      await bot.editMessageText('✨ *Select a category to edit:* ✨', {
        chat_id: chatId,
        message_id: messageId,
        ...messageOptions,
      });
    } else {
      // Send a new message and store its ID
      const sentMessage = await bot.sendMessage(
        chatId,
        '✨ *Select a category to edit:* ✨',
        messageOptions,
      );
      categoryListMessageId[chatId] = sentMessage.message_id;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    bot.sendMessage(chatId, '❌ Failed to fetch categories.');
  }
};
