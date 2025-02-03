import React from 'react';
import { Link } from 'react-router-dom';

const AuthRecommendModal = ({ onClose, onContinue }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 ">
      <div className="bg-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-4">Create an Account?</h2>
        <p className="mb-4 futura">
          Creating an account lets you track orders and save your purchase history.
        </p>
        <div className="flex justify-end gap-4">
          <button onClick={onContinue} className="px-4 py-2 text-gray-600">
            Continue as Guest
          </button>
          <Link to="/login" className="px-4 py-2 bg-mainColor text-white rounded futura">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthRecommendModal;
