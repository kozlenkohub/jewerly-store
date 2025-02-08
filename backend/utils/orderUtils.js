import crypto from 'crypto';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

export function generateLiqPaySignature(data) {
  const signatureString = process.env.LIQPAY_PRIVATE_KEY + data + process.env.LIQPAY_PRIVATE_KEY;
  return crypto.createHash('sha1').update(signatureString).digest('base64');
}

export const calculateTotalPrice = async (orderItems, shippingFee) => {
  let totalPrice = 0;
  if (shippingFee) totalPrice += shippingFee;
  for (const item of orderItems) {
    const product = await Product.findById(item._id);
    if (product) {
      const discount = product.discount || 0;
      const price = product.price || 0;
      totalPrice += (price - (price * discount) / 100) * item.quantity;
    }
  }
  return totalPrice;
};

export const handlePaymentError = async (status, orderId, res) => {
  const order = await Order.findById(orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  await Order.findByIdAndDelete(orderId);
  const statusMessages = {
    err_cache: 'Order deleted due to cache error',
    failure: 'Payment failed, order deleted',
    reversed: 'Payment reversed, order deleted',
    error: 'Payment error occurred, order deleted',
  };
  return res.status(200).json({ message: statusMessages[status] || 'Order deleted' });
};

export const validateOrderData = (data) => {
  const errors = {};
  if (!data.orderItems || data.orderItems.length === 0) {
    errors.orderItems = 'No order items';
  } else {
    data.orderItems.forEach((item, index) => {
      if (!item.quantity) errors[`orderItems.${index}.quantity`] = 'Quantity is required';
      if (!item._id) errors[`orderItems.${index}._id`] = 'Product ID is required';
      if (!item.size) errors[`orderItems.${index}.size`] = 'Size is required';
    });
  }
  if (!data.shippingFields) {
    errors.shippingFields = 'Shipping address is required';
  } else {
    if (!data.shippingFields.apartament)
      errors['shippingFields.apartament'] = 'Apartment is required';
    if (!data.shippingFields.country) errors['shippingFields.country'] = 'Country is required';
    if (!data.shippingFields.zipCode) errors['shippingFields.zipCode'] = 'Zip Code is required';
    if (!data.shippingFields.city) errors['shippingFields.city'] = 'City is required';
    if (!data.shippingFields.street) errors['shippingFields.street'] = 'Street is required';
    if (!data.shippingFields.email) errors['shippingFields.email'] = 'Email is required';
    if (!data.shippingFields.phone) errors['shippingFields.phone'] = 'Phone is required';
  }
  if (!data.paymentMethod || !['cash', 'stripe', 'liqpay'].includes(data.paymentMethod)) {
    errors.paymentMethod = 'Invalid payment method. Must be either cash or stripe';
  }
  return errors;
};
