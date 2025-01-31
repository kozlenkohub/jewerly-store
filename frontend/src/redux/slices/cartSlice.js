import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  cartItems: [],
  counter: 0,
  totalPrice: 0,
  delivery_fee: 50,
};

const calculateTotalPrice = (cartItems) => {
  return cartItems.reduce((total, item) => {
    const discountPrice = item.price * (1 - (item.discount || 0) / 100);
    return total + discountPrice * item.quantity;
  }, 0);
};

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
  const response = await axios.get('api/cart/get', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  return response.data.map((item) => ({
    ...item.product,
    size: item.size,
    quantity: item.quantity,
  }));
});

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async (data, { rejectWithValue, dispatch }) => {
    try {
      const response = await axios.post('api/cart/add', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post('api/cart/updateQuantity', data, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`api/cart/remove/${data.itemId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      return response.data;
    } catch (error) {
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
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.cartItems = action.payload;
      state.counter = action.payload.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.cartItems);
    });
    builder.addCase(addToCart.fulfilled, (state, action) => {
      toast.success('Product has been added to your cart');
    });
    builder.addCase(addToCart.rejected, (state, action) => {
      toast.error(action.payload.message || 'Failed to add product to cart');
    });
    builder.addCase(updateQuantity.fulfilled, (state, action) => {
      const { item } = action.payload;
      state.cartItems = state.cartItems.map((x) =>
        x._id === item.itemId && x.size === item.size ? { ...x, quantity: item.quantity } : x,
      );
      state.counter = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.cartItems);
    });
    builder.addCase(updateQuantity.rejected, (state, action) => {
      toast.error(action.payload.message || 'Failed to update item quantity');
    });
    builder.addCase(removeFromCart.fulfilled, (state, action) => {
      const { itemId } = action.payload;
      state.cartItems = state.cartItems.filter((x) => x._id !== itemId);
      state.counter = state.cartItems.reduce((total, item) => total + item.quantity, 0);
      state.totalPrice = calculateTotalPrice(state.cartItems);
      toast.success('Product has been removed from your cart');
    });
    builder.addCase(removeFromCart.rejected, (state, action) => {
      toast.error(action.payload.message || 'Failed to remove product from cart');
    });
  },
});

export const { setCartItems } = cartSlice.actions;

export default cartSlice.reducer;
