import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import axios from '../config/axiosInstance';
import { METAL_TYPES, CUT_FORMS, STYLES, CLARITY_TYPES, PURITY_TYPES } from '../utils/modelEnums';
import MediaUpload from '../components/MediaUpload';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  price: Yup.number().required('Required').positive('Must be positive'),
  category: Yup.string().required('Required'),
  metal: Yup.string().required('Required'),
  cutForm: Yup.string().required('Required'),
  description: Yup.string().required('Required'),
  weight: Yup.number().required('Required').positive('Must be positive'),
  collection: Yup.string().required('Required'),
  purity: Yup.number().transform((value) => (isNaN(value) ? undefined : value)),
  carats: Yup.number().transform((value) => (isNaN(value) ? undefined : value)),
});

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
      toast.error('Error fetching categories');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const formData = new FormData();

      // Filter out empty values and handle numeric fields
      Object.keys(values).forEach((key) => {
        if (key !== 'image') {
          if (values[key] !== '' && values[key] !== null && values[key] !== undefined) {
            formData.append(key, values[key]);
          }
        }
      });

      // Добавляем файлы
      if (values.image && values.image.length > 0) {
        values.image.forEach((file) => {
          formData.append('images', file);
        });
      }

      await axios.post('/api/product/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 60000, // Increase timeout to 60 seconds
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
      <Formik
        initialValues={{
          name: '',
          description: '',
          price: '',
          image: [],
          category: '',
          weight: '',
          collection: '',
          // ...other initial values
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Name</label>
                <Field type="text" name="name" className="w-full border p-2 rounded" />
                {errors.name && touched.name ? (
                  <div className="text-red-500 text-sm">{errors.name}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Price</label>
                <Field type="number" name="price" className="w-full border p-2 rounded" />
                {errors.price && touched.price ? (
                  <div className="text-red-500 text-sm">{errors.price}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Category</label>
                <Field as="select" name="category" className="w-full border p-2 rounded">
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                {errors.category && touched.category ? (
                  <div className="text-red-500 text-sm">{errors.category}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Metal</label>
                <Field as="select" name="metal" className="w-full border p-2 rounded">
                  <option value="">Select Metal</option>
                  {METAL_TYPES.map((metal) => (
                    <option key={metal} value={metal}>
                      {metal.charAt(0).toUpperCase() + metal.slice(1)}
                    </option>
                  ))}
                </Field>
                {errors.metal && touched.metal ? (
                  <div className="text-red-500 text-sm">{errors.metal}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Cut Form</label>
                <Field as="select" name="cutForm" className="w-full border p-2 rounded">
                  <option value="">Select Cut Form</option>
                  {CUT_FORMS.map((cut) => (
                    <option key={cut} value={cut}>
                      {cut.charAt(0).toUpperCase() + cut.slice(1)}
                    </option>
                  ))}
                </Field>
                {errors.cutForm && touched.cutForm ? (
                  <div className="text-red-500 text-sm">{errors.cutForm}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Style</label>
                <Field as="select" name="style" className="w-full border p-2 rounded">
                  <option value="">Select Style</option>
                  {STYLES.map((style) => (
                    <option key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="block mb-2">Clarity</label>
                <Field as="select" name="clarity" className="w-full border p-2 rounded">
                  <option value="">Select Clarity</option>
                  {CLARITY_TYPES.map((clarity) => (
                    <option key={clarity} value={clarity}>
                      {clarity}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="block mb-2">Purity</label>
                <Field as="select" name="purity" className="w-full border p-2 rounded">
                  <option value="">Select Purity</option>
                  {PURITY_TYPES.map((purity) => (
                    <option key={purity} value={purity}>
                      {purity}
                    </option>
                  ))}
                </Field>
              </div>

              <div>
                <label className="block mb-2">Carats</label>
                <Field
                  type="number"
                  step="0.01"
                  name="carats"
                  className="w-full border p-2 rounded"
                />
              </div>

              <div>
                <label className="block mb-2">Weight (g)</label>
                <Field
                  type="number"
                  step="0.01"
                  name="weight"
                  className="w-full border p-2 rounded"
                />
                {errors.weight && touched.weight ? (
                  <div className="text-red-500 text-sm">{errors.weight}</div>
                ) : null}
              </div>

              <div>
                <label className="block mb-2">Collection</label>
                <Field type="text" name="collection" className="w-full border p-2 rounded" />
                {errors.collection && touched.collection ? (
                  <div className="text-red-500 text-sm">{errors.collection}</div>
                ) : null}
              </div>

              <div className="col-span-2">
                <label className="block mb-2">Media</label>
                <MediaUpload
                  value={values.image}
                  onMediaChange={(files) => setFieldValue('image', files)}
                />
              </div>

              <div>
                <label className="block mb-2">Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className="w-full border p-2 rounded"
                  rows="4"
                />
                {errors.description && touched.description ? (
                  <div className="text-red-500 text-sm">{errors.description}</div>
                ) : null}
              </div>

              <div className="flex items-center">
                <Field type="checkbox" name="bestseller" className="mr-2" />
                <label>Bestseller</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50">
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Add;
