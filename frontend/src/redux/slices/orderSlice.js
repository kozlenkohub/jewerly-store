import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axios from '../../config/axiosInstance';
import { fetchCartItems } from './cartSlice';
import { localizeField } from '../../utils/localizeField';
import i18n from '../../i18n';

const initialState = {
  orders: [], // Ensure orders is always initialized as an array
  isLoadingOrder: false,
  status: 'idle',
  error: null,
};

export const fetchOrders = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('/api/orders/myorders', {
        headers: { 'X-Localize': true },
      });

      // Локализуем названия продуктов в заказах
      const localizedOrders = (
        Array.isArray(response.data) ? response.data : Object.values(response.data || {})
      ).map((order) => ({
        ...order,
        orderItems: order.orderItems.map((item) => ({
          ...item,
          name: localizeField(item.name),
        })),
      }));

      return localizedOrders;
    }
    return []; // Return empty array if no token
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const checkout = createAsyncThunk(
  'order/checkout',
  async (
    { shippingFields, shippingFee, orderItems, paymentMethod },
    { rejectWithValue, dispatch },
  ) => {
    try {
      const response = await axios.post(
        '/api/orders',
        {
          shippingFields,
          orderItems,
          paymentMethod,
          shippingFee,
        },
        {
          headers: { 'X-Localize': true },
        },
      );

      if (paymentMethod === 'cash') {
        localStorage.removeItem('guestCart');
      }
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
      if (!Array.isArray(state.orders)) {
        state.orders = [];
      }
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
        if (!Array.isArray(state.orders)) {
          state.orders = [];
        }
        state.orders.push(action.payload);
        state.isLoadingOrder = false;
        if (action.payload.paymentMethod === 'cash') {
          toast.success(i18n.t('toasts.orders.placedSuccess'));
        }
      })
      .addCase(checkout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.isLoadingOrder = false;

        if (action.payload.errors) {
          const errorMessages = Object.values(action.payload.errors).join(', ');
          toast.error(`${i18n.t('toasts.orders.placedFailed')} ${errorMessages}`);
        }

        if (action.payload.msg === 'You must be authenticated') {
          toast.error(i18n.t('toasts.orders.authError'));
        }
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload || [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        toast.error(i18n.t('toasts.orders.fetchFailed'));
      });
  },
});

export const { addOrder, setOrderStatus, setOrderError } = orderSlice.actions;

export default orderSlice.reducer;
