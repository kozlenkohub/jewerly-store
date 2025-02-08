import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import { localizeField } from '../../utils/localizeField';

const initialState = {
  category: [],
};

export const fetchCategories = createAsyncThunk('category/fetchCategories', async () => {
  const response = await axios.get(`api/category/get`);
  // Локализуем названия категорий
  return response.data.map((category) => ({
    ...category,
    name: localizeField(category.name),
  }));
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
