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

  const signature = crypto.createHash('sha1').update(signatureString).digest('base64');

  return signature;
}

const validateOrderData = (data) => {
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

    // For Stripe payments, create payment intent before saving order
    if (paymentMethod === 'stripe') {
      const paymentIntent = await createPaymentIntent(totalPrice);
      const order = new Order({
        orderItems,
        user: req.userId,
        shippingFields,
        paymentMethod,
        payment: true,
        totalPrice,
        email: shippingFields.email,
        paymentIntentId: paymentIntent.id,
        paymentStatus: 'pending',
        status: 'Processing',
        shippingFee,
        stripeFees: paymentIntent.calculatedFees,
      });

      const savedOrder = await order.save();

      return res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
        clientSecret: paymentIntent.client_secret,
        amount: paymentIntent.amount,
        commision: paymentIntent.calculatedFees,
      });
    }

    let paymentIntent = null;
    let paymentStatus = 'pending';
    let paymentIntentId = null;
    let stripeFees = null;

    if (paymentMethod === 'cash') {
      const order = new Order({
        orderItems,
        user: userId,
        shippingFields,
        paymentMethod,
        payment,
        totalPrice,
        email: shippingFields.email,
        paymentIntentId,
        paymentStatus: 'paid',
        status: 'Order Placed',
        shippingFee,
        stripeFees,
      });

      const savedOrder = await order.save();

      // Send email and clear cart
      await sendEmail({
        email: shippingFields.email,
        subject: 'Order Confirmation',
        html: createOrderMessage(savedOrder),
      });

      if (userId) {
        await User.findByIdAndUpdate(userId, { cartData: {} });
      }

      return res.status(201).json({
        message: 'Order Created',
        orderId: savedOrder._id,
      });
    }

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
      status: 'Processing',
      shippingFee,
      stripeFees,
    });

    const savedOrder = await order.save(); // Save the order first
    const orderId = savedOrder._id;
    // Use savedOrder._id

    if (paymentMethod === 'liqpay') {
      const currentDate = new Date();
      const expirationDate = new Date(currentDate.getTime() + 5 * 60000); // додаємо 5 хвилин
      const expired_date = expirationDate.toISOString().slice(0, 19).replace('T', ' ');

      const paymentData = {
        public_key: LIQPAY_PUBLIC_KEY,
        customer: userId || 'guest',
        version: '3',
        action: 'pay',
        amount: totalPrice,
        expired_date: expired_date, // формат: "2016-04-24 00:00:00"
        currency: 'UAH',
        description: 'Order payment: ' + orderId,
        order_id: orderId,
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
        ); // добавляем { new: true } для получения обновленного документа
      }

      order.paymentStatus = 'paid';
      order.status = 'Order Placed'; // Update status on successful payment
      order.paymentIntentId = paymentData.payment_id;

      await order.save();

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

    if (order.paymentStatus === 'paid') {
      if (userId) {
        await User.findByIdAndUpdate(userId, { cartData: {} });
      }
      return res.json({
        success: true,
        order,
        paymentStatus: order.paymentStatus,
        message: 'Payment was already confirmed',
      });
    }

    // Handle Stripe payment confirmation
    if (order.paymentMethod === 'stripe') {
      try {
        const paymentResult = await confirmPaymentIntent(order.paymentIntentId, paymentMethodId);

        if (paymentResult.status === 'succeeded') {
          order.paymentStatus = 'paid';
          order.status = 'Order Placed';

          // Clear cart after successful payment
          if (userId) {
            await User.findByIdAndUpdate(userId, { cartData: {} });
          }

          // Send confirmation email
          await sendEmail({
            email: order.shippingFields.email,
            subject: 'Successful Order Payment',
            html: createOrderMessage(order),
          });
        } else {
          order.paymentStatus = 'failed';
          order.status = 'Payment Failed';
        }

        await order.save();
      } catch (stripeError) {
        console.error('Stripe payment error:', stripeError);
        if (stripeError.message.includes('already succeeded')) {
          order.paymentStatus = 'paid';
          order.status = 'Order Placed';
          await order.save();
        } else {
          throw stripeError;
        }
      }
    }

    res.json({
      success: true,
      order,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    console.error('Payment update error:', error);
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
      status: { $ne: 'Processing' }, // Exclude Processing status
    }).sort({ createdAt: -1 });
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
