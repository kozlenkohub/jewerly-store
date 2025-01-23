import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';

import Navbar from './components/NavBar';

const App = () => {
  return (
    <div className="max-w-[1920px]mx-auto">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:productId" element={<Product />} />
      </Routes>
    </div>
  );
};

export default App;
