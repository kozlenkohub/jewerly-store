import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axiosInstance';
import ProductForm from '../../components/ProductForm';
import BackButton from '../../components/BackButton';
import { Container, Typography, Button } from '@mui/material';

const AddNewProduct = () => {
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
        if (key === 'size' && values[key]) {
          let sizeArray = [];

          if (Array.isArray(values[key])) {
            sizeArray = values[key].map((size) => parseFloat(size)).filter((size) => !isNaN(size));
          } else if (typeof values[key] === 'string') {
            sizeArray = values[key]
              .split(',')
              .map((size) => parseFloat(size.trim()))
              .filter((size) => !isNaN(size));
          } else if (typeof values[key] === 'number') {
            sizeArray = [values[key]];
          }

          // Append each size as a separate value instead of JSON.stringify
          sizeArray.forEach((size) => {
            formData.append('size[]', size);
          });
        } else if (key !== 'image') {
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

      const response = await axios.post('/api/product/add', formData, {
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
      console.error('Detailed error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        stack: error.stack,
      });

      if (error.code === 'ECONNABORTED') {
        toast.info('Upload completed but took longer than expected. Please check products list.');
      } else {
        toast.error(
          error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            'Error adding product',
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md">
      <BackButton />
      <Typography variant="h4" gutterBottom>
        Add New Product
      </Typography>
      <ProductForm onSubmit={handleSubmit} categories={categories} />
    </Container>
  );
};

export default AddNewProduct;
