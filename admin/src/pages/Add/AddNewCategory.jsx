import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from '../../config/axiosInstance';
import BackButton from '../../components/BackButton';
import CategoryForm from '../../components/CategoryForm/CategoryForm';

const AddNewCategory = () => {
  const [parentCategories, setParentCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesRes = await axios.get('/api/category/get');
        console.log('Fetched categories:', categoriesRes.data);
        setParentCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Error fetching data');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Append text fields
      formData.append('name', String(values.name || ''));
      formData.append('label', String(values.label || ''));
      formData.append('parent', String(values.parent || ''));
      formData.append('slug', String(values.slug || ''));

      // Append files with correct field names
      if (values.image) {
        formData.append('image', values.image);
      }
      if (values.icon) {
        formData.append('icon', values.icon);
      }

      const response = await axios.post('/api/category/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', response.data);
      toast.success('Category added successfully!');
      resetForm();
    } catch (error) {
      console.error('Category creation error:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.message || 'Error adding category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <BackButton />
      <h1 className="text-2xl font-bold mb-4">Add New Category</h1>
      <CategoryForm onSubmit={handleSubmit} parentCategories={parentCategories} />
    </div>
  );
};

export default AddNewCategory;
