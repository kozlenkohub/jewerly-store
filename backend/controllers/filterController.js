import Filter from '../models/filterModel.js';
import Category from '../models/categoryModel.js';

export const createFilter = async (req, res) => {
  try {
    const { key, label, type, options } = req.body;
    const newFilter = new Filter({
      key,
      label,
      type,
      options: options.map((option) => ({
        type: option.type,
        img: option.img || '',
      })),
    });
    const savedFilter = await newFilter.save();
    res.status(201).json(savedFilter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllFilters = async (req, res) => {
  try {
    const { categorySlug } = req.query;

    if (!categorySlug) {
      const filters = await Filter.find().lean();
      return res.json(filters);
    }

    const category = await Category.findOne({ slug: categorySlug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const filters = await Filter.find();
    const priceFilter = filters.find((filter) => filter.key === 'price');

    const filteredFilters = filters
      .map((filter) => ({
        ...filter._doc,
        options: filter.options.filter((option) =>
          option.category.includes(category._id.toString()),
        ),
      }))
      .filter((filter) => filter.key === 'price' || filter.options.length > 0);

    // If no filters found for the category (except price), return all filters
    if (filteredFilters.length === 0 && priceFilter) {
      return res.json([priceFilter, ...filters]);
    }

    res.json(filteredFilters);
  } catch (error) {
    res.status(500).json({ message: 'Error getting filters', error });
  }
};

export const deleteFilter = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the filter
    const filter = await Filter.findByIdAndDelete(id);
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    // Remove the filter reference from all categories
    await Category.updateMany({ filters: id }, { $pull: { filters: id } });

    res.status(200).json({ message: 'Filter deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting filter', error });
  }
};

export const getFilterById = async (req, res) => {
  try {
    const { id } = req.params;

    const filter = await Filter.findById(id);
    if (!filter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    res.json(filter);
  } catch (error) {
    res.status(500).json({ message: 'Error getting filter', error });
  }
};

export const updateFilter = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, label, type, options } = req.body;

    // Validate required fields
    if (!key || !label || !type || !options) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find and update the filter
    const updatedFilter = await Filter.findByIdAndUpdate(
      id,
      {
        key,
        label,
        type,
        options: options.map((option) => ({
          type: option.type,
          img: option.img || '',
          category: option.category || [],
        })),
      },
      { new: true, runValidators: true },
    );

    if (!updatedFilter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    res.status(200).json(updatedFilter);
  } catch (error) {
    res.status(400).json({
      message: 'Error updating filter',
      error: error.message,
    });
  }
};

export const populateFilters = async (req, res) => {
  const filters = [
    {
      key: 'carats',
      label: {
        en: 'Carats',
        ru: 'Караты',
        uk: 'Карати', // Added
      },
      type: 'checkbox',
      options: [
        {
          name: {
            en: '0.3 - 0.5',
            ru: '0.3 - 0.5',
            uk: '0.3 - 0.5', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat1.jpg',
          category: [],
          type: '0.3-0.5',
        },
        {
          name: {
            en: '0.51 - 0.6',
            ru: '0.51 - 0.6',
            uk: '0.51 - 0.6', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat2.jpg',
          category: [],
          type: '0.51-0.6',
        },
        {
          name: {
            en: '0.61 - 0.7',
            ru: '0.61 - 0.7',
            uk: '0.61 - 0.7', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat3.jpg',
          category: [],
          type: '0.61-0.7',
        },
        {
          name: {
            en: '0.71 - 3',
            ru: '0.71 - 3',
            uk: '0.71 - 3', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat4.jpg',
          category: [],
          type: '0.71-3',
        },
      ],
    },
    {
      key: 'metal',
      label: {
        en: 'Metal',
        ru: 'Металл',
        uk: 'Метал', // Added
      },
      type: 'checkbox',
      options: [
        {
          name: {
            en: 'White Gold',
            ru: 'Белое золото',
            uk: 'Біле золото', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/beloe-zoloto.png',
          category: [],
          type: 'white-gold',
        },
        {
          name: {
            en: 'Yellow Gold',
            ru: 'Желтое золото',
            uk: 'Жовте золото', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/zheltoe-zoloto.png',
          category: [],
          type: 'yellow-gold',
        },
        {
          name: {
            en: 'Rose Gold',
            ru: 'Красное золото',
            uk: 'Рожеве золото', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/krasnoe-zoloto.png',
          category: [],
          type: 'rose-gold',
        },
      ],
    },
    {
      key: 'price',
      label: {
        en: 'Price',
        ru: 'Цена',
        uk: 'Ціна', // Added
      },
      type: 'range',
      options: [
        {
          name: {
            en: '0-100',
            ru: '0-100',
            uk: '0-100', // Added
          },
          img: '',
          category: [],
          type: '0-100',
        },
        {
          name: {
            en: '101-200',
            ru: '101-200',
            uk: '101-200', // Added
          },
          img: '',
          category: [],
          type: '101-200',
        },
        {
          name: {
            en: '201-300',
            ru: '201-300',
            uk: '201-300', // Added
          },
          img: '',
          category: [],
          type: '201-300',
        },
      ],
    },
    {
      key: 'cutForm',
      label: {
        en: 'Cut Form',
        ru: 'Форма огранки',
        uk: 'Форма огранки', // Added
      },
      type: 'checkbox',
      options: [
        {
          name: {
            en: 'Asher',
            ru: 'Ашер',
            uk: 'Ашер', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/asher.png',
          category: [],
          type: 'asher',
        },
        {
          name: {
            en: 'Pear',
            ru: 'Груша',
            uk: 'Груша', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/grusha.png',
          category: [],
          type: 'pear',
        },
        {
          name: {
            en: 'Round',
            ru: 'Круг',
            uk: 'Круг', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/krug.png',
          category: [],
          type: 'round',
        },
        {
          name: {
            en: 'Cushion',
            ru: 'Кушон',
            uk: 'Кушон', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/kushon.png',
          category: [],
          type: 'cushion',
        },
        {
          name: {
            en: 'Marquise',
            ru: 'Маркиз',
            uk: 'Маркіз', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/markiz.png',
          category: [],
          type: 'marquise',
        },
        {
          name: {
            en: 'Oval',
            ru: 'Овал',
            uk: 'Овал', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/oval.png',
          category: [],
          type: 'oval',
        },
        {
          name: {
            en: 'Princess',
            ru: 'Принцесса',
            uk: 'Принцеса', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/princessa.png',
          category: [],
          type: 'princess',
        },
        {
          name: {
            en: 'Radiant',
            ru: 'Радиант',
            uk: 'Радіант', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/radiant.png',
          category: [],
          type: 'radiant',
        },
        {
          name: {
            en: 'Heart',
            ru: 'Сердце',
            uk: 'Серце', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/serdce.png',
          category: [],
          type: 'heart',
        },
        {
          name: {
            en: 'Emerald',
            ru: 'Изумруд',
            uk: 'Ізумруд', // Added
          },
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/emerald.png',
          category: [],
          type: 'emerald',
        },
      ],
    },
  ];

  try {
    // Вставляем фильтры в базу
    const result = await Filter.insertMany(filters);
    res.status(201).json(result); // Отправляем ответ с данными
  } catch (error) {
    res.status(500).json({ message: `Error inserting filters: ${error.message}` }); // Более подробное сообщение об ошибке
  }
};
