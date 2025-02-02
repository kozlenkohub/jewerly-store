import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../config/axiosInstance';
import ProductForm from '../components/ProductForm';

const Add = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/category/get');
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Error fetching categories');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== 'image') {
          if (values[key] !== '' && values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
      });

      if (values.image && values.image.length > 0) {
        values.image.forEach((file) => {
          formData.append('images', file);
        });
      }

      await axios.post('/api/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log('Upload progress:', percentCompleted + '%');
        },
      });

      toast.success('Product added successfully!');
      resetForm();
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        toast.info('Upload completed but took longer than expected. Please check products list.');
      } else {
        toast.error(error.response?.data?.message || 'Error adding product');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
      <ProductForm onSubmit={handleSubmit} categories={categories} />
    </div>
  );
};

export default Add;
