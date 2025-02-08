import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import sendEmail from '../utils/emailServices.js';
import { createOrderMessage } from '../utils/messageServices.js';
import { createPaymentIntent, confirmPaymentIntent } from '../utils/stripeService.js';
import { bot } from '../telegram/bot.js';
import { sendOrderNotification } from '../telegram/handlers/orderHandlers.js';
import {
  validateOrderData,
  calculateTotalPrice,
  generateLiqPaySignature,
} from '../utils/orderUtils.js';

const { LIQPAY_PUBLIC_KEY } = process.env;

export const placeOrder = async (req, res) => {
  try {
    const { orderItems, shippingFields, shippingFee, paymentMethod } = req.body;
    const userId = req.userId;

    // Валидация данных заказа
    const errors = validateOrderData(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please enter all fields', errors });
    }

    // Расчёт итоговой цены
    const totalPrice = await calculateTotalPrice(orderItems, shippingFee);

    // Подготовка общих данных заказа
    let orderData = {
      orderItems,
      user: userId,
      shippingFields,
      paymentMethod,
      totalPrice,
      email: shippingFields.email,
      shippingFee,

      paymentStatus: 'paid',
      status: 'Processing',
      paymentIntentId: null,
      stripeFees: null,
    };

    let stripePaymentIntent = null;

    if (paymentMethod === 'stripe') {
      stripePaymentIntent = await createPaymentIntent(totalPrice);
      orderData.paymentIntentId = stripePaymentIntent.id;
      orderData.paymentStatus = 'pending';
      orderData.stripeFees = stripePaymentIntent.calculatedFees;
    } else if (paymentMethod === 'cash') {
      orderData.status = 'Order Placed';
    }

    // Создание и сохранение заказа
    const order = new Order(orderData);
    const savedOrder = await order.save();

    if (paymentMethod === 'cash') {
      for (const item of orderItems) {
        await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
      }
    }

    // Очистка корзины для авторизованных пользователей при оплате наличными
    if (userId && paymentMethod === 'cash') {
      await User.findByIdAndUpdate(userId, { cartData: {} });
    }

    if (paymentMethod === 'stripe') {
      return res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
        clientSecret: stripePaymentIntent.client_secret,
        amount: stripePaymentIntent.amount,
        commision: stripePaymentIntent.calculatedFees,
      });
    } else if (paymentMethod === 'cash') {
      await sendEmail({
        email: shippingFields.email,
        subject: 'Order Confirmation',
        html: createOrderMessage(savedOrder),
      });
      await sendOrderNotification(bot, savedOrder);
      return res.status(201).json({
        message: 'Order Created',
        paymentMethod,
        orderId: savedOrder._id,
      });
    } else if (paymentMethod === 'liqpay') {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + 5 * 60000); // +5 минут
      const expired_date = expirationDate.toISOString().slice(0, 19).replace('T', ' ');

      const paymentData = {
        public_key: LIQPAY_PUBLIC_KEY,
        customer: userId || 'guest',
        version: '3',
        action: 'pay',
        amount: totalPrice,
        expired_date, // формат: "YYYY-MM-DD HH:mm:ss"
        currency: 'UAH',
        description: 'Order payment: ' + savedOrder._id,
        order_id: savedOrder._id,
        result_url: 'https://jewerly-store.vercel.app',
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
    } else {
      // Ветка для неизвестных способов оплаты
      return res.status(201).json({
        paymentMethod,
        message: 'Order Created',
        orderId: savedOrder._id,
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const handlePaymentError = async (status, orderId, res) => {
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

export const paymentCallback = async (req, res) => {
  try {
    const { data, signature } = req.body;

    if (!data || !signature) {
      return res.status(400).json({ message: 'Отсутствуют обязательные параметры' });
    }

    const decodedData = Buffer.from(data, 'base64').toString('utf-8');
    console.log('decodedData:', decodedData);

    const expectedSignature = generateLiqPaySignature(data);

    if (signature !== expectedSignature) {
      console.error('Несовпадение подписей!');
      return res.status(400).json({
        message: 'Неверная подпись',
        details: {
          received: signature,
          expected: expectedSignature,
        },
      });
    }

    const paymentData = JSON.parse(decodedData);

    const userId = paymentData.customer === 'guest' ? null : paymentData.customer;

    if (paymentData.status === 'sandbox') {
      const order = await Order.findById(paymentData.order_id);
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      if (userId) {
        await User.findByIdAndUpdate(
          userId,
          {
            cartData: {},
          },
          { new: true },
        );
      }

      order.paymentStatus = 'paid';
      order.status = 'Order Placed'; // Update status on successful payment
      order.paymentIntentId = paymentData.payment_id;

      await order.save();

      // Send Telegram notification for successful payment
      await sendOrderNotification(bot, order);

      // Отправка письма об успешной оплате
      await sendEmail({
        email: order.shippingFields.email,
        subject: 'Successful Order Payment',
        html: createOrderMessage(order),
      });

      return res.status(200).json({ message: 'Payment successful' });
    }

    if (['err_cache', 'failure', 'reversed', 'error'].includes(paymentData.status)) {
      await handlePaymentError(paymentData.status, paymentData.order_id, res);
    }

    // Обработка других статусов
    return res.status(400).json({ message: 'Payment failed' });
  } catch (error) {
    console.error('Ошибка обработки платежного callback:', error);
    return res.status(500).json({
      message: 'Внутренняя ошибка сервера',
      error: error.message,
    });
  }
};

export const updateOrderPayment = async (req, res) => {
  try {
    const { orderId, paymentMethodId } = req.body;
    const userId = req.userId;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

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

    try {
      const paymentResult = await confirmPaymentIntent(order.paymentIntentId, paymentMethodId);
      order.paymentStatus = paymentResult.status === 'succeeded' ? 'paid' : 'failed';
      if (order.paymentStatus === 'paid') {
        order.status = 'Order Placed'; // Update status on successful payment
      }
    } catch (stripeError) {
      if (stripeError.message.includes('already succeeded')) {
        order.paymentStatus = 'paid';
        order.status = 'Order Placed'; // Update status on successful payment
      } else {
        throw stripeError;
      }
    }

    await order.save();

    // Send email only when status changes to 'paid'
    if (previousStatus !== 'paid' && order.paymentStatus === 'paid') {
      await sendEmail({
        email: order.shippingFields.email,
        subject: 'Successful Order Payment',
        html: createOrderMessage(order),
      });

      // Добавляем уведомление при успешной оплате
      await sendOrderNotification(bot, order);
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
    const orders = await Order.find({
      user: req.body.userId,
      status: { $ne: 'Processing' },
    }).sort({ createdAt: -1 });
    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found' });
    }
    res.json(res.localizeData(orders, ['orderItems']));
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
