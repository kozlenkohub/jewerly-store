import React from 'react';
import { category, products } from '../assets/assets';

export const ShopContext = React.createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const value = {
    products,
    category,
    currency,
    delivery_fee,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
