import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Autocomplete,
  Box,
  IconButton,
  Paper,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

const validationSchema = Yup.object({
  name: Yup.object().shape({
    en: Yup.string().required('English name is required'),
    ru: Yup.string(),
    uk: Yup.string(),
  }),
  label: Yup.string(),
  parent: Yup.string().nullable(),
  image: Yup.mixed(),
  icon: Yup.mixed(),
});

const CategoryForm = ({ onSubmit, parentCategories, initialValues = {} }) => {
  const generateSlug = (name) => name?.en?.toLowerCase().replace(/\s+/g, '-') || '';

  return (
    <Formik
      initialValues={{
        name: { en: '', ru: '', uk: '' },
        image: null,
        icon: null,
        label: '',
        parent: '',
        slug: '',
        ...initialValues,
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}>
      {({ errors, touched, setFieldValue, values, isSubmitting }) => {
        console.log('isSubmitting:', isSubmitting);
        return (
          <Form>
            <Grid container spacing={3}>
              {/* Name fields */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Category Names
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Name (English)*"
                      name="name.en"
                      value={values.name.en}
                      onChange={(e) => {
                        setFieldValue('name.en', e.target.value);
                        setFieldValue('slug', generateSlug({ en: e.target.value }));
                      }}
                      error={errors.name?.en && touched.name?.en}
                      helperText={touched.name?.en && errors.name?.en}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Name (Russian)"
                      name="name.ru"
                      value={values.name.ru}
                      onChange={(e) => setFieldValue('name.ru', e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Name (Ukrainian)"
                      name="name.uk"
                      value={values.name.uk}
                      onChange={(e) => setFieldValue('name.uk', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Grid>

              {/* Slug field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Slug"
                  name="slug"
                  value={values.slug}
                  disabled
                  variant="filled"
                />
              </Grid>

              {/* Label field */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Label"
                  name="label"
                  value={values.label}
                  onChange={(e) => setFieldValue('label', e.target.value)}
                />
              </Grid>

              {/* File upload fields */}
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Category Image
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  hidden
                  onChange={(e) => setFieldValue('image', e.target.files[0])}
                />
                <label htmlFor="image-upload">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {values.image ? (
                      <Box sx={{ position: 'relative', width: '100%' }}>
                        <img
                          src={URL.createObjectURL(values.image)}
                          alt="Preview"
                          style={{ maxHeight: 100, maxWidth: '100%' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue('image', null);
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <CloudUploadIcon sx={{ fontSize: 40 }} />
                    )}
                  </Paper>
                </label>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="subtitle1" gutterBottom>
                  Category Icon
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  id="icon-upload"
                  hidden
                  onChange={(e) => setFieldValue('icon', e.target.files[0])}
                />
                <label htmlFor="icon-upload">
                  <Paper
                    variant="outlined"
                    sx={{
                      p: 2,
                      textAlign: 'center',
                      cursor: 'pointer',
                      minHeight: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {values.icon ? (
                      <Box sx={{ position: 'relative', width: '100%' }}>
                        <img
                          src={URL.createObjectURL(values.icon)}
                          alt="Preview"
                          style={{ maxHeight: 100, maxWidth: '100%' }}
                        />
                        <IconButton
                          sx={{ position: 'absolute', top: 0, right: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setFieldValue('icon', null);
                          }}>
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    ) : (
                      <CloudUploadIcon sx={{ fontSize: 40 }} />
                    )}
                  </Paper>
                </label>
              </Grid>

              {/* Parent Category field */}
              <Grid item xs={12}>
                <Autocomplete
                  options={parentCategories}
                  getOptionLabel={(option) => option.name.en || ''}
                  value={parentCategories.find((cat) => cat._id === values.parent) || null}
                  onChange={(_, newValue) => setFieldValue('parent', newValue?._id || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Parent Category" fullWidth />
                  )}
                  renderOption={(props, option) => (
                    <Box component="li" {...props}>
                      {option.icon && (
                        <img
                          src={option.icon}
                          alt=""
                          style={{ width: 20, height: 20, marginRight: 8 }}
                        />
                      )}
                      {option.name.en}
                    </Box>
                  )}
                />
              </Grid>

              {/* Submit button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={isSubmitting}>
                  Save Category
                </Button>
              </Grid>
            </Grid>
          </Form>
        );
      }}
    </Formik>
  );
};

export default CategoryForm;
