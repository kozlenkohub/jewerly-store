import Category from '../models/categoryModel.js';

export const createCategory = async (req, res) => {
  try {
    const { name, parent, icon, slug } = req.body; // Include slug
    const newCategory = new Category({ name, parent, icon, slug }); // Include slug
    await newCategory.save();
    return res.status(201).json(newCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    // Получение всех категорий
    const categories = await Category.find().lean();

    // Создаем объект для быстрого доступа по `_id`
    const categoriesMap = {};
    categories.forEach((category) => {
      categoriesMap[category._id] = { ...category, children: [] };
    });

    // Формируем иерархическое дерево
    const rootCategories = [];
    categories.forEach((category) => {
      if (category.parent) {
        // Если есть родитель, добавляем текущую категорию в массив `children` родителя
        categoriesMap[category.parent]?.children.push(categoriesMap[category._id]);
      } else {
        // Если нет родителя, это корневая категория
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
    const { name, parent, icon } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, parent, icon },
      { new: true },
    );
    if (!updatedCategory) return res.status(404).json({ message: 'Category not found' });
    return res.json(updatedCategory);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const removed = await Category.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ message: 'Category not found' });
    return res.json({ message: 'Category deleted' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};
