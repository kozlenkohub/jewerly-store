import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';

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
  }
  if (!data.paymentMethod) errors.paymentMethod = 'Payment method is required';
  if (!data.payment) errors.payment = 'Payment is required';
  if (!data.userId) errors.userId = 'User ID is required';
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
    const { orderItems, shippingFields, shippingFee, paymentMethod, payment, status, userId } =
      req.body;

    const errors = validateOrderData(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Please enter all fields', errors });
    }

    const totalPrice = await calculateTotalPrice(orderItems, shippingFee);

    const order = new Order({
      orderItems,
      user: userId,
      shippingFields,
      paymentMethod,
      payment,
      totalPrice,
      status,
    });

    await order.save();
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
    }

    await User.findByIdAndUpdate(userId, { cartData: {} });

    await res.status(201).json({ message: 'Order Created' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    const { orderItems, shippingFields, paymentMethod, payment, status, userId } = req.body;

    const errors = validateOrderData(req.body);
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const totalPrice = await calculateTotalPrice(orderItems);

    const order = new Order({
      orderItems,
      user: userId,
      shippingFields,
      paymentMethod,
      payment,
      totalPrice,
      status,
    });

    const createdOrder = await order.save();
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item._id, { $inc: { sales: item.quantity } });
    }

    res.status(201).json(createdOrder);
  } catch (error) {
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
