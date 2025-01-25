import mongoose from 'mongoose';

// Модель для продуктов
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Убирает лишние пробелы
    },
    images: {
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
    carats: {
      type: String,
      enum: ['0.3 - 0.5', '0.51 - 0.6', '0.61 - 0.7', '0.71 - 3'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
