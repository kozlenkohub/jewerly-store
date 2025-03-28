import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import toast from 'react-hot-toast';
import { debounce } from 'lodash';
import { localizeField } from '../../utils/localizeField';
import i18n from '../../i18n';

const initialState = {
  isLoadingCart: true,
  cartItems: [],
  counter: 0,
  totalPrice: 0,
  shippingFee: 50,
};

const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const discountPrice = item.price * (1 - (item.discount || 0) / 100);
    return total + discountPrice * item.quantity;
  }, 0);
};
export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, { rejectWithValue, dispatch }) => {
    // Add size validation with early return
    if (!data.size) {
      return rejectWithValue({ message: i18n.t('toasts.cart.sizeRequired') });
    }

    const token = localStorage.getItem('token');

    // Если пользователь не залогинен, сохраняем в localStorage
    if (!token) {
      let cart = JSON.parse(localStorage.getItem('guestCart')) || [];

      const existingItemIndex = cart.findIndex(
        (item) => item._id === data._id && item.size === data.size,
      );

      if (existingItemIndex !== -1) {
        // Увеличиваем существующее количество
        cart[existingItemIndex].quantity += data.quantity || 1;
      } else {
        // Добавляем новый товар с указанным количеством
        cart.push({ ...data, quantity: data.quantity || 1 });
      }

      localStorage.setItem('guestCart', JSON.stringify(cart));

      // Обновляем состояние корзины
      dispatch(fetchCartItems());
      return cart;
    }

    // Логика для залогированных пользователей
    try {
      await axios.post('api/cart/add', data);
      dispatch(fetchCartItems());
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
  const token = localStorage.getItem('token');

  if (!token) {
    const guestCart = JSON.parse(localStorage.getItem('guestCart')) || [];
    return guestCart.map((item) => ({
      ...item,
      name: localizeField(item.name),
    }));
  }

  const response = await axios.get('api/cart/get');

  return response.data.map((item) => ({
    ...item,
    name: localizeField(item.name),
  }));
});

const debouncedUpdate = debounce(async (data, token, dispatch, rejectWithValue) => {
  try {
    const response = await axios.post('api/cart/updateQuantity', data);
    return response.data;
  } catch (error) {
    dispatch(fetchCartItems());
    return rejectWithValue(error.response?.data || { message: 'Failed to update quantity' });
  }
}, 300);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (data, { rejectWithValue, dispatch, getState }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      const cart = JSON.parse(localStorage.getItem('guestCart')) || [];
      const itemIndex = cart.findIndex(
        (item) => item._id === data.itemId && item.size === data.size,
      );

      if (itemIndex === -1) {
        return rejectWithValue({ message: 'Item not found in cart' });
      }

      cart[itemIndex].quantity = data.quantity;
      localStorage.setItem('guestCart', JSON.stringify(cart));
      dispatch(fetchCartItems());
      return { cartItems: cart };
    }

    try {
      // Optimistically update the UI before the request
      const state = getState();
      const itemIndex = state.cart.cartItems.findIndex(
        (item) => item._id === data.itemId && item.size === data.size,
      );

      if (itemIndex === -1) {
        return rejectWithValue({ message: 'Item not found in cart' });
      }

      // Save the current cart state to revert if needed
      const previousCartItems = [...state.cart.cartItems];
      const updatedCartItems = previousCartItems.map((item) =>
        item._id === data.itemId && item.size === data.size
          ? { ...item, quantity: data.quantity }
          : item,
      );
      dispatch(setCartItems(updatedCartItems));

      // Debounced server request
      debouncedUpdate(data, token, dispatch, rejectWithValue);
    } catch (error) {
      dispatch(fetchCartItems());
      return rejectWithValue(error.response?.data || { message: 'Failed to update quantity' });
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (data, { rejectWithValue, dispatch, getState }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      let cart = JSON.parse(localStorage.getItem('guestCart')) || [];

      cart = cart.filter((item) => !(item._id === data.itemId && item.size === data.size));
      localStorage.setItem('guestCart', JSON.stringify(cart));

      dispatch(fetchCartItems());
      return { cartItems: cart };
    }

    try {
      // Optimistically update the UI before the request
      const state = getState();
      const previousCartItems = [...state.cart.cartItems];
      const updatedCartItems = previousCartItems.filter(
        (item) => !(item._id === data.itemId && item.size === data.size),
      );
      dispatch(setCartItems(updatedCartItems));

      const response = await axios.delete(`api/cart/remove/${data.itemId}-${data.size}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      dispatch(fetchCartItems());
      return rejectWithValue(error.response.data);
    }
  },
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartItems = action.payload;
      state.counter = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },
    removeFromCart: (state, action) => {
      const itemToRemove = state.cartItems.find(
        (x) => x.product === action.payload.product && x.size === action.payload.size,
      );
      if (itemToRemove) {
        state.counter -= itemToRemove.quantity;
      }
      state.cartItems = state.cartItems.filter(
        (x) => x.product !== action.payload.product || x.size !== action.payload.size,
      );
      state.totalPrice = calculateTotalPrice(state.cartItems);
    },
    clearCart: (state) => {
      state.cartItems = [];
      state.shippingFee = 0;
      state.itemsPrice = 0;
      state.totalPrice = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.cartItems = action.payload;
        state.counter = action.payload.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = calculateTotalPrice(state.cartItems);
        state.isLoadingCart = false;
      })
      .addCase(fetchCartItems.rejected, (state) => {
        state.isLoadingCart = false;
      });

    builder.addCase(addToCart.fulfilled, (state, action) => {
      toast.success(i18n.t('toasts.cart.addSuccess'));
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      toast.error(action.payload.message || i18n.t('toasts.cart.addFailed'));
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      if (!action.payload) {
        return;
      }
      const { item } = action.payload;
      if (item) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === item.itemId && x.size === item.size ? { ...x, quantity: item.quantity } : x,
        );
        state.counter = state.cartItems.reduce((total, item) => total + item.quantity, 0);
        state.totalPrice = calculateTotalPrice(state.cartItems);
      }
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      toast.error(action.payload.message || i18n.t('toasts.cart.updateFailed'));
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      const { itemId } = action.payload;
      if (itemId) {
        const itemToRemove = state.cartItems.find((x) => x._id === itemId);
        if (itemToRemove) {
          state.counter -= itemToRemove.quantity;
        }
        state.cartItems = state.cartItems.filter((x) => x._id !== itemId);
        state.totalPrice = calculateTotalPrice(state.cartItems);
        toast.success(i18n.t('toasts.cart.removeSuccess'));
      }
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      toast.error(action.payload.message || i18n.t('toasts.cart.removeFailed'));
    });
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
