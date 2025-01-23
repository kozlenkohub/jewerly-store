import mongoose from 'mongoose';

// Модель для продуктов
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Убирает лишние пробелы
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Цена не может быть отрицательной
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
    shape: {
      type: String,
      required: true,
      enum: [
        'Круг',
        'Овал',
        'Прямоугольник',
        'Груша',
        'Ашер',
        'Кушон',
        'Маркиз',
        'Принцесса',
        'Радиант',
        'Сердце',
        'Эмеральд',
      ],
    },
    metal: {
      type: String,
      required: true,
      enum: ['Белое Золото', 'Желтое Золото', 'Красное Золото'], // Возможные металлы
    },
    karat: {
      type: Number,
      required: true,
      enum: ['0.3 - 0.5', '0.51 - 0.6', '0.61 - 0.7', '0.71 - 3'],
    },
    sizes: {
      type: [String],
      required: true,
      enum: [15, 15.5, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5], // Массив возможных размеров
    },
    bestseller: {
      type: Boolean,
      default: false, // По умолчанию не является бестселлером
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
