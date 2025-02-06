import mongoose from 'mongoose';
import { metalTranslations, cutFormTranslations } from '../constants/translations.js';

const localizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ru: { type: String, trim: true },
    uk: { type: String, trim: true },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    name: { type: localizedStringSchema, required: true },
    image: { type: [String], required: true }, // Все медиафайлы (фото и видео)
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: false },
    metal: {
      type: {
        value: { type: String, enum: ['white gold', 'yellow gold', 'rose gold'], required: true },
        name: { type: localizedStringSchema, required: false },
      },
      required: true,
    },
    cutForm: {
      type: {
        value: {
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
        name: { type: localizedStringSchema, required: false },
      },
      required: true,
    },
    style: {
      type: String,
      enum: ['solitaire', 'halo', 'three-stone', 'vintage', 'cluster', 'sidestone'],
    },
    color: String,
    weight: { type: Number, required: true },
    carats: Number,
    clarity: {
      type: String,
      enum: ['IF', 'VVS1', 'VVS2', 'VS1', 'VS2', 'SI1', 'SI2', 'I1', 'I2', 'I3'],
    },
    purity: { type: Number, enum: [750, 585, 375, 916, 999] },
    collection: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    bestseller: { type: Boolean, default: false },
    description: { type: localizedStringSchema, required: true },
    size: {
      type: [Number],
      enum: Array.from({ length: 10 }, (_, i) => 15 + i * 0.5),
      required: true,
    },
    isAvailable: { type: Boolean, default: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review', default: [] }],
    sales: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Merge validation and auto-assign middleware in pre('validate')
productSchema.pre('validate', function (next) {
  // Validate and auto-set metal
  if (this.metal && this.metal.value) {
    const metalTrans = metalTranslations[this.metal.value];
    if (!metalTrans) {
      this.invalidate(
        'metal.value',
        `Metal type '${this.metal.value}' does not exist in translations`,
      );
    } else {
      this.metal.name = this.metal.name || metalTrans;
    }
  }
  // Validate and auto-set cutForm
  if (this.cutForm && this.cutForm.value) {
    const cutTrans = cutFormTranslations[this.cutForm.value];
    if (!cutTrans) {
      this.invalidate(
        'cutForm.value',
        `Cut form '${this.cutForm.value}' does not exist in translations`,
      );
    } else {
      this.cutForm.name = this.cutForm.name || cutTrans;
    }
  }
  next();
});

// Removed: pre('save') middleware as auto-assignment now happens in pre('validate')

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
