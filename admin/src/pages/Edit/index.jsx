import React from 'react';
import { Link } from 'react-router-dom';

const index = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Edit Page</h1>
        <div className="space-y-4">
          <Link to="/edit/filters" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Edit Filters
            </button>
          </Link>
          <Link to="/edit/products" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Edit Products
            </button>
          </Link>
          <Link to="/edit/categories" className="block">
            <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
              Edit Categories
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default index;
