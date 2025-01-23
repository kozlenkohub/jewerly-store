import React, { createContext, useState } from 'react';

const ShopContext = createContext();

const ShopProvider = ({ children }) => {
  const [state, setState] = useState({});

  return <ShopContext.Provider value={[state, setState]}>{children}</ShopContext.Provider>;
};

export { ShopContext, ShopProvider };
