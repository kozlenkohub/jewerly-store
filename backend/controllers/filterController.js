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
      const filters = await Filter.find();
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
      _id: '67954cb73b46dfefeb0ab0f7',
      key: 'carats',
      label: 'Carats',
      type: 'checkbox',
      options: [
        {
          type: '0.3 - 0.5',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat1.jpg',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: '0.51 - 0.6',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat2.jpg',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: '0.61 - 0.7',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat3.jpg',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: '0.71 - 3',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/carat4.jpg',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
      ],
      createdAt: '2025-01-25T20:42:31.169Z',
      updatedAt: '2025-01-25T20:42:31.169Z',
      __v: 0,
    },
    {
      _id: '679551083b46dfefeb0ab11c',
      key: 'metal',
      label: 'Metal',
      type: 'checkbox',
      options: [
        {
          type: 'white gold',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/beloe-zoloto.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'yellow gold',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/zheltoe-zoloto.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'red gold',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/krasnoe-zoloto.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
      ],
      createdAt: '2025-01-25T21:00:56.525Z',
      updatedAt: '2025-01-25T21:00:56.525Z',
      __v: 0,
    },
    {
      _id: '679559ab33e3c8da4e18ff80',
      key: 'price',
      label: 'Price',
      type: 'range',
      options: [
        {
          type: '0-100',
          img: '',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: '101-200',
          img: '',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: '201-300',
          img: '',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
      ],
      createdAt: '2025-01-25T21:37:47.310Z',
      updatedAt: '2025-01-25T21:37:47.310Z',
      __v: 0,
    },
    {
      _id: '67979514812ad4ca61d31655',
      key: 'cutForm',
      label: 'Cut Form',
      type: 'checkbox',
      options: [
        {
          type: 'asher',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/asher.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'pear',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/grusha.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'round',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/krug.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'cushion',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/kushon.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'marquise',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/markiz.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'oval',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/oval.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'princess',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/princessa.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'radiant',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/radiant.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'heart',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/serdce.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
        {
          type: 'emerald',
          img: 'https://apsen-diamond.com.ua/image/catalog/attribute-icons/emerald.png',
          category: ['6797b4a6301dba2c33a5c7f5', '6797b4d5301dba2c33a5c7f7'],
        },
      ],
      createdAt: '2025-01-27T14:15:48.550Z',
      updatedAt: '2025-01-27T14:15:48.550Z',
      __v: 0,
    },
  ];

  try {
    const result = await Filter.insertMany(filters);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
