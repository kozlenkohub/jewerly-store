import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import filterReducer from './slices/filterSlice';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    filter: filterReducer,
  },
});

export default store;
