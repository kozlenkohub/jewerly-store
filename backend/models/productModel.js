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
      enum: ['gold', 'silver'],
      required: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
