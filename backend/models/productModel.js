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
      required: true, // Будет содержать все медиафайлы (фото и видео)
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
    style: {
      type: String,
      enum: ['solitaire', 'halo', 'three-stone', 'vintage', 'cluster', 'sidestone'],
      required: false,
    },
    color: {
      type: String,
      required: false,
    },
    weight: {
      type: Number,
      required: true,
    },
    carats: {
      type: Number,

      required: false,
    },
    clarity: {
      type: String,
      enum: ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
      required: false,
    },
    purity: {
      type: Number,
      enum: [750, 585, 375, 916, 999],
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
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review',
      },
    ],
    sales: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
