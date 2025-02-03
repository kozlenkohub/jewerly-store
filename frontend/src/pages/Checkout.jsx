import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { FaStripe } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { checkout, fetchOrders } from '../redux/slices/orderSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../config/axiosInstance';
import CheckoutForm from '../components/CheckoutForm';
import AuthRecommendModal from '../components/AuthRecommendModal';
import StripeForm from '../components/StripeForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector((state) => state.cart.cartItems);
  const { shippingFee } = useSelector((state) => state.cart);
  const { isLoadingOrder } = useSelector((state) => state.order);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    street: '',
    country: '',
    apartament: '',
    city: '',
    zipCode: '',
    phone: '',
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingOrderData, setPendingOrderData] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }

    const orderData = {
      shippingFields: formData,
      shippingFee,
      orderItems,
      paymentMethod,
    };

    const token = localStorage.getItem('token');
    if (!token) {
      setPendingOrderData(orderData);
      setShowAuthModal(true);
      return;
    }

    processOrder(orderData);
  };

  const processOrder = (orderData) => {
    dispatch(checkout(orderData))
      .unwrap()
      .then((response) => {
        if (orderData.paymentMethod === 'stripe') {
          setClientSecret(response.clientSecret);
          setOrderId(response.orderId);
        } else {
          navigate('/orders');
        }
      });
  };

  const handleGuestCheckout = () => {
    setShowAuthModal(false);
    if (pendingOrderData) {
      processOrder(pendingOrderData);
    }
  };

  const paymentMethods = [
    {
      id: 'cash',
      label: <p className="text-gray-500 text-sm font-medium mx-2 futura">Cash on Delivery</p>,
    },
    {
      id: 'stripe',
      label: <FaStripe className="h-8 w-8 mx-2" />,
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get('/api/orders/lastorder');
        setFormData({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          street: data.street,
          country: data.country,
          apartament: data.apartament,
          city: data.city,
          zipCode: data.zipCode,
          phone: data.phone,
        });
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[95.5vh] pb-10">
      <CheckoutForm formData={formData} setFormData={setFormData} />
      {/* right */}
      <div className="mt-2">
        <div className="mt-2 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-8">
          <Title text1={'Payment'} text2={'Method'} />
          <div className="flex gap-3 justify-between flex-col ">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-1 border  min-h-[50px] p-2 px-3 cursor-pointer"
                onClick={() => setPaymentMethod(method.id)}>
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    paymentMethod === method.id ? 'bg-mainColor' : ''
                  }`}></p>
                {method.label}
              </div>
            ))}
          </div>

          {paymentMethod === 'stripe' && clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <StripeForm orderId={orderId} />
            </Elements>
          ) : (
            <div className="w-full text-center mt-8">
              <button
                onClick={handleCheckout}
                className={`bg-mainColor md:min-w-[222px] text-white px-16 py-3 text-sm ${
                  isLoadingOrder ? 'text-gray-500 bg-gray-800' : ''
                }`}
                disabled={isLoadingOrder}>
                {isLoadingOrder ? 'PLACING...' : 'PLACE ORDER'}
              </button>
            </div>
          )}
        </div>
      </div>
      {showAuthModal && (
        <AuthRecommendModal
          onClose={() => setShowAuthModal(false)}
          onContinue={handleGuestCheckout}
        />
      )}
    </div>
  );
};

export default Checkout;
