import mongoose from 'mongoose';

export const localizeResponse =
  (fields = ['name']) =>
  (req, res, next) => {
    res.localizeData = (data, fieldsToLocalize = fields) => {
      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const visited = new WeakSet(); // Для отслеживания циклических ссылок

      // Функция для локализации значений
      const localizeField = (field, item) => {
        if (!item) return null;

        const keys = field.split('.');
        let value = item;

        for (const key of keys) {
          if (value && typeof value === 'object' && key in value) {
            value = value[key];
          } else {
            return null; // Если не нашли поле
          }
        }

        // Если значение - объект локализации { en: "...", ru: "..." }, возвращаем нужный язык
        if (typeof value === 'object' && value !== null) {
          return value[lang] || value.en || Object.values(value)[0];
        }

        return value;
      };

      // Функция обработки объекта
      const deepLocalize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;

        // Проверяем на циклические ссылки
        if (visited.has(obj)) return obj;
        visited.add(obj);

        // Если это Mongoose документ, преобразуем его в обычный объект
        if (obj instanceof mongoose.Document) {
          obj = obj.toObject();
        }

        const localizedObj = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key in localizedObj) {
          if (localizedObj[key] && typeof localizedObj[key] === 'object') {
            if ('en' in localizedObj[key] || 'ru' in localizedObj[key]) {
              // Если это локализованный объект
              localizedObj[key] =
                localizedObj[key][lang] ||
                localizedObj[key].en ||
                Object.values(localizedObj[key])[0];
            } else if (localizedObj[key] instanceof mongoose.Types.ObjectId) {
              // Если это ObjectId — конвертируем в строку
              localizedObj[key] = localizedObj[key].toString();
            } else {
              // Если это обычный объект — рекурсивно обрабатываем
              localizedObj[key] = deepLocalize(localizedObj[key]);
            }
          }
        }

        return localizedObj;
      };

      // Если это массив объектов, применяем к каждому
      if (Array.isArray(data)) {
        return data.map(deepLocalize);
      } else if (typeof data === 'object' && data !== null) {
        return deepLocalize(data);
      }

      return data;
    };

    next();
  };
