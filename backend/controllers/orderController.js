import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/emailServices.js';
import { createOrderMessage } from '../utils/messageServices.js';
import { createPaymentIntent, confirmPaymentIntent } from '../utils/stripeService.js';
import crypto from 'crypto';

const { LIQPAY_PUBLIC_KEY, LIQPAY_PRIVATE_KEY } = process.env;

function generateLiqPaySignature(data) {
  const signatureString = LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY;
  return crypto.createHash('sha1').update(signatureString).digest('base64');
}

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
    if (!data.shippingFields.phone) errors['shippingFields.phone'] = 'Phone is required';
  }
  if (!data.paymentMethod || !['cash', 'stripe', 'liqpay'].includes(data.paymentMethod)) {
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
    let paymentIntentId = null;
    let stripeFees = null;

    const order = new Order({
      orderItems,
      user: userId,
      shippingFields,
      paymentMethod,
      payment,
      totalPrice,
      email: shippingFields.email,
      paymentIntentId,
      paymentStatus,
      shippingFee,
      stripeFees,
    });

    const savedOrder = await order.save(); // Save the order first
    const orderId = savedOrder._id;
    // Use savedOrder._id

    if (paymentMethod === 'liqpay') {
      const paymentData = {
        public_key: LIQPAY_PUBLIC_KEY,
        version: '3',
        action: 'pay',
        amount: totalPrice,
        currency: 'UAH',
        description: 'Order payment: ' + orderId,
        order_id: orderId,
        result_url: 'http://localhost:3000',
        server_url: 'https://jewerly-server.onrender.com/api/orders/payment-callback',
        sandbox: 1,
      };

      const base64Data = Buffer.from(JSON.stringify(paymentData)).toString('base64');
      const signature = generateLiqPaySignature(base64Data);

      const form = `
    <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
      <input type="hidden" name="data" value="${base64Data}" />
      <input type="hidden" name="signature" value="${signature}" />
      <button type="submit">Pay Now</button>
    </form>
  `;

      return res.status(200).send(form);
    }

    if (paymentMethod === 'stripe') {
      paymentIntent = await createPaymentIntent(totalPrice);
      paymentIntentId = paymentIntent.id;
      stripeFees = paymentIntent.calculatedFees;
    }

    // Update product sales
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
    }

    // Clear cart only for authenticated users
    if (userId && paymentMethod === 'cash') {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    if (paymentMethod === 'cash') {
      await sendEmail({
        email: shippingFields.email,
        subject: 'Order Confirmation',
        html: createOrderMessage(savedOrder),
      });
    }

    if (paymentMethod === 'stripe') {
      return res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        commision: stripeFees,
      });
    } else {
      return res.status(201).json({
        paymentMethod,
        message: 'Order Created',
        orderId: savedOrder._id,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message }); // Add return statement here
  }
};

export const paymentCallback = async (req, res) => {
  try {
    const { order_id, status, data, signature } = req.body;
    const order = await Order.findById(order_id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Важный шаг: проверка подписи для безопасности
    // Предполагаем, что приватный ключ хранится в .env
    const expectedSignature = crypto
      .createHash('sha1')
      .update(LIQPAY_PRIVATE_KEY + data + LIQPAY_PRIVATE_KEY)
      .digest('base64');

    if (signature !== expectedSignature) {
      return res.status(400).json({ message: 'Invalid signature' });
    }

    if (status === 'success') {
      order.paymentStatus = 'paid';
      await order.save();

      // Отправляем подтверждение на email клиента
      await sendEmail({
        email: order.shippingFields.email,
        subject: 'Order Payment Confirmation',
        html: createOrderMessage(order),
      });

      return res.status(200).json({ message: 'Payment successful' });
    } else if (status === 'failure' || status === 'error') {
      return res.status(400).json({ message: 'Payment failed' });
    } else {
      return res.status(400).json({ message: 'Unknown payment status' });
    }
  } catch (error) {
    console.error('Error processing payment callback:', error);
    return res.status(500).json({ message: error.message });
  }
};

export const updateOrderPayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;
    const userId = req.userId; // Получаем из middleware auth

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Проверяем, принадлежит ли заказ пользователю
    if (order.user && order.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order',
      });
    }

    // Check if payment was already confirmed
    if (order.paymentStatus === 'paid') {
      // Очищаем корзину даже если платеж уже был подтвержден
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          {
            cartData: {},
          },
          { new: true },
        ); // добавляем { new: true } для получения обновленного документа
      }
      return res.json({
        success: true,
        order,
        paymentStatus: order.paymentStatus,
        message: 'Payment was already confirmed',
      });
    }

    await User.findByIdAndUpdate(userId, { cartData: {} });

    const previousStatus = order.paymentStatus;

    // Handle payment method specific logic
    if (order.paymentMethod === 'stripe') {
      try {
        const paymentResult = await confirmPaymentIntent(order.paymentIntentId, paymentMethodId);
        order.paymentStatus = paymentResult.status === 'succeeded' ? 'paid' : 'failed';
      } catch (stripeError) {
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

    // Send email only when status changes to 'paid'
    if (previousStatus !== 'paid' && order.paymentStatus === 'paid') {
      await sendEmail({
        email: order.shippingFields.email,
        subject: 'Successful Order Payment',
        html: createOrderMessage(order),
      });
    }

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
