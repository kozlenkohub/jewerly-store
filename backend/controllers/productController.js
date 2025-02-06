import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import Review from '../models/reviewModel.js';
import User from '../models/userModel.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

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

    // Handle 'metal' filter
    if (metal) {
      // Normalize the metal value by replacing hyphens with spaces
      const metals = Array.isArray(metal) ? metal : [metal];
      filter.metal = { $in: metals.map((m) => m.replace('-', ' ')) };
    }

    // Handle 'carats' filter
    if (carats) {
      const caratsRanges = Array.isArray(carats) ? carats : [carats];
      filter.$or = caratsRanges.map((range) => {
        const [minCarats, maxCarats] = range.split('-').map(Number);
        return { carats: { $gte: minCarats, $lte: maxCarats } };
      });
    }

    // Handle 'category' filter
    if (paramCategory) {
      categoryDoc = await Category.findOne({ slug: paramCategory }).select('_id name').lean();
      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }
      const allCategoryIds = await getAllChildCategoryIds(categoryDoc._id);
      filter.category = { $in: allCategoryIds };
    }

    // Handle 'price' filter
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Handle 'cutForm' filter
    if (cutForm) {
      filter.cutForm = { $in: cutForm };
    }

    // Handle 'search' filter
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Prepare the query
    let query = Product.find(filter).lean();

    // Handle 'sort' filter
    if (sort) {
      if (sort === 'low-high') query = query.sort({ price: 1 });
      else if (sort === 'high-low') query = query.sort({ price: -1 });
      else if (sort === 'relevent') query = query.sort({ sales: -1 });
    }

    // Execute the query
    const products = await query;

    // Return the response
    res.json({
      products: res.localizeData(products, ['name', 'metal.name', 'cutForm.name', 'description']),
      categoryName: categoryDoc ? res.localizeData(categoryDoc, ['name']).name : '',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      collection,
      size,
      discount,
      bestseller,
      metal,
      cutForm,
      style,
      clarity,
      purity,
      color,
      carats,
      weight,
    } = req.body;

    const mediaUrls = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const isVideo = file.mimetype.startsWith('video/');

        if (isVideo && file.size > 50 * 1024 * 1024) {
          return res.status(400).json({ message: 'Video file size must be less than 50MB' });
        }

        const result = await uploadToCloudinary(file.buffer, isVideo ? 'video' : 'image');
        mediaUrls.push(`${result.secure_url}${isVideo ? '#video' : '#image'}`);
      }
    }

    // Validate required fields
    if (!name || !price || !category || !metal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Find category
    const categoryDoc = await Category.findOne({
      $or: [{ _id: category }, { shortId: category }],
    });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Create new product with null checks for numeric fields
    const newProduct = new Product({
      name,
      description,
      price: Number(price) || 0,
      image: mediaUrls,
      category: categoryDoc._id,
      collection,
      size: Array.isArray(size) ? size : size ? [size] : [],
      discount: Number(discount) || 0,
      bestseller: Boolean(bestseller),
      metal,
      cutForm,
      style,
      clarity,
      purity: purity ? Number(purity) : undefined,
      color,
      carats: carats ? Number(carats) : undefined,
      weight: Number(weight) || 0,
      reviews: [],
    });

    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({
      message: 'Server Error',
      error: error.message,
      details: error.errors,
    });
  }
};

const products = [
  {
    name: {
      en: 'Engagement Ring',
      ru: 'Кольцо для Помолвки',
    },
    description: {
      en: 'lorem228',
      ru: '',
    },
    price: 160000,
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/494/2ng95apsen494-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/5ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/1ng95apsen1348-1000x1000.webp',
    ],
    category: '67a24fa954fb707082c036f4',
    collection: 'kiev',
    size: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5), // Автоматическая генерация размеров
    discount: 20,
    bestseller: true,
    metal: {
      value: 'white gold',
      name: {
        en: 'White Gold',
        ru: 'Белое золото',
      },
    },
    cutForm: {
      value: 'round',
      name: {
        en: 'Round',
        ru: 'Круглый',
      },
    },
    style: 'solitaire',
    clarity: 'SI1',
    purity: 750,
    color: 'H',
    carats: 0.37,
    weight: 2.3,
    isAvailable: true,
    reviews: [],
    sales: 0,
  },
];

// Function to insert products array into the database
export const insertProducts = async (req, res) => {
  try {
    await Product.insertMany(products);
    res.json({ message: 'Products inserted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// by id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('reviews').lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    })
      .limit(5)
      .lean();

    const anotherVariation = await Product.find({
      collection: product.collection,
      _id: { $ne: product._id },
    })
      .select('_id metal')
      .lean();

    res.json({
      product: res.localizeData(product, ['name', 'metal.name', 'cutForm.name', 'description']), // Убрали массив
      relatedProducts: res.localizeData(relatedProducts, [
        'name',
        'metal.name',
        'cutForm.name',
        'description',
      ]),
      anotherVariation: res.localizeData(anotherVariation, [
        'name',
        'metal.name',
        'cutForm.name',
        'description',
      ]),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, userId } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name } = user;

    const review = new Review({
      user: userId,
      name,
      rating,
      comment,
    });

    await review.save();

    product.reviews.push(review._id);
    await product.save();

    res.status(201).json({ message: 'Review added', review });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete images from Cloudinary
    for (const imageUrl of product.image) {
      const publicId = imageUrl.split('/').pop().split('.')[0];
      await deleteFromCloudinary(publicId);
    }

    await product.remove();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
