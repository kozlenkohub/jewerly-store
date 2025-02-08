// utils/localize.js
import i18next from 'i18next';

export const localizeField = (field) => {
  if (!field || typeof field !== 'object') {
    return field;
  }

  const lang = i18next.language || 'en';
  return field[lang] || field.en || '';
};
