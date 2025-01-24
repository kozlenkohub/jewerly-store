import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';

const initialState = {
  filters: [],
};

export const fetchFilters = createAsyncThunk('filters/fetchFilters', async () => {
  const response = await axios.get('api/filter');
  return response.data;
});

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.filters = action.payload;
    });
  },
});

export default filterSlice.reducer;
