import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Catalog from './pages/Catalog';
import SearchBar from './components/SearchBar';
import ScrollToTop from './components/ScrollToTop.jsx';

const App = () => {
  return (
    <div className="max-w-[1920px] mx-auto">
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog/*" element={<Catalog />} />
        <Route path="/product/:productId" element={<Product />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
