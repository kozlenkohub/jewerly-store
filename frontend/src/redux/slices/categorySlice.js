import { createSlice } from '@reduxjs/toolkit';
import { category } from '../../assets/assets';

const initialState = {
  category: category,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
});

export default categorySlice.reducer;
