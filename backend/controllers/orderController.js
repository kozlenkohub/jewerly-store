import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/emailServices.js';
import { createOrderMessage } from '../utils/messageServices.js';
import { createPaymentIntent, confirmPaymentIntent } from '../utils/stripeService.js';

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
  if (!data.paymentMethod || !['cash', 'stripe'].includes(data.paymentMethod)) {
    errors.paymentMethod = 'Invalid payment method. Must be either cash or stripe';
  }
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

    let paymentIntent = null;
    let paymentStatus = 'pending';

    // Создаем payment intent только для метода оплаты stripe
    if (paymentMethod === 'stripe') {
      paymentIntent = await createPaymentIntent(totalPrice);
    } else if (paymentMethod === 'cash') {
      paymentStatus = 'pending'; // Для наличных статус всегда pending до подтверждения
    }

    const order = new Order({
      orderItems,
      user: userId, // Теперь это должно работать корректно
      shippingFields,
      paymentMethod,
      payment,
      totalPrice,
      email: shippingFields.email,
      paymentIntentId: paymentIntent?.id || null,
      paymentStatus,
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

    // Убираем отправку письма отсюда

    if (paymentMethod === 'stripe') {
      res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
        clientSecret: paymentIntent.client_secret,
      });
    } else {
      res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderPayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Проверяем, не был ли платеж уже подтвержден
    if (order.paymentStatus === 'paid') {
      return res.json({
        success: true,
        order,
        paymentStatus: order.paymentStatus,
        message: 'Payment was already confirmed',
      });
    }

    // Проверяем метод оплаты
    if (order.paymentMethod === 'stripe') {
      try {
        const paymentResult = await confirmPaymentIntent(order.paymentIntentId, paymentMethodId);
        order.paymentStatus = paymentResult.status === 'succeeded' ? 'paid' : 'failed';

        // Отправляем письмо только при успешной оплате через Stripe
        if (paymentResult.status === 'succeeded') {
          await sendEmail({
            email: order.shippingFields.email,
            subject: 'Successful Order Payment',
            html: createOrderMessage(order),
          });
        }
      } catch (stripeError) {
        // Если платеж уже был подтвержден, проверяем его статус
        if (stripeError.message.includes('already succeeded')) {
          order.paymentStatus = 'paid';
        } else {
          throw stripeError;
        }
      }
    } else if (order.paymentMethod === 'cash') {
      order.paymentStatus = 'paid';
    }

    await order.save();

    res.json({
      success: true,
      order,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
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
