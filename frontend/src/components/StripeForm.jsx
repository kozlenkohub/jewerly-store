import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useState } from 'react';
import axios from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const StripeForm = ({ orderId }) => {
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
      const response = await axios.post('/api/orders/payment', {
        orderId,
        paymentMethodId: paymentIntent.payment_method,
      });

      if (response.data.success) {
        toast.success(response.data.message || 'Payment successful!');
        navigate('/orders');
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
        }}
      />
      <button
        disabled={isProcessing || !stripe}
        className="bg-mainColor w-full text-white px-16 py-3 text-sm mt-4">
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default StripeForm;
