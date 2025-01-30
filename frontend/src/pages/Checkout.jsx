import React, { useState } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { FaStripe } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('stripe');

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

  return (
    <div className="max-w-[1280px] mx-auto px-4 flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh]">
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
        <div className="text-xl sm:text-2xl my-2">
          <Title text1={'Delivery'} text2={'Information'} />
        </div>
        <div className="flex gap-3 ">
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="First name"
          />
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Last name"
          />
        </div>
        <input
          type="email"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Email"
        />
        <input
          type="text"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Street"
        />

        <input
          type="text"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Country"
        />

        <div className="flex gap-3 ">
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="City"
          />
          <input
            type="text"
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            placeholder="Zip code"
          />
        </div>
        <input
          type="tel"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
          className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
          placeholder="Phone"
        />
      </div>
      {/* right */}

      <div className="mt-2">
        <div className="mt-2 min-w-80">
          <CartTotal />
        </div>
        <div className="mt-12">
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
              onClick={() => navigate('/orders')}
              className="bg-mainColor text-white px-16 py-3 text-sm">
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
