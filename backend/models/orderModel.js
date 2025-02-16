import mongoose from 'mongoose';
import Product from './productModel.js';

const localizedStringSchema = new mongoose.Schema(
  {
    en: { type: String, required: true, trim: true },
    ru: { type: String, trim: true },
    uk: { type: String, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'User',
    },
    email: {
      type: String,
      required: true,
    },
    orderItems: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: {
          type: localizedStringSchema,
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        discount: { type: Number, required: true },
        size: { type: Number, required: true },
        image: { type: [String], required: true },
      },
    ],
    shippingFields: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      apartament: { type: String, required: true },
      phone: { type: String, required: true },
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    paymentIntentId: {
      type: String,
      required: function () {
        return this.paymentMethod === 'stripe';
      },
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    dateOrdered: {
      type: Date,
      required: true,
      default: Date.now,
    },
    stripeFees: {
      type: Number,
      required: false,
    },
    status: {
      type: String,
      enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered'],
      required: true,
      default: 'Order Placed',
    },
    processingStartedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Middleware для заполнения поля name из Product при сохранении заказа
orderSchema.pre('validate', async function (next) {
  if (this.isNew) {
    // Only populate name when creating a new order
    try {
      for (const item of this.orderItems) {
        const product = await Product.findById(item._id);
        if (product && product.name) {
          // Ensure item.name is an object before modifying it
          if (typeof item.name !== 'object' || item.name === null) {
            item.name = { en: '', ru: '', uk: '' }; // Initialize as an empty object
          }
          item.name.en = product.name.en || '';
          item.name.ru = product.name.ru || '';
          item.name.uk = product.name.uk || '';
        } else {
          item.name = { en: '', ru: '' };
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

// Middleware для отслеживания изменения статуса
orderSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'Processing') {
      this.processingStartedAt = new Date();
    } else {
      this.processingStartedAt = null;
    }
  }
  next();
});

// Статический метод для удаления просроченных заказов
orderSchema.statics.removeExpiredProcessingOrders = async function () {
  const fiveMinutesAgo = new Date(Date.now() - 6 * 60 * 1000);

  try {
    const result = await this.deleteMany({
      status: 'Processing',
      processingStartedAt: { $lt: fiveMinutesAgo },
    });
  } catch (error) {
    console.error('Error removing expired orders:', error);
  }
};

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
