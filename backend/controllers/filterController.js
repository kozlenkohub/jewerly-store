import Filter from '../models/filterModel.js';
import Category from '../models/categoryModel.js';

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

export const getAllFilters = async (req, res) => {
  try {
    const { categoryId } = req.query;

    if (!categoryId) {
      const filters = await Filter.find();
      return res.json(filters);
    }

    const category = await Category.findById(categoryId).populate('filters');

    const filters = await Filter.find({ _id: { $in: category.filters } });

    res.json(filters);
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

    // Find and update the filter
    const updatedFilter = await Filter.findByIdAndUpdate(
      id,
      { key, label, type, options },
      { new: true },
    );

    if (!updatedFilter) {
      return res.status(404).json({ message: 'Filter not found' });
    }

    res.json(updatedFilter);
  } catch (error) {
    res.status(500).json({ message: 'Error updating filter', error });
  }
};
