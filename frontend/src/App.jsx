import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
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
import Contact from './pages/Contact';
import { fetchCartItems } from './redux/slices/cartSlice';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import Profile from './pages/Profile.jsx';
import './i18n';
import Delivery from './pages/Delivery.jsx';
import Privacy from './pages/Privacy.jsx';
import Repair from './pages/Repair.jsx';
import Create from './pages/Create.jsx';
import Guarantee from './pages/Guarantee.jsx';
import GIA from './pages/GIA.jsx';
import PublicOffer from './pages/PublicOffer.jsx';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  return (
    <div className="max-w-[1920px] mx-auto">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            fontFamily: 'Futura Light, sans-serif',
            padding: '16px',
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
        <Route path="/orders" element={<Orders />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create" element={<Create />} />
        <Route path="/delivery" element={<Delivery />} />
        <Route path="/repair" element={<Repair />} />

        <Route path="/privacy" element={<Privacy />} />
        <Route path="/guarantee" element={<Guarantee />} />
        <Route path="/gia" element={<GIA />} />
        <Route path="/about" element={<About />} />

        <Route path="/public-offer" element={<PublicOffer />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
