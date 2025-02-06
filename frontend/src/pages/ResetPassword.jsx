import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Title from '../components/Title';
import { toast } from 'react-hot-toast';
import axios from '../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { t } = useTranslation();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  console.log(token);

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error(t('resetPassword.errors.mismatch'));
      return;
    }
    axios
      .post(`/api/user/reset-password/${token}`, { password })
      .then(() => {
        toast.success(t('resetPassword.success'));
        navigate('/login');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-[95.5vh] flex justify-center items-center transform translate-y-[-75px]">
      <form onSubmit={onSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 gap-4">
        <div className="inline-flex items-center gap-2 mb-2 mt-10 text-3xl">
          <Title text1={t('resetPassword.title.text1')} text2={t('resetPassword.title.text2')} />
        </div>
        <input
          type="password"
          placeholder={t('resetPassword.newPassword')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <input
          type="password"
          placeholder={t('resetPassword.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <button className="w-full p-2 bg-mainColor text-white futura font-medium text-xl">
          {t('resetPassword.resetButton')}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
