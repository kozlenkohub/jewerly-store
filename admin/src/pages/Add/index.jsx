import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';

const Add = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer flex items-center"
        onClick={() => navigate('/add-new-product')}>
        <FaPlus className="mr-2" />
        <span>Add New Product</span>
      </div>

      <div
        className="p-4 border rounded-lg shadow hover:shadow-md cursor-pointer flex items-center"
        onClick={() => navigate('/add-new-category')}>
        <FaPlus className="mr-2" />
        <span>Add New Category</span>
      </div>
    </div>
  );
};

export default Add;
