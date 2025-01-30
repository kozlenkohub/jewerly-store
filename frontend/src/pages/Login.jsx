import React, { useState } from 'react';
import Title from '../components/Title';

const Login = () => {
  const [currentState, setCurrentState] = useState('Sign Up');

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('submitted');
  };

  return (
    <div className="min-h-[63.5vh] flex justify-center items-center">
      <form onSubmit={onSubmit} className="flex flex-col items-center w-[90%] sm:max-w-96 gap-4">
        <div className="inline-flex items-center gap-2 mb-2 mt-10 text-3xl">
          <Title text1={currentState} text2={'Page'} />
        </div>
        {currentState === 'Sign Up' && (
          <input
            type="text"
            placeholder="Name"
            className="w-full p-2 border border-gray-800  focus:outline-none  "
            required
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-800  focus:outline-none "
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-800  focus:outline-none "
          required
        />
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer futura">Forgot your password?</p>
          {currentState === 'Sign Up' ? (
            <p className="cursor-pointer futura" onClick={() => setCurrentState('Login')}>
              Login here
            </p>
          ) : (
            <p className="cursor-pointer futura" onClick={() => setCurrentState('Sign Up')}>
              Create an account
            </p>
          )}
        </div>
        <button className="w-full p-2 bg-mainColor text-white futura font-medium text-xl">
          {currentState}
        </button>
      </form>
    </div>
  );
};

export default Login;
