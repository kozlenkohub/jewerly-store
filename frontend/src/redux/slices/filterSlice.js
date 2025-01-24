import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';

const initialState = {
  filters: [],
  selectedFilters: {},
};

export const fetchFilters = createAsyncThunk('filters/fetchFilters', async () => {
  const response = await axios.get('api/filter');
  return response.data;
});

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    toggleFilterOption: (state, action) => {
      const { key, option } = action.payload;

      if (!Array.isArray(state.selectedFilters[key])) {
        state.selectedFilters[key] = [];
      }

      const index = state.selectedFilters[key].indexOf(option);
      if (index >= 0) {
        state.selectedFilters[key].splice(index, 1);
      } else {
        state.selectedFilters[key].push(option);
      }

      state.selectedFilters[key] = state.selectedFilters[key].map((item) =>
        typeof item === 'string' ? item : String(item),
      );
    },
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.filters = action.payload;
    });
  },
});

export const { toggleFilterOption, setSelectedFilters } = filterSlice.actions;

export default filterSlice.reducer;
