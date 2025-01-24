import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const getProducts = async (req, res) => {
  try {
    const { metal, category, ...unknownFilters } = req.query;
    const filter = {};

    // Check for unknown filters
    if (Object.keys(unknownFilters).length > 0) {
      return res.json([]); // Return message if unknown filters are present
    }

    if (metal) filter.metal = { $in: metal }; // Используем $in для массива металлов
    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).json({ message: 'Invalid category ID' });
      }
      const categoryDoc = await Category.findById(category);
      if (!categoryDoc) return res.status(404).json({ message: 'Category not found' });
      filter.category = categoryDoc._id;
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, price, images, category, shape, metal, karat, sizes, bestseller, description } =
      req.body;

    // Найти категорию по shortId или _id
    if (!mongoose.isValidObjectId(category)) {
      return res.status(400).json({ message: 'Invalid category ID' });
    }
    const categoryDoc = await Category.findOne({
      $or: [{ _id: category }, { shortId: category }],
    });
    if (!categoryDoc) return res.status(404).json({ message: 'Category not found' });

    // Создать продукт
    const newProduct = new Product({
      name,
      price,
      images,
      category: categoryDoc._id, // Сохраняем ObjectId категории
      shape,
      metal,
      karat,
      sizes,
      bestseller,
      description,
    });

    await newProduct.save();
    res.json({ message: 'Product added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
