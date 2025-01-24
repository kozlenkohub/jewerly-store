import { createSlice } from '@reduxjs/toolkit';
import { filters } from '../../assets/assets';

const initialState = {
  filters: filters,
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {},
});

export default filterSlice.reducer;
