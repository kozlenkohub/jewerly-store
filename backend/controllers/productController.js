import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

export const getProducts = async (req, res) => {
  try {
    const { metal, carats, price, cutForm, ...unknownFilters } = req.query;
    const { category: paramCategory } = req.params;

    const filter = {};

    // Helper to gather all child category IDs recursively
    async function getAllChildCategoryIds(catId) {
      const queue = [catId];
      const allIds = [];
      while (queue.length) {
        const currentId = queue.shift();
        allIds.push(currentId);
        const currentCat = await Category.findById(currentId).select('children');
        if (currentCat && currentCat.children) {
          for (const child of currentCat.children) {
            queue.push(child);
          }
        }
      }
      return allIds;
    }

    // Check for unknown filters
    if (Object.keys(unknownFilters).length > 0) {
      return res.json([]); // Return message if unknown filters are present
    }

    if (metal) filter.metal = { $in: metal }; // Используем $in для массива металлов
    if (carats) filter.carats = { $in: carats }; // Используем $in для массива карат
    if (paramCategory) {
      const categoryDoc = await Category.findOne({ slug: paramCategory }).select('_id');
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      const allCategoryIds = await getAllChildCategoryIds(categoryDoc._id);
      filter.category = { $in: allCategoryIds };
    }
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    if (cutForm) {
      filter.cutForm = { $in: cutForm };
    }

    const products = await Product.find(filter);
    res.json(products);
  } catch (error) {
    console.error('Error in getProducts:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const { name, image, category, metal, price } = req.body;

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
      image,
      category: categoryDoc._id, // Сохраняем ObjectId категории
      metal,
      carats,
      price,
    });

    await newProduct.save();
    res.json({ message: 'Product added' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

const products = [
  {
    name: 'Серьги с бриллиантами в огранке «Круг» из белого золота',
    description:
      'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    price: 160000,
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1017/new_photo/1_607-1000x1000.webp',
    ],
    category: '6797b7419efe656b1d2bbd8e',
    discount: 20,
    bestseller: true,
    metal: 'white gold',
    cutForm: 'round',
  },
];

// Function to insert products array into the database
export const insertProducts = async (req, res) => {
  try {
    await Product.insertMany(products);
    res.json({ message: 'Products inserted successfully' });
  } catch (error) {
    console.error('Error inserting products:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};
