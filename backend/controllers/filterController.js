import Filter from '../models/filterModel.js';
import Category from '../models/categoryModel.js';

export const addFilterToCategory = async (req, res) => {
  try {
    const { categoryId, key, label, type, options } = req.body;

    // Create a new filter
    const newFilter = new Filter({ key, label, type, options });
    await newFilter.save();

    // Find the category and update it with the new filter
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.filters.push(newFilter._id);
    await category.save();

    res.status(201).json(newFilter);
  } catch (error) {
    res.status(500).json({ message: 'Error adding filter to category', error });
  }
};

export const createFilter = async (req, res) => {
  try {
    const { key, label, type, options } = req.body;

    // Create a new filter
    const newFilter = new Filter({ key, label, type, options });
    await newFilter.save();

    res.status(201).json(newFilter);
  } catch (error) {
    res.status(500).json({ message: 'Error creating filter', error });
  }
};
