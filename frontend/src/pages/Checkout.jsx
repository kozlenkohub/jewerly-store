import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { FaStripe } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { checkout } from '../redux/slices/orderSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from '../config/axiosInstance';
import CheckoutForm from '../components/CheckoutForm';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orderItems = useSelector((state) => state.cart.cartItems);
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

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    if (!paymentMethod) {
      toast.error('Payment method is required');
      return;
    }
    dispatch(checkout({ shippingFields: formData, orderItems, paymentMethod }))
      .unwrap()
      .then(() => {
        navigate('/orders');
      });
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
