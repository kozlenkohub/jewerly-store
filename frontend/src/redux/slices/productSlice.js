import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';

export const fetchProducts = createAsyncThunk('product/fetchProductsStatus', async (query) => {
  const { data } = await axios.get(`/api/product?${query}`);
  return data;
});

const initialState = {
  products: [],
  currency: '$',
  isLoading: false,
  status: 'idle', // добавим статус по умолчанию
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = false;
        state.status = 'failed';
      });
  },
});

export const { setItems } = productSlice.actions;

export default productSlice.reducer;
