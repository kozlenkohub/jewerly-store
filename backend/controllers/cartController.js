import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, _id: itemId, size } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ message: 'User not found' });
    }
    const cartData = userData.cartData || {};
    const itemKey = `${itemId}-${size}`;
    if (cartData[itemKey]) {
      cartData[itemKey].quantity += 1;
    } else {
      cartData[itemKey] = { itemId, size, quantity: 1 };
    }
    await User.findByIdAndUpdate(userId, { cartData });
    res.json({ message: 'Item added to cart', item: cartData[itemKey] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCartItems = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ message: 'User not found' });
    }

    const cartItems = await Promise.all(
      Object.values(userData.cartData).map(async (cartItem) => {
        const product = await Product.findById(cartItem.itemId);
        return {
          ...cartItem,
          product,
        };
      }),
    );

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { userId } = req.body;
    const { id } = req.params;
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ message: 'User not found' });
    }

    const itemKey = Object.keys(userData.cartData).find((key) => key.startsWith(id));
    if (!itemKey) {
      return res.status(400).json({ message: 'Item not found in cart' });
    }

    delete userData.cartData[itemKey];
    await User.findByIdAndUpdate(userId, { cartData: userData.cartData });
    res.json({ message: 'Item removed from cart', itemId: id });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;

    if (!itemId || !size || quantity == null) {
      return res.status(400).json({ message: 'Item ID, size, and quantity are required' });
    }

    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ message: 'User not found' });
    }

    const itemKey = `${itemId}-${size}`;
    if (!userData.cartData[itemKey]) {
      return res.status(400).json({ message: 'Item not found in cart' });
    }

    userData.cartData[itemKey].quantity = quantity;
    await User.findByIdAndUpdate(userId, { cartData: userData.cartData });

    res.json({ message: 'Item quantity updated', item: userData.cartData[itemKey] });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
