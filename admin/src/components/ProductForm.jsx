import React, { useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import Select from 'react-select';

import { METAL_TYPES, CUT_FORMS, STYLES, CLARITY_TYPES, PURITY_TYPES } from '../utils/modelEnums';
import MediaUpload from './MediaUpload';
import CategorySelect from './CategorySelect';

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
  discount: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100 or less')
    .transform((value) => (isNaN(value) ? undefined : value)),
});

const createSelectOptions = (items) => {
  return items.map((item) => ({
    value: item,
    label: item.charAt(0).toUpperCase() + item.slice(1),
  }));
};

const createNumericSelectOptions = (items) => {
  return items.map((item) => ({
    value: item,
    label: item.toString(),
  }));
};

const ProductForm = ({ onSubmit, categories }) => {
  const metalOptions = useMemo(() => createSelectOptions(METAL_TYPES), []);
  const cutFormOptions = useMemo(() => createSelectOptions(CUT_FORMS), []);
  const styleOptions = useMemo(() => createSelectOptions(STYLES), []);
  const clarityOptions = useMemo(() => createSelectOptions(CLARITY_TYPES), []);
  const purityOptions = useMemo(() => createNumericSelectOptions(PURITY_TYPES), []);

  return (
    <Formik
      initialValues={{
        name: '',
        description: '',
        price: '',
        image: [],
        category: '',
        weight: '',
        collection: '',
        metal: '',
        cutForm: '',
        style: '',
        clarity: '',
        purity: '',
        carats: '',
        bestseller: false,
        discount: '',
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Name field */}
            <div>
              <label className="block mb-2">Name</label>
              <Field type="text" name="name" className="w-full border p-2 rounded" />
              {errors.name && touched.name && (
                <div className="text-red-500 text-sm">{errors.name}</div>
              )}
            </div>

            {/* Price field */}
            <div>
              <label className="block mb-2">Price</label>
              <Field type="number" name="price" className="w-full border p-2 rounded" />
              {errors.price && touched.price && (
                <div className="text-red-500 text-sm">{errors.price}</div>
              )}
            </div>

            {/* Discount field */}
            <div>
              <label className="block mb-2">Discount (%)</label>
              <Field
                type="number"
                name="discount"
                min="0"
                max="100"
                step="1"
                className="w-full border p-2 rounded"
              />
              {errors.discount && touched.discount && (
                <div className="text-red-500 text-sm">{errors.discount}</div>
              )}
            </div>

            {/* Category Select */}
            <div>
              <label className="block mb-2">Category</label>
              <CategorySelect
                categories={categories}
                value={values.category}
                onChange={(e) => setFieldValue('category', e.target.value)}
              />
              {errors.category && touched.category && (
                <div className="text-red-500 text-sm">{errors.category}</div>
              )}
            </div>

            {/* All other select fields */}
            {[
              { label: 'Metal', name: 'metal', options: metalOptions },
              { label: 'Cut Form', name: 'cutForm', options: cutFormOptions },
              { label: 'Style', name: 'style', options: styleOptions },
              { label: 'Clarity', name: 'clarity', options: clarityOptions },
              { label: 'Purity', name: 'purity', options: purityOptions },
            ].map(({ label, name, options }) => (
              <div key={name}>
                <label className="block mb-2">{label}</label>
                <Select
                  value={options.find((option) => option.value === values[name])}
                  onChange={(option) => setFieldValue(name, option?.value || '')}
                  options={options}
                  isClearable
                  placeholder={`Select ${label}`}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                {errors[name] && touched[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            ))}

            {/* Numeric fields */}
            {[
              { label: 'Carats', name: 'carats' },
              { label: 'Weight (g)', name: 'weight' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block mb-2">{label}</label>
                <Field
                  type="number"
                  step="0.01"
                  name={name}
                  className="w-full border p-2 rounded"
                />
                {errors[name] && touched[name] && (
                  <div className="text-red-500 text-sm">{errors[name]}</div>
                )}
              </div>
            ))}

            {/* Collection field */}
            <div>
              <label className="block mb-2">Collection</label>
              <Field type="text" name="collection" className="w-full border p-2 rounded" />
              {errors.collection && touched.collection && (
                <div className="text-red-500 text-sm">{errors.collection}</div>
              )}
            </div>

            {/* Media Upload */}
            <div className="col-span-2">
              <label className="block mb-2">Media</label>
              <MediaUpload
                value={values.image}
                onMediaChange={(files) => setFieldValue('image', files)}
              />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="block mb-2">Description</label>
              <Field
                as="textarea"
                name="description"
                className="w-full border p-2 rounded"
                rows="4"
              />
              {errors.description && touched.description && (
                <div className="text-red-500 text-sm">{errors.description}</div>
              )}
            </div>

            {/* Bestseller checkbox */}
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
  );
};

export default ProductForm;
