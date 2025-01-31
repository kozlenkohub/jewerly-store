import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axios from '../../config/axiosInstance';
import { fetchCartItems } from './cartSlice';

const initialState = {
  orders: [],
  isLoadingOrder: false,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('/api/orders/myorders');
      const orders = Object.values(response.data); // Convert object to array
      return orders;
    }
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const checkout = createAsyncThunk(
  'order/checkout',
  async (
    { shippingFields, shippingFee, orderItems, paymentMethod, payment = true },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.post('/api/orders', {
        shippingFields,
        orderItems,
        paymentMethod,
        payment,
        shippingFee,
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
        state.isLoadingOrder = true;
      })
      .addCase(checkout.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
        state.isLoadingOrder = false;
        toast.success('Order placed successfully!');
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoadingOrder = false;

        if (action.payload.errors) {
          const errorMessages = Object.values(action.payload.errors).join(', ');
          toast.error(`Order failed: ${errorMessages}`);
        }

        if (action.payload.msg === 'You must be authenticated') {
          toast.error('You must be authenticated');
        }
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { addOrder, setOrderStatus, setOrderError } = orderSlice.actions;

export default orderSlice.reducer;
