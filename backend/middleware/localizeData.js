import mongoose from 'mongoose';

export const localizeResponse =
  (fields = ['name']) =>
  (req, res, next) => {
    res.localizeData = (data, fieldsToLocalize = fields) => {
      if (!req.headers['x-localize']) return data; // Возвращаем без изменений, если локализация не запрошена

      const lang = req.headers['accept-language']?.split(',')[0] || 'en';
      const visited = new WeakSet(); // Для отслеживания циклических ссылок

      const deepLocalize = (obj) => {
        if (!obj || typeof obj !== 'object') return obj;
        if (visited.has(obj)) return obj;

        visited.add(obj);

        // If this is a Mongoose document, convert it to a plain object
        if (obj instanceof mongoose.Document) {
          obj = obj.toObject();
        }

        const localizedObj = Array.isArray(obj) ? [...obj] : { ...obj };

        for (const key in localizedObj) {
          const value = localizedObj[key];
          if (!value) continue;

          // Skip localization for non-localizable fields
          if (
            [
              'createdAt',
              'updatedAt',
              'dateOrdered',
              'paymentIntentId',
              'paymentMethod',
              'paymentStatus',
              'shippingFee',
              'totalPrice',
            ].includes(key)
          ) {
            continue;
          }

          if (typeof value === 'object') {
            if ('en' in value || 'ru' in value) {
              // If the field is a localization object
              localizedObj[key] = value[lang] || value.en || Object.values(value)[0];
            } else if (value instanceof mongoose.Types.ObjectId) {
              localizedObj[key] = value.toString();
            } else {
              localizedObj[key] = deepLocalize(value);
            }
          }
        }

        return localizedObj;
      };

      return Array.isArray(data) ? data.map(deepLocalize) : deepLocalize(data);
    };

    next();
  };
