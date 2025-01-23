import React, { createContext, useState } from 'react';
import { category, products } from '../assets/assets';

const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [state, setState] = useState({
    products: [],
    cart: [],
  });

  const currency = '$';
  const delivery_fee = 10;

  const addToCart = (product) => {
    setState((prevState) => ({
      ...prevState,
      cart: [...prevState.cart, product],
    }));
  };

  const removeFromCart = (productId) => {
    setState((prevState) => ({
      ...prevState,
      cart: prevState.cart.filter((product) => product.id !== productId),
    }));
  };

  return (
    <ShopContext.Provider
      value={{ state, addToCart, removeFromCart, category, products, currency, delivery_fee }}>
      {children}
    </ShopContext.Provider>
  );
};

export { ShopContext, ShopProvider };
