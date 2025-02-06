import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, register } from '../redux/slices/userSlice';
import { fetchCartItems } from '../redux/slices/cartSlice';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentState, setCurrentState] = useState('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const { token, isUserLoading } = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      navigate('/');
      dispatch(fetchCartItems());
    }
  }, [token, dispatch, navigate]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (currentState === 'Sign Up') {
      dispatch(register({ name, email, password }));
    } else {
      dispatch(login({ email, password }));
    }
  };

  return (
    <div className="min-h-[95.5vh] flex justify-center items-center transform translate-y-[-75px]">
      <form
        onSubmit={onSubmit}
        className="flex flex-col items-center w-[90%] sm:max-w-[500px] gap-4">
        <div className="inline-flex items-center gap-2 mb-2 text-3xl">
          <Title
            text1={t(`login.title.${currentState === 'Login' ? 'login' : 'signup'}.text1`)}
            text2={t(`login.title.${currentState === 'Login' ? 'login' : 'signup'}.text2`)}
          />
        </div>
        {currentState === 'Sign Up' && (
          <input
            type="text"
            placeholder={t('login.fields.name')}
            className="w-full p-2 border border-gray-800 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder={t('login.fields.email')}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder={t('login.fields.password')}
          className="w-full p-2 border border-gray-800 focus:outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p onClick={() => navigate('/forgot-password')} className="cursor-pointer futura">
            {t('login.links.forgotPassword')}
          </p>
          {currentState === 'Sign Up' ? (
            <p className="cursor-pointer futura" onClick={() => setCurrentState('Login')}>
              {t('login.links.loginHere')}
            </p>
          ) : (
            <p className="cursor-pointer futura" onClick={() => setCurrentState('Sign Up')}>
              {t('login.links.createAccount')}
            </p>
          )}
        </div>
        <button
          className="w-full p-2 bg-mainColor text-white futura font-medium text-xl"
          disabled={isUserLoading}>
          {isUserLoading
            ? t('login.buttons.loading')
            : t(`login.buttons.${currentState === 'Login' ? 'login' : 'signup'}`)}
        </button>
      </form>
    </div>
  );
};

export default Login;
