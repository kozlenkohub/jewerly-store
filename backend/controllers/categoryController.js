import Category from '../models/categoryModel.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

export const createCategory = async (req, res) => {
  try {
    const { name, parent, label, slug } = req.body;
    const files = req.files || {};

    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    const categoryData = {
      name,
      slug: slug || generateSlug(name),
      label,
      parent: parent || null,
    };

    // Handle image upload
    if (files.image) {
      const imageResult = await uploadToCloudinary(files.image[0].buffer);
      categoryData.image = imageResult.secure_url;
    }

    // Handle icon upload
    if (files.icon) {
      const iconResult = await uploadToCloudinary(files.icon[0].buffer);
      categoryData.icon = iconResult.secure_url;
    }

    const newCategory = new Category(categoryData);
    await newCategory.save();

    return res.status(201).json(newCategory);
  } catch (error) {
    console.error('Error creating category:', error);
    return res.status(400).json({ message: error.message });
  }
};

// Helper function
const generateSlug = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-');
};

export const getAllCategories = async (req, res) => {
  try {
    const lang = req.headers['accept-language'] || 'en';
    const categories = await Category.find().lean();

    // Create a map for quick access by _id
    const categoriesMap = {};
    categories.forEach((category) => {
      categoriesMap[category._id] = {
        ...category,
        name: category.name[lang] || category.name.en, // Filter name by language
        children: [],
      };
    });

    // Build the hierarchical tree
    const rootCategories = [];
    categories.forEach((category) => {
      if (category.parent) {
        // If there's a parent, add the current category to its 'children' array
        categoriesMap[category.parent]?.children.push(categoriesMap[category._id]);
      } else {
        // If there's no parent, it's a root category
        rootCategories.push(categoriesMap[category._id]);
      }
    });

    return res.json(rootCategories);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id).populate('children').populate('parent');
    if (!category) return res.status(404).json({ message: 'Category not found' });
    return res.json(category);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { name, parent, label } = req.body;
    const files = req.files || {};

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const updateData = { name, parent, label };

    // Handle image update
    if (files.image) {
      if (category.image) {
        await deleteFromCloudinary(category.image);
      }
      const imageResult = await uploadToCloudinary(files.image[0].buffer);
      updateData.image = imageResult.secure_url;
    }

    // Handle icon update
    if (files.icon) {
      if (category.icon) {
        await deleteFromCloudinary(category.icon);
      }
      const iconResult = await uploadToCloudinary(files.icon[0].buffer);
      updateData.icon = iconResult.secure_url;
    }

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    return res.json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Delete associated files from Cloudinary
    if (category.image) {
      await deleteFromCloudinary(category.image);
    }
    if (category.icon) {
      await deleteFromCloudinary(category.icon);
    }

    await Category.findByIdAndDelete(req.params.id);
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
