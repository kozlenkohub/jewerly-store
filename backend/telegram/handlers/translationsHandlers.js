import fs from 'fs';
import path from 'path';
import { sendCategorySelection } from './components/translations/sendCategorySelection.js';
import { displayFields } from './components/translations/displayFields.js';
import { setNestedValue } from './components/translations/setNestedValue.js';

let editingState = {}; // Store the field being edited
let currentPage = {}; // Store the current page for each chat
let categoryListMessageId = {}; // Store the message ID of the category list

const localesDir = path.resolve('./locales');
const lang = 'en'; // Default language

export const setupTranslationHandlers = (bot) => {
  // Command to trigger the category selection UI
  bot.onText(/\/edit_translations/, async (msg) => {
    const chatId = msg.chat.id;
    console.log('Received /edit_translations command'); // Add this line
    sendCategorySelection(bot, chatId, localesDir, lang, currentPage, categoryListMessageId);
  });

  // Handle category selection and pagination
  bot.on('callback_query', async (query) => {
    const chatId = query.message.chat.id;
    const data = query.data;
    const messageId = query.message.message_id;

    if (data.startsWith('select_category:')) {
      const category = data.split(':')[1];

      try {
        const filePath = path.join(localesDir, `${lang}.json`);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(rawData);
        const categoryData = translations[category];

        displayFields(bot, chatId, category, categoryData, '', localesDir, lang);
      } catch (error) {
        console.error('Error fetching category data:', error);
        bot.sendMessage(chatId, '❌ Failed to fetch category data.');
      }
    } else if (data.startsWith('edit_field:')) {
      const [_, category, fullPath] = data.split(':');
      editingState[chatId] = { category, fullPath };

      try {
        const filePath = path.join(localesDir, `${lang}.json`);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(rawData);

        let categoryData = translations[category];
        const pathParts = fullPath.split('.');
        for (const part of pathParts) {
          categoryData = categoryData[part];
        }

        bot.sendMessage(
          chatId,
          `✍️ *Enter the new text for "${fullPath}" in category "${category}". Current value:*\n\`${categoryData}\``,
          {
            parse_mode: 'Markdown',
          },
        );
      } catch (error) {
        console.error('Error fetching current value:', error);
        bot.sendMessage(chatId, '❌ Failed to fetch current value.');
      }
    } else if (data.startsWith('browse_field:')) {
      const [_, category, fullPath] = data.split(':');
      try {
        const filePath = path.join(localesDir, `${lang}.json`);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(rawData);

        let categoryData = translations[category];
        const pathParts = fullPath.split('.');
        for (const part of pathParts) {
          categoryData = categoryData[part];
        }

        displayFields(bot, chatId, category, categoryData, fullPath, localesDir, lang);
      } catch (error) {
        console.error('Error browsing field:', error);
        bot.sendMessage(chatId, '❌ Failed to browse field.');
      }
    } else if (data === 'page:previous') {
      sendCategorySelection(
        bot,
        chatId,
        localesDir,
        lang,
        currentPage,
        categoryListMessageId,
        messageId,
        currentPage[chatId] - 1,
      );
    } else if (data === 'page:next') {
      sendCategorySelection(
        bot,
        chatId,
        localesDir,
        lang,
        currentPage,
        categoryListMessageId,
        messageId,
        currentPage[chatId] + 1,
      );
    }
  });

  // Handle text messages for editing fields
  bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    if (editingState[chatId]) {
      const { category, fullPath } = editingState[chatId];
      const newText = msg.text;

      try {
        const filePath = path.join(localesDir, `${lang}.json`);
        const rawData = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(rawData);

        // Update the translation data for the selected field
        setNestedValue(translations, category, fullPath, newText, localesDir, lang);

        bot.sendMessage(
          chatId,
          `✅ *Field "${fullPath}" in category "${category}" updated successfully!*`,
          { parse_mode: 'Markdown' },
        );
      } catch (error) {
        console.error('Error updating translation:', error);
        bot.sendMessage(chatId, '❌ Failed to update translation.');
      } finally {
        delete editingState[chatId]; // Clear the editing state
      }
    }
  });
};
