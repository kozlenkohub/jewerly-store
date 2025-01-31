import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import { toast } from 'react-hot-toast';
import axios from '../config/axiosInstance';

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    axios
      .post(`/api/user/reset-password/${token}`, { password })
      .then(() => {
        toast.success('Password reset successfully');
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
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <button className="w-full p-2 bg-mainColor text-white futura font-medium text-xl">
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
