import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title';
import { toast } from 'react-hot-toast';
import axios from '../config/axiosInstance';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post('/api/user/forgot-password', { email })
      .then(() => {
        toast.success(t('forgotPassword.success'));
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <div className="min-h-[95.5vh] flex justify-center items-center transform translate-y-[-75px]">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-[500px] gap-4">
        <div className="inline-flex items-center gap-2 mb-2 mt-10 text-3xl">
          <Title text1={t('forgotPassword.title.text1')} text2={t('forgotPassword.title.text2')} />
        </div>
        <input
          type="email"
          placeholder={t('forgotPassword.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          required
        />
        <button className="w-full p-2 bg-mainColor text-white futura font-medium text-xl">
          {t('forgotPassword.sendResetLink')}
        </button>
      </form>
    </div>
  );
};

export default ForgotPassword;
