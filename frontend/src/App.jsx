import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Catalog from './pages/Catalog';
import SearchBar from './components/SearchBar';
import ScrollToTop from './components/ScrollToTop.jsx';
import { Toaster } from 'react-hot-toast';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Login from './pages/Login';
import About from './pages/About';

const App = () => {
  return (
    <div className="max-w-[1920px] mx-auto">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            fontFamily: 'Futura Light, sans-serif',
          },
        }}
      />
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog/*" element={<Catalog />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/about" element={<About />} />
        <Route path="/orders" element={<Orders />} />
        {/* login */}
        <Route path="/login" element={<Login />} />
        {/* register */}
        {/* forgot-password */}
        {/* reset-password */}
        {/* profile */}
        {/* contact */}
        {/* about */}
        {/* terms */}
        {/* privacy */}
        {/* 404 */}
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
