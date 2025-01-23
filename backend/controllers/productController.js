import { v2 as cloudinary } from 'cloudinary';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const getProducts = async (req, res) => {
  try {
    const { shape, metal, karat, category } = req.query;
    const filter = {};

    if (shape) filter.shape = shape;
    if (metal) filter.metal = metal;
    if (karat) filter.karat = karat;
    if (category) {
      const categoryDoc = await Category.findOne({
        $or: [{ _id: category }, { shortId: category }],
      });
      if (categoryDoc) {
        filter.category = categoryDoc._id;
      } else {
        return res.status(404).json({ message: 'Category not found' });
      }
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
