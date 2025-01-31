import User from '../models/userModel.js';
import Product from '../models/productModel.js';

export const addToCart = async (req, res) => {
  try {
    const { userId, _id: itemId, size } = req.body;

    if (!itemId) {
      return res.status(400).json({ message: 'Item ID is required' });
    }
    if (!size) {
      return res.status(400).json({ message: 'Size is required to add item to cart' });
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
          _id: cartItem.itemId,
          size: cartItem.size,
          quantity: cartItem.quantity,
          image: product.image,
          name: product.name,
          price: product.price,
          discount: product.discount,
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

export const syncCart = async (req, res) => {
  try {
    const { userId, guestCart } = req.body;
    console.log(guestCart);

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Получение текущей корзины пользователя с сервера
    const userData = await User.findById(userId);
    if (!userData) {
      return res.status(400).json({ message: 'User not found' });
    }

    let cartData = userData.cartData || {};

    // Объединение корзин
    guestCart.forEach((guestItem) => {
      const itemKey = `${guestItem._id}-${guestItem.size}`;

      if (cartData[itemKey]) {
        // Если товар уже есть — обновляем количество
        cartData[itemKey].quantity += guestItem.quantity;
      } else {
        // Если товара нет — добавляем
        cartData[itemKey] = {
          itemId: guestItem._id,
          size: guestItem.size,
          quantity: guestItem.quantity,
        };
      }
    });

    // Сохранение обновленной корзины
    await User.findByIdAndUpdate(userId, { cartData });

    res.json({
      message: 'success',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
