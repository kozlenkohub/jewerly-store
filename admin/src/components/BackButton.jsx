import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 mb-4 px-4 py-2 text-gray-600 hover:text-gray-800">
      <FaArrowLeft />
      <span>Back</span>
    </button>
  );
};

export default BackButton;
