import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Product',
        },
        name: { type: String, required: true },
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
    payment: {
      type: Boolean,
      required: false,
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
    status: {
      type: String,
      required: true,
      default: 'Order Placed',
    },
  },
  {
    timestamps: true,
  },
);

const orderModel = mongoose.models.Order || mongoose.model('Order', orderSchema);

export default orderModel;
