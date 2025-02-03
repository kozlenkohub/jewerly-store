import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/emailServices.js';
import { createOrderMessage } from '../utils/messageServices.js';
import { createPaymentIntent } from '../utils/stripeService.js';

const validateOrderData = (data) => {
  const errors = {};
  if (!data.orderItems || data.orderItems.length === 0) {
    errors.orderItems = 'No order items';
  } else {
    data.orderItems.forEach((item, index) => {
      if (!item.quantity) errors[`orderItems.${index}.quantity`] = 'Quantity is required';
      if (!item._id) errors[`orderItems.${index}._id`] = 'Product ID is required';
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
  }
  if (!data.paymentMethod) errors.paymentMethod = 'Payment method is required';
  if (!data.payment) errors.payment = 'Payment is required';
  return errors;
};

const calculateTotalPrice = async (orderItems, shippingFee) => {
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

export const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingFields, shippingFee, paymentMethod, payment } = req.body;
    const userId = req.userId; // Теперь берем userId из req.userId, а не из req.body.userId

    const errors = validateOrderData(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please enter all fields', errors });
    }

    const totalPrice = await calculateTotalPrice(orderItems, shippingFee);

    const order = new Order({
      orderItems,
      user: userId, // Теперь это должно работать корректно
      shippingFields,
      paymentMethod,
      payment,
      totalPrice,
      email: shippingFields.email,
    });

    const savedOrder = await order.save();

    // Update product sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
    }

    // Clear cart only for authenticated users
    if (userId) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }
    console.log(savedOrder);

    await sendEmail({
      email: shippingFields.email,
      subject: 'Successful Order',
      html: createOrderMessage(savedOrder),
    });
    res.status(201).json({ message: 'Order Created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const { orderItems, shippingFields, paymentMethod, userId } = req.body;

    const errors = validateOrderData({
      ...req.body,
      payment: true,
    });

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const totalPrice = await calculateTotalPrice(orderItems);
    const paymentIntent = await createPaymentIntent(totalPrice);

    // Store order data in session or return it to frontend
    res.status(200).json({
      orderData: { orderItems, shippingFields, paymentMethod, totalPrice, userId },
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe order error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const confirmStripePayment = async (req, res) => {
  try {
    const { orderData } = req.body;
    const userId = orderData.userId; // Get userId from orderData instead of req.userId

    const order = new Order({
      orderItems: orderData.orderItems,
      user: userId,
      shippingFields: orderData.shippingFields,
      paymentMethod: orderData.paymentMethod,
      payment: true,
      totalPrice: orderData.totalPrice,
      status: 'Processing',
      email: orderData.shippingFields.email,
    });

    const savedOrder = await order.save();

    // Update product sales
    for (const item of orderData.orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
    }

    // Clear cart for authenticated users
    if (userId) {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    // Send confirmation email
    await sendEmail({
      email: orderData.shippingFields.email,
      subject: 'Successful Order',
      html: createOrderMessage(savedOrder),
    });

    res.json({ success: true, order: savedOrder });
  } catch (error) {
    console.error('Payment confirmation error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const userOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.body.userId }).sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLastOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ user: req.body.userId }).sort({ createdAt: -1 });
    res.json({ ...order.shippingFields });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).limit(10);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
