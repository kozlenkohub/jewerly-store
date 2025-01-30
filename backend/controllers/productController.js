import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';
import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';

async function getAllChildCategoryIds(catId, collected = []) {
  collected.push(catId);
  const currentCat = await Category.findById(catId).select('children');
  if (currentCat && currentCat.children) {
    for (const child of currentCat.children) {
      await getAllChildCategoryIds(child, collected);
    }
  }
  return collected;
}

export const getProducts = async (req, res) => {
  try {
    const { metal, carats, price, cutForm, sort, search, ...unknownFilters } = req.query;
    const { category: paramCategory } = req.params;

    const filter = {};
    let categoryDoc = null;

    // Check for unknown filters
    if (Object.keys(unknownFilters).length > 0) {
      return res.json([]); // Return message if unknown filters are present
    }

    if (metal) filter.metal = { $in: metal }; // Используем $in для массива металлов
    if (carats) {
      const caratsRanges = Array.isArray(carats) ? carats : [carats];
      filter.$or = caratsRanges.map((range) => {
        const [minCarats, maxCarats] = range.split('-').map(Number);
        return { carats: { $gte: minCarats, $lte: maxCarats } };
      });
    }
    if (paramCategory) {
      categoryDoc = await Category.findOne({ slug: paramCategory }).select('_id name');
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

    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    let query = Product.find(filter);
    if (sort) {
      if (sort === 'low-high') query = query.sort({ price: 1 });
      else if (sort === 'high-low') query = query.sort({ price: -1 });
    }
    const products = await query;
    res.json({ products, categoryName: categoryDoc ? categoryDoc.name : '' });
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
    name: 'Серьги с бриллиантами в огранке «Круг» из желтого золота',
    description:
      'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    price: 160000,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cumque doloribus voluptas assumenda corrupti dignissimos laudantium numquam et. Velit ex recusandae quaerat ducimus officia rerum, neque ratione repudiandae porro. Facere, optio unde velit assumenda quidem numquam. Ipsum voluptatibus ad quasi suscipit sequi consectetur commodi numquam nulla voluptates iste odio ',
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/494/2ng95apsen494-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/5ng95apsen1348-1000x1000.webp',

      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/1ng95apsen1348-1000x1000.webp',
    ],
    category: '6797b7419efe656b1d2bbd8e',
    collection: 'kiev',
    size: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
    discount: 20,
    bestseller: true,
    metal: 'yellow gold',
    cutForm: 'round',
    style: 'solitaire',
    clarity: 'SI1',
    purity: 750,
    color: 'H',
    carats: 0.57,
    weight: 2.3,
  },
  {
    name: 'Серьги с бриллиантами в огранке «Круг» из красного золота',
    description:
      'A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves, worn as an undershirt or outer garment.',
    price: 160000,
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam cumque doloribus voluptas assumenda corrupti dignissimos laudantium numquam et. Velit ex recusandae quaerat ducimus officia rerum, neque ratione repudiandae porro. Facere, optio unde velit assumenda quidem numquam. Ipsum voluptatibus ad quasi suscipit sequi consectetur commodi numquam nulla voluptates iste odio ',
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/2ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/5ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/1ng95apsen1348-1000x1000.webp',
    ],
    category: '6797b7419efe656b1d2bbd8e',
    collection: 'kiev',
    size: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
    discount: 20,
    bestseller: true,
    metal: 'rose gold',
    cutForm: 'round',
    style: 'solitaire',
    clarity: 'SI1',
    purity: 750,
    color: 'H',
    carats: 0.57,
    weight: 2.3,
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

// by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(5);

    const anotherVariation = await Product.find({
      collection: product.collection,
      _id: { $ne: product._id },
    }).select('_id metal');

    res.json({ product, relatedProducts, anotherVariation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
