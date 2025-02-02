import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axiosInstance';
import BackButton from '../../components/BackButton';

const AddNewCategory = () => {
  const [name, setName] = useState('');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post('/api/category/add', { name });
      toast.success('Category added successfully!');
      setName('');
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Error adding category');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />

      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
          Category Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </div>
  );
};

export default AddNewCategory;
