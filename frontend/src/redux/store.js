import { configureStore } from '@reduxjs/toolkit';
import categoryReducer from './slices/categorySlice';
import productReducer from './slices/productSlice';
import filterReducer from './slices/filterSlice';
import cartReducer from './slices/cartSlice';
import userSlice from './slices/userSlice';
import orderReducer from './slices/orderSlice';

const store = configureStore({
  reducer: {
    category: categoryReducer,
    product: productReducer,
    filter: filterReducer,
    cart: cartReducer,
    user: userSlice,
    order: orderReducer,
  },
});

export default store;
