import { createSlice } from '@reduxjs/toolkit';
import { products } from '../../assets/assets';

const initialState = {
  products: products,
  currency: '$',
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
});

export default productSlice.reducer;
