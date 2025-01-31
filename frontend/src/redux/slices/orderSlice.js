import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axios from '../../config/axiosInstance';
import { fetchCartItems } from './cartSlice';

const initialState = {
  orders: [],
  status: 'idle',
  error: null,
};

export const checkout = createAsyncThunk(
  'order/checkout',
  async (
    { shippingAddress, orderItems, paymentMethod, payment = true },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.post('/api/orders', {
        shippingAddress,
        orderItems,
        paymentMethod,
        payment,
      });
      dispatch(fetchCartItems());
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  },
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      state.orders.push(action.payload);
    },
    setOrderStatus: (state, action) => {
      state.status = action.payload;
    },
    setOrderError: (state, action) => {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
        toast.success('Order placed successfully!');
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;

        const errorMessages = Object.values(action.payload.errors).join(', ');
        toast.error(`Order failed: ${errorMessages}`);
      });
  },
});

export const { addOrder, setOrderStatus, setOrderError } = orderSlice.actions;

export default orderSlice.reducer;
