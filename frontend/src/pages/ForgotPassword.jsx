import React, { useState } from 'react';
import Title from '../components/Title';
import { toast } from 'react-hot-toast';
import axios from '../config/axiosInstance';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/user/forgot-password', { email })
      .then(() => {
        toast.success('Reset link sent to your email');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-[63.5vh] flex justify-center items-center">
      <form onSubmit={onSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 gap-4">
        <div className="inline-flex items-center gap-2 mb-2 mt-10 text-3xl">
          <Title text1="Reset" text2="Password" />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <button className="w-full p-2 bg-mainColor text-white futura font-medium text-xl">
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
