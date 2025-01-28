import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';

export const fetchProducts = createAsyncThunk(
  'product/fetchProductsStatus',
  async ({ slug, query, sort, search }) => {
    const { data } = await axios.get(
      `/api/product/${slug}?${query}&sort=${sort || ''}&search=${search || ''}`,
    );
    return data;
  },
);

const initialState = {
  products: [],
  currency: '₴',
  search: '',
  isOpenSearch: false,
  isLoading: true,
  status: 'idle', // добавим статус по умолчанию
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setItems: (state, action) => {
      state.products = action.payload;
    },
    toggleSearch: (state) => {
      state.isOpenSearch = !state.isOpenSearch;
    },
    setSearch: (state, action) => {
      state.search = action.payload;
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
        state.isLoading = true;
        state.status = 'failed';
      });
  },
});

export const { setItems, toggleSearch, setSearch } = productSlice.actions;

export default productSlice.reducer;
