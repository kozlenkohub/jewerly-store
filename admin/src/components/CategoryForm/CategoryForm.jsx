import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

const validationSchema = Yup.object({
  name: Yup.string().trim().required('Name is required'),
  label: Yup.string().nullable(),
  parent: Yup.string().nullable(),
  image: Yup.mixed(),
  icon: Yup.mixed(),
});

const selectStyles = {
  // ...existing styles object from AddNewCategory...
};

const CategoryForm = ({ onSubmit, parentCategories, initialValues = {} }) => {
  const generateSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

  return (
    <Formik
      initialValues={{
        name: '',
        image: null,
        icon: null,
        label: '',
        parent: '',
        slug: '',
        ...initialValues,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* Name field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
            <Field
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3"
              onChange={(e) => {
                setFieldValue('name', e.target.value);
                setFieldValue('slug', generateSlug(e.target.value));
              }}
            />
            {errors.name && touched.name && (
              <div className="text-red-500 text-sm">{errors.name}</div>
            )}
          </div>

          {/* Slug field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Slug</label>
            <Field
              name="slug"
              disabled
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-100"
            />
          </div>

          {/* Label field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Label</label>
            <Field
              name="label"
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
          </div>

          {/* Image field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFieldValue('image', e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
            {values.image && (
              <img
                src={URL.createObjectURL(values.image)}
                alt="Preview"
                className="mt-2 h-20 object-contain"
              />
            )}
          </div>

          {/* Icon field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Icon</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFieldValue('icon', e.target.files[0])}
              className="shadow appearance-none border rounded w-full py-2 px-3"
            />
            {values.icon && (
              <img
                src={URL.createObjectURL(values.icon)}
                alt="Preview"
                className="mt-2 h-20 object-contain"
              />
            )}
          </div>

          {/* Parent Category field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">Parent Category</label>
            <Select
              isClearable
              value={parentCategories.find((cat) => cat._id === values.parent)}
              onChange={(option) => setFieldValue('parent', option?._id || '')}
              options={parentCategories}
              getOptionLabel={(option) => option.name}
              getOptionValue={(option) => option._id}
              className="basic-select"
              classNamePrefix="select"
              styles={selectStyles}
              formatOptionLabel={(option) => (
                <div className="flex items-center gap-2">
                  {option.icon && (
                    <img src={option.icon} alt={option.name} className="w-6 h-6 object-contain" />
                  )}
                  <span>{option.name}</span>
                </div>
              )}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Category
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;
