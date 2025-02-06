import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import ru from '../locales/ru.json';
import uk from '../locales/uk.json';

const getStoredLanguage = () => {
  const storedLang = localStorage.getItem('lang');
  return storedLang || 'en'; // default to 'en' if no language is stored
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
    uk: { translation: uk },
  },
  lng: getStoredLanguage(),
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

// Add language change handler
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('lang', lng);
});

export default i18n;
