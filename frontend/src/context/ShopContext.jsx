import React from 'react';
import { products } from '../assets/assets';

export const ShopContext = React.createContext();

const ShopContextProvider = ({ children }) => {
  const currency = '$';
  const delivery_fee = 10;
  const value = {
    products,
    currency,
    delivery_fee,
  };
  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
};

export default ShopContextProvider;
