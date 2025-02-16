import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import { localizeField } from '../../utils/localizeField';

export const fetchProducts = createAsyncThunk(
  'product/fetchProductsStatus',
  async ({ slug, query, sort, search }) => {
    const searchParam = search ? `&search=${search}` : '';
    const { data } = await axios.get(
      `/api/product/${slug}?${query}&sort=${sort || ''}${searchParam}`,
      {
        headers: { 'X-Localize': true },
      },
    );

    // Локализуем данные продуктов
    return {
      ...data,
      categoryName: localizeField(data.categoryName),
      products: data.products.map((product) => ({
        ...product,
        name: localizeField(product.name),
        description: localizeField(product.description),
        characteristics: product.characteristics?.map((char) => ({
          ...char,
          name: localizeField(char.name),
          value: localizeField(char.value),
        })),
      })),
    };
  },
);

const initialState = {
  products: [],
  currency: '₴',
  search: '',
  isOpenSearch: false, // Ensure the search bar is initially closed
  isLoading: true,
  status: 'idle', // добавим статус по умолчанию
  activeCategory: '',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
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
        state.products = action.payload.products;
        state.activeCategory = action.payload.categoryName; // Set the active category name
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.isLoading = true;
        state.status = 'failed';
      });
  },
});

export const { setItems, toggleSearch, setSearch, setIsLoading } = productSlice.actions;

export default productSlice.reducer;
