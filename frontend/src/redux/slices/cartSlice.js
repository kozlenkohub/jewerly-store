import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
  cartItems: [],
  counter: 0,
};

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async () => {
  const response = await axios.get('api/cart/get');
  return response.data;
});

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const data = action.payload;

      if (!data.size) {
        toast.error('Please select a size');
        return;
      }

      const existItem = state.cartItems.find(
        (x) => x.product === data.product && x.size === data.size,
      );
      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product && x.size === existItem.size
            ? { ...x, quantity: x.quantity + 1 }
            : x,
        );
      } else {
        state.cartItems = [...state.cartItems, { ...data, quantity: 1 }];
      }
      state.counter += 1;
      toast.success('Product has been added to your cart');
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
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCartItems.fulfilled, (state, action) => {
      state.cartItems = action.payload;
      state.counter = action.payload.reduce((total, item) => total + item.quantity, 0);
    });
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
