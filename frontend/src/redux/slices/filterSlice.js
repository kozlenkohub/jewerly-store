import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../config/axiosInstance';
import { localizeField } from '../../utils/localizeField';

const initialState = {
  filters: [],
  selectedFilters: {},
  isLoading: false,
};

export const fetchFilters = createAsyncThunk('filters/fetchFilters', async (categorySlug) => {
  const slug = categorySlug ? `categorySlug=${categorySlug}` : '';
  const response = await axios.get(`api/filter?${slug}`);

  return response.data.map((filter) => ({
    ...filter,
    name: localizeField(filter.name),
    label: localizeField(filter.label),
    options: filter.options.map((option) => ({
      ...option,
      name: localizeField(option.name),
      type: option.type,
      img: option.img,
    })),
  }));
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
    },
    setSelectedFilters: (state, action) => {
      state.selectedFilters = { ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFilters.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      state.filters = action.payload;
      state.isLoading = false;
    });
    builder.addCase(fetchFilters.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { toggleFilterOption, setSelectedFilters } = filterSlice.actions;

export default filterSlice.reducer;
