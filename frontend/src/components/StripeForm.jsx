import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useSelector, useDispatch } from 'react-redux';
import { setCartItems } from '../redux/slices/cartSlice';
import { useTranslation } from 'react-i18next';

const StripeForm = ({ orderId, amount, commision }) => {
  const { t } = useTranslation();
  const { currency } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (error) {
        toast.error(error.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      // Обновляем статус заказа
      const response = await axios.post(
        '/api/orders/payment',
        {
          orderId,
          paymentMethodId: paymentIntent.payment_method,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Добавляем токен
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Payment successful!');
        navigate('/orders');
        localStorage.removeItem('guestCart');
        dispatch(setCartItems([]));
      } else {
        toast.error(response.data.message || 'Payment failed');
      }
    } catch (error) {
      if (error.response?.data?.message?.includes('already succeeded')) {
        toast.success('Payment was already processed successfully');
        navigate('/orders');
      } else {
        toast.error(error.response?.data?.message || 'Payment failed');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mt-4">
      <PaymentElement
        options={{
          wallets: {
            applePay: 'auto',
            googlePay: 'auto',
          },
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#0A2540',
              borderRadius: '4px',
            },
          },
          payment_method_order: ['card', 'apple_pay', 'google_pay'],
          defaultValues: {
            billingDetails: {
              currency: 'uah',
            },
          },
          layout: {
            type: 'tabs',
            defaultCollapsed: false,
          },
        }}
      />
      <div className="text-lg font-semibold mt-4 mb-2 futura">
        {t('stripeForm.totalToPay')}: {currency}
        {(amount / 100).toFixed(2)}
      </div>
      <div className="text-sm text-gray-500 mb-4 futura">
        {t('stripeForm.stripeFees')} - {currency}
        {commision.toFixed(2)}
      </div>
      <button
        disabled={isProcessing || !stripe}
        className="bg-mainColor w-full text-white px-16 py-3 text-sm mt-4">
        {isProcessing ? t('stripeForm.buttons.processing') : t('stripeForm.buttons.payNow')}
      </button>
    </form>
  );
};

export default StripeForm;
