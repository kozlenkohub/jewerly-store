import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';

const initialState = {
  category: [],
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await axios.get(`api/category/get`, {
    headers: { 'X-Localize': true },
  });
  return response.data;
});

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.category = action.payload;
    });
  },
});

export default categorySlice.reducer;
