import mongoose from 'mongoose';

// Модель для продуктов
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Убирает лишние пробелы
    },
    image: {
      type: [String],
      required: true, // Массив путей к изображениям
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category', // Связь с категорией
      required: true,
    },
    metal: {
      type: String,
      enum: ['white gold', 'yellow gold', 'rose gold'],
      required: true,
    },
    cutForm: {
      type: String,
      enum: [
        'asher',
        'pear',
        'round',
        'cushion',
        'marquise',
        'oval',
        'princess',
        'radiant',
        'heart',
        'emerald',
      ],
      required: true,
    },
    carats: {
      type: String,
      enum: ['0.3 - 0.5', '0.51 - 0.6', '0.61 - 0.7', '0.71 - 3'],
      required: false,
    },
    collection: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
      required: true,
    },
    size: {
      type: [Number],
      enum: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
