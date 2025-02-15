import React, { useMemo } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Grid,
  TextField,
  Button,
  Typography,
  FormControl,
  FormControlLabel,
  Checkbox,
  Paper,
  Box,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import Select from 'react-select';

import {
  METAL_TYPES,
  CUT_FORMS,
  STYLES,
  CLARITY_TYPES,
  PURITY_TYPES,
  ringSizer,
} from '../utils/modelEnums';
import MediaUpload from './MediaUpload';
import CategorySelect from './CategorySelect';

const validationSchema = Yup.object({
  name: Yup.object({
    en: Yup.string().required('Required'),
    ru: Yup.string(),
    uk: Yup.string(),
  }).required(),
  description: Yup.object({
    en: Yup.string().required('Required'),
    ru: Yup.string(),
    uk: Yup.string(),
  }).required(),
  price: Yup.number().required('Required').positive('Must be positive'),
  category: Yup.string().required('Required'),
  metal: Yup.string().required('Required'),
  cutForm: Yup.string().required('Required'),
  weight: Yup.number().required('Required').positive('Must be positive'),
  collection: Yup.string().required('Required'),
  purity: Yup.number().transform((value) => (isNaN(value) ? undefined : value)),
  carats: Yup.number().transform((value) => (isNaN(value) ? undefined : value)),
  discount: Yup.number()
    .min(0, 'Must be 0 or greater')
    .max(100, 'Must be 100 or less')
    .transform((value) => (isNaN(value) ? undefined : value)),
  size: Yup.array().of(Yup.number()),
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
  const [activeLanguage, setActiveLanguage] = React.useState('en');
  const metalOptions = useMemo(() => createSelectOptions(METAL_TYPES), []);
  const cutFormOptions = useMemo(() => createSelectOptions(CUT_FORMS), []);
  const styleOptions = useMemo(() => createSelectOptions(STYLES), []);
  const clarityOptions = useMemo(() => createSelectOptions(CLARITY_TYPES), []);
  const purityOptions = useMemo(() => createNumericSelectOptions(PURITY_TYPES), []);

  return (
    <Formik
      initialValues={{
        name: { en: '', ru: '', uk: '' },
        description: { en: '', ru: '', uk: '' },
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
        size: [],
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ isSubmitting, setFieldValue, values, errors, touched }) => (
        <Form>
          <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
            <Grid container spacing={3}>
              {/* Localized fields with language tabs */}
              <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs
                    value={activeLanguage}
                    onChange={(_, newValue) => setActiveLanguage(newValue)}
                    sx={{ mb: 2 }}>
                    <Tab label="English" value="en" />
                    <Tab label="Русский" value="ru" />
                    <Tab label="Українська" value="uk" />
                  </Tabs>
                </Box>

                {/* Name field for active language */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Product Name
                  </Typography>
                  <Field
                    name={`name.${activeLanguage}`}
                    as={TextField}
                    label={`Name (${activeLanguage.toUpperCase()})`}
                    fullWidth
                    error={errors.name?.[activeLanguage] && touched.name?.[activeLanguage]}
                    helperText={touched.name?.[activeLanguage] && errors.name?.[activeLanguage]}
                  />
                </Box>

                {/* Description field for active language */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Description
                  </Typography>
                  <Field
                    name={`description.${activeLanguage}`}
                    as={TextField}
                    label={`Description (${activeLanguage.toUpperCase()})`}
                    multiline
                    rows={4}
                    fullWidth
                    error={
                      errors.description?.[activeLanguage] && touched.description?.[activeLanguage]
                    }
                    helperText={
                      touched.description?.[activeLanguage] && errors.description?.[activeLanguage]
                    }
                  />
                </Box>
              </Grid>

              {/* Preview of other languages */}
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Other Languages Preview
                  </Typography>
                  <Grid container spacing={2}>
                    {['en', 'ru', 'uk']
                      .filter((lang) => lang !== activeLanguage)
                      .map((lang) => (
                        <Grid item xs={6} key={lang}>
                          <Typography variant="caption" color="text.secondary">
                            {lang.toUpperCase()}: {values.name[lang] || '(not set)'}
                          </Typography>
                        </Grid>
                      ))}
                  </Grid>
                </Box>
              </Grid>

              {/* Price and Discount */}
              <Grid item xs={12} md={6}>
                <Field
                  name="price"
                  as={TextField}
                  label="Price"
                  type="number"
                  fullWidth
                  error={errors.price && touched.price}
                  helperText={touched.price && errors.price}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Field
                  name="discount"
                  as={TextField}
                  label="Discount (%)"
                  type="number"
                  fullWidth
                  InputProps={{ inputProps: { min: 0, max: 100 } }}
                />
              </Grid>

              {/* Category Select */}
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <CategorySelect
                    categories={categories}
                    value={values.category}
                    onChange={(e) => setFieldValue('category', e.target.value)}
                  />
                </FormControl>
              </Grid>

              {/* Metal, CutForm, etc selects */}
              {[
                { label: 'Metal', name: 'metal', options: metalOptions },
                { label: 'Cut Form', name: 'cutForm', options: cutFormOptions },
                { label: 'Style', name: 'style', options: styleOptions },
                { label: 'Clarity', name: 'clarity', options: clarityOptions },
                { label: 'Purity', name: 'purity', options: purityOptions },
              ].map(({ label, name, options }) => (
                <Grid item xs={12} md={6} key={name}>
                  <FormControl fullWidth>
                    <Select
                      value={options.find((option) => option.value === values[name])}
                      onChange={(option) => setFieldValue(name, option?.value || '')}
                      options={options}
                      isClearable
                      placeholder={`Select ${label}`}
                    />
                  </FormControl>
                </Grid>
              ))}

              {/* Numeric fields */}
              {[
                { label: 'Carats', name: 'carats' },
                { label: 'Weight (g)', name: 'weight' },
              ].map(({ label, name }) => (
                <Grid item xs={12} md={6} key={name}>
                  <Field
                    name={name}
                    as={TextField}
                    label={label}
                    type="number"
                    fullWidth
                    step="0.01"
                  />
                </Grid>
              ))}

              {/* Collection field */}
              <Grid item xs={12} md={6}>
                <Field name="collection" as={TextField} label="Collection" fullWidth />
              </Grid>

              {/* Sizes */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Available Sizes
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      setFieldValue(
                        'size',
                        values.size.length === ringSizer.length ? [] : ringSizer,
                      )
                    }>
                    {values.size.length === ringSizer.length ? 'Unselect All' : 'Select All'}
                  </Button>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {ringSizer.map((size) => (
                    <FormControlLabel
                      key={size}
                      control={
                        <Checkbox
                          checked={values.size.includes(size)}
                          onChange={(e) => {
                            const newSizes = e.target.checked
                              ? [...values.size, size]
                              : values.size.filter((s) => s !== size);
                            setFieldValue('size', newSizes);
                          }}
                        />
                      }
                      label={size}
                    />
                  ))}
                </Box>
              </Grid>

              {/* Media Upload */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Media Files
                </Typography>
                <MediaUpload
                  value={values.image}
                  onMediaChange={(files) => setFieldValue('image', files)}
                />
              </Grid>

              {/* Bestseller checkbox */}
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Field name="bestseller" as={Checkbox} />}
                  label="Bestseller"
                />
              </Grid>
            </Grid>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="submit" variant="contained" disabled={isSubmitting} size="large">
              {isSubmitting ? 'Adding...' : 'Add Product'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
