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
    // Извлекаем известные параметры запроса и все остальные помещаем в unknownFilters
    const { metal, carats, price, cutForm, sort, search, ...unknownFilters } = req.query;
    const { category: paramCategory } = req.params;

    // Если присутствуют неизвестные фильтры – возвращаем пустой массив
    if (Object.keys(unknownFilters).length > 0) {
      return res.json([]);
    }

    const filter = {};
    let categoryDoc = null;

    // Фильтр по металлу
    if (metal) {
      const metals = Array.isArray(metal) ? metal : [metal];
      filter['metal.value'] = {
        $in: metals.map((m) => m.replace('-', ' ')),
      };
    }

    // Фильтр по диапазонам каратов
    if (carats) {
      const caratsRanges = Array.isArray(carats) ? carats : [carats];
      filter.$or = caratsRanges.map((range) => {
        const [minCarats, maxCarats] = range.split('-').map(Number);
        return { carats: { $gte: minCarats, $lte: maxCarats } };
      });
    }

    // Фильтр по категории (из параметров маршрута)
    if (paramCategory) {
      categoryDoc = await Category.findOne({ slug: paramCategory }).select('_id name').lean();

      if (!categoryDoc) {
        return res.status(404).json({ message: 'Category not found' });
      }

      const allCategoryIds = await getAllChildCategoryIds(categoryDoc._id);
      filter.category = { $in: allCategoryIds };
    }

    // Фильтр по цене
    if (price) {
      const [minPrice, maxPrice] = price.split('-').map(Number);
      filter.price = { $gte: minPrice, $lte: maxPrice };
    }

    // Фильтр по cutForm
    if (cutForm) {
      const forms = Array.isArray(cutForm) ? cutForm : [cutForm];
      filter['cutForm.value'] = { $in: forms };
    }

    // Фильтр по поисковой строке (регулярное выражение, без учета регистра)
    if (search) {
      filter.name = { $regex: search, $options: 'i' };
    }

    // Подготовка запроса с использованием фильтра
    let query = Product.find(filter).lean();

    // Определяем варианты сортировки
    const sortOptions = {
      'low-high': { price: 1 },
      'high-low': { price: -1 },
      relevent: { sales: -1 },
    };

    if (sort && sortOptions[sort]) {
      query = query.sort(sortOptions[sort]);
    }

    // Выполняем запрос
    const products = await query;

    // Локализация данных для клиента
    const localizedProducts = res.localizeData(products, [
      'name',
      'metal.name',
      'cutForm.name',
      'description',
    ]);
    const categoryName = categoryDoc ? res.localizeData(categoryDoc, ['name']).name : '';

    // Отправляем результат
    res.json({
      products: localizedProducts,
      categoryName,
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

    // Проверка обязательных полей
    if (!name || !price || !category || !metal) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Обработка и загрузка медиа-файлов (изображений/видео)
    let mediaUrls = [];
    if (req.files && req.files.length > 0) {
      // Проверка: если какой-либо видеофайл превышает 50MB, возвращаем ошибку
      const invalidVideo = req.files.find(
        (file) => file.mimetype.startsWith('video/') && file.size > 50 * 1024 * 1024,
      );
      if (invalidVideo) {
        return res.status(400).json({ message: 'Video file size must be less than 50MB' });
      }

      // Загружаем все файлы параллельно
      mediaUrls = await Promise.all(
        req.files.map(async (file) => {
          const isVideo = file.mimetype.startsWith('video/');
          const result = await uploadToCloudinary(file.buffer, isVideo ? 'video' : 'image');
          return `${result.secure_url}${isVideo ? '#video' : '#image'}`;
        }),
      );
    }

    // Поиск категории по _id или shortId
    const categoryDoc = await Category.findOne({
      $or: [{ _id: category }, { shortId: category }],
    });
    if (!categoryDoc) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Формирование данных для нового продукта
    const newProductData = {
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
    };

    const newProduct = new Product(newProductData);
    await newProduct.save();

    res.status(201).json({
      message: 'Product added successfully',
      product: newProduct,
    });
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
      en: 'ENGAGEMENT RING WITH 0.50 CT ROUND CUT DIAMOND IN Yellow GOLD',
      ru: 'КОЛЬЦО ДЛЯ ПОМОЛВКИ С БРИЛЛИАНТОМ 0,50 CT ОГРАНКИ «КРУГ» ИЗ ЖЁЛТОГО ЗОЛОТА',
      uk: 'КАБЛУЧКА ДЛЯ ЗАРУЧИН З ДІАМАНТОМ 0,50 CT ОГРАНКИ «КРУГ» З ЖОВТОГО ЗОЛОТА',
    },
    description: {
      en: 'A stunning engagement ring crafted from white gold, featuring a round cut diamond with a clarity of SI1 and a carat weight of 0.37. This solitaire style ring is perfect for a timeless and elegant proposal.',
      ru: 'Потрясающее кольцо для помолвки, изготовленное из белого золота, с круглым бриллиантом чистоты SI1 и весом 0.37 карата. Это кольцо в стиле солитер идеально подходит для вечного и элегантного предложения.',
      uk: 'Приголомшливе кільце для заручин, виготовлене з білого золота, з круглим діамантом чистоти SI1 і вагою 0.37 карата. Це кільце в стилі солітер ідеально підходить для вічної та елегантної пропозиції.',
    },
    price: 160000,
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/494/2ng95apsen494-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/5ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/1ng95apsen1348-1000x1000.webp',
    ],
    category: null,
    collection: '1',
    size: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
    discount: 20,
    bestseller: true,
    metal: {
      value: 'yellow gold',
    },
    cutForm: {
      value: 'round',
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
  {
    name: {
      en: 'ENGAGEMENT RING WITH 0.50 CT ROUND CUT DIAMOND IN ROSE GOLD',
      ru: 'КОЛЬЦО ДЛЯ ПОМОЛВКИ С БРИЛЛИАНТОМ 0,50 CT ОГРАНКИ «КРУГ» ИЗ РОЗОВОГО ЗОЛОТА',
      uk: 'КАБЛУЧКА ДЛЯ ЗАРУЧИН З ДІАМАНТОМ 0,50 CT ОГРАНКИ «КРУГ» З РОЖЕВОГО ЗОЛОТА',
    },
    description: {
      en: 'A stunning engagement ring crafted from rose gold, featuring a round cut diamond with a clarity of SI1 and a carat weight of 0.37. This solitaire style ring is perfect for a timeless and elegant proposal.',
      ru: 'Потрясающее кольцо для помолвки, изготовленное из розового золота, с круглым бриллиантом чистоты SI1 и весом 0.37 карата. Это кольцо в стиле солитер идеально подходит для вечного и элегантного предложения.',
      uk: 'Приголомшливе кільце для заручин, виготовлене з рожевого золота, з круглим діамантом чистоти SI1 і вагою 0.37 карата. Це кільце в стилі солітер ідеально підходить для вічної та елегантної пропозиції.',
    },
    price: 160000,
    image: [
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/3ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/1ng95apsen1348-1000x1000.webp',
      'https://apsen-diamond.com.ua/image/cachewebp/catalog/1348/2ng95apsen1348-1000x1000.webp',
    ],
    category: null,
    collection: '1',
    size: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
    discount: 20,
    bestseller: true,
    metal: {
      value: 'rose gold',
    },
    cutForm: {
      value: 'round',
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
    const productId = req.params.id;

    const product = await Product.findById(productId).populate('reviews').lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Выполнение запросов параллельно для оптимизации
    const [relatedProducts, anotherVariation] = await Promise.all([
      Product.find({ category: product.category, _id: { $ne: product._id } })
        .limit(5)
        .lean(),
      Product.find({ collection: product.collection, _id: { $ne: product._id } })
        .select('_id metal')
        .lean(),
    ]);

    // Локализация данных (проверяем доступность метода)
    const localizeData = res.localizeData || ((data) => data);

    res.json({
      product: localizeData(product, ['name', 'metal.name', 'cutForm.name', 'description']),
      relatedProducts: localizeData(relatedProducts, [
        'name',
        'metal.name',
        'cutForm.name',
        'description',
      ]),
      anotherVariation: localizeData(anotherVariation, [
        'name',
        'metal.name',
        'cutForm.name',
        'description',
      ]),
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'An error occurred while retrieving the product' });
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
