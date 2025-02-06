import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
  const [amount, setAmount] = useState(null);
  const [commision, setCommision] = useState(null);
  const [liqpayData, setLiqpayData] = useState(null);
  const [liqpaySignature, setLiqpaySignature] = useState(null);
  const [isLiqPayProcessing, setIsLiqPayProcessing] = useState(false);

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      toast.error(t('checkout.errors.emptyCart'));
      return;
    }

    const orderData = {
      shippingFields: formData,
      shippingFee,
      orderItems,
      paymentMethod,
      payment: true,
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
          setAmount(response.amount);
          setOrderId(response.orderId);
          setCommision(response.commision);
        } else if (orderData.paymentMethod === 'liqpay') {
          setLiqpayData(response.data);
          setLiqpaySignature(response.signature);
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

  const handleLiqPaySelection = async () => {
    setPaymentMethod('liqpay');
    setIsLiqPayProcessing(true);

    try {
      const orderData = {
        shippingFields: formData,
        shippingFee,
        orderItems,
        paymentMethod: 'liqpay',
      };

      const response = await dispatch(checkout(orderData)).unwrap();

      // Create temporary div to parse HTML string
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = response;

      // Get data and signature from the form
      const data = tempDiv.querySelector('input[name="data"]')?.value;
      const signature = tempDiv.querySelector('input[name="signature"]')?.value;

      if (data && signature) {
        setLiqpayData(data);
        setLiqpaySignature(signature);
      } else {
        throw new Error('Invalid LiqPay response format');
      }
    } catch (error) {
      console.error('Error processing LiqPay:', error);
      toast.error('Failed to initiate LiqPay payment');
      setPaymentMethod('cash'); // Reset payment method on error
    } finally {
      setIsLiqPayProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'cash',
      label: (
        <p className="text-gray-500 text-sm font-medium mx-2 futura">
          {t('checkout.payment.methods.cash')}
        </p>
      ),
    },
    {
      id: 'stripe',
      label: <FaStripe className="h-8 w-8 mx-2" />,
    },
    {
      id: 'liqpay',
      label: (
        <p className="text-gray-500 text-sm font-medium mx-2 futura">
          {t('checkout.payment.methods.liqpay')}
        </p>
      ),
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
      <div className="mt-2">
        <div className="mt-2 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-8">
          <Title
            text1={t('checkout.payment.title.text1')}
            text2={t('checkout.payment.title.text2')}
          />
          <div className="flex gap-3 justify-between flex-col">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="flex items-center gap-1 border min-h-[50px] p-2 px-3 cursor-pointer"
                onClick={() =>
                  method.id === 'liqpay' ? handleLiqPaySelection() : setPaymentMethod(method.id)
                }>
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    paymentMethod === method.id ? 'bg-mainColor' : ''
                  }`}></p>
                {method.label}
              </div>
            ))}
          </div>

          <div className="w-full text-center mt-8">
            {paymentMethod === 'stripe' && clientSecret ? (
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripeForm orderId={orderId} amount={amount} commision={commision} />
              </Elements>
            ) : paymentMethod === 'liqpay' && liqpayData && liqpaySignature ? (
              <form
                method="POST"
                action="https://www.liqpay.ua/api/3/checkout"
                acceptCharset="utf-8"
                className="w-full text-center">
                <input type="hidden" name="data" value={liqpayData} />
                <input type="hidden" name="signature" value={liqpaySignature} />
                <button
                  type="submit"
                  className="bg-mainColor md:min-w-[222px] text-white px-16 py-3 text-sm">
                  {t('checkout.payment.buttons.payNow')}
                </button>
              </form>
            ) : paymentMethod === 'liqpay' ? (
              <button
                disabled
                className="bg-mainColor md:min-w-[222px] text-white px-16 py-3 text-sm opacity-50">
                {t('checkout.payment.buttons.processing')}
              </button>
            ) : (
              <button
                onClick={handleCheckout}
                className={`bg-mainColor md:min-w-[222px] text-white px-16 py-3 text-sm ${
                  isLoadingOrder ? 'text-gray-500 bg-gray-800' : ''
                }`}
                disabled={isLoadingOrder}>
                {isLoadingOrder
                  ? t('checkout.payment.buttons.placing')
                  : t('checkout.payment.buttons.placeOrder')}
              </button>
            )}
          </div>
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
