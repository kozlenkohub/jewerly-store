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
