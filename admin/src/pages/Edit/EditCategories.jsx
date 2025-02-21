import React, { useState, useEffect } from 'react';
import axios from '../../config/axiosInstance';
import { slugify } from '../../utils/helpers';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  TextField,
  Paper,
  Stack,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from '@mui/icons-material';

const EditCategories = () => {
  const [categories, setCategories] = useState([]);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const languageLabels = {
    en: 'English',
    ru: 'Русский',
    uk: 'Українська',
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('api/category/get');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      let response;
      if (editingCategory) {
        response = await axios.put(`api/category/${editingCategory._id}`, categoryData);
      } else {
        response = await axios.post('api/category/create', categoryData);
      }

      if (response.status === 200 || response.status === 201) {
        fetchCategories();
        setIsModalOpen(false);
        setEditingCategory(null);
      }
    } catch (error) {
      console.error('Failed to save category:', error);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`api/category/${categoryId}`);
        fetchCategories();
      } catch (error) {
        console.error('Failed to delete category:', error);
      }
    }
  };

  const CategoryModal = ({ category, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      name: category?.name
        ? typeof category.name === 'object'
          ? category.name
          : { en: category.name, ru: category.name, uk: category.name }
        : { en: '', ru: '', uk: '' },
      description: category?.description
        ? typeof category.description === 'object'
          ? category.description
          : { en: '', ru: '', uk: '' }
        : { en: '', ru: '', uk: '' },
      image: category?.image || '',
      icon: category?.icon || '',
      label: category?.label || '',
      slug: category?.slug || '',
      parent: category?.parent || null,
      filters: category?.filters || [],
    });

    useEffect(() => {
      if (formData.name.en && !category) {
        setFormData((prev) => ({
          ...prev,
          slug: slugify(formData.name.en),
        }));
      }
    }, [formData.name.en, category]);

    const handleImageUpload = async (event, type = 'image') => {
      const file = event.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append('image', file);
        try {
          const response = await axios.post('api/upload', formData);
          setFormData((prev) => ({ ...prev, [type]: response.data.url }));
        } catch (error) {
          console.error('Failed to upload image:', error);
        }
      }
    };

    const renderLanguageFields = (fieldName, isMultiline = false) => (
      <Box>
        <Typography variant="subtitle2" gutterBottom>
          {fieldName}
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(languageLabels).map((lang) => (
            <Grid item xs={12} key={lang}>
              <TextField
                fullWidth
                size="small"
                multiline={isMultiline}
                rows={isMultiline ? 2 : 1}
                label={languageLabels[lang]}
                value={formData[fieldName.toLowerCase()][lang]}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    [fieldName.toLowerCase()]: {
                      ...prev[fieldName.toLowerCase()],
                      [lang]: e.target.value,
                    },
                  }))
                }
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );

    return (
      <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{category ? 'Edit Category' : 'Create New Category'}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3}>
            {renderLanguageFields('Name')}
            {renderLanguageFields('Description', true)}

            <TextField
              fullWidth
              size="small"
              label="Slug"
              value={formData.slug}
              onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
              helperText="URL-friendly version of the name"
            />

            <TextField
              fullWidth
              size="small"
              label="Label"
              value={formData.label}
              onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
            />

            <Stack direction="row" spacing={2}>
              <Box flex={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Main Image
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  sx={{ mb: 2 }}>
                  Upload Image
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'image')}
                  />
                </Button>
                {formData.image && (
                  <Box
                    component="img"
                    src={formData.image}
                    alt="Category"
                    sx={{
                      width: '100%',
                      maxHeight: 200,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
              <Box flex={1}>
                <Typography variant="subtitle2" gutterBottom>
                  Icon
                </Typography>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  sx={{ mb: 2 }}>
                  Upload Icon
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'icon')}
                  />
                </Button>
                {formData.icon && (
                  <Box
                    component="img"
                    src={formData.icon}
                    alt="Category Icon"
                    sx={{
                      width: 40,
                      height: 40,
                      objectFit: 'contain',
                      borderRadius: 1,
                    }}
                  />
                )}
              </Box>
            </Stack>

            <FormControl fullWidth>
              <Typography variant="subtitle2" gutterBottom>
                Parent Category
              </Typography>
              <Select
                value={formData.parent || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, parent: e.target.value }))}
                size="small">
                <MenuItem value="">
                  <em>None (Top Level)</em>
                </MenuItem>
                {categories.map((cat) => (
                  <MenuItem
                    key={cat._id}
                    value={cat._id}
                    disabled={category && category._id === cat._id}>
                    {cat.name[currentLanguage]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={() => onSave(formData)}>
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          mb: 4,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          Category Management
        </Typography>
        <Stack direction="row" spacing={2}>
          <FormControl size="small">
            <Select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              sx={{ height: 40 }}>
              {Object.entries(languageLabels).map(([code, label]) => (
                <MenuItem key={code} value={code}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingCategory(null);
              setIsModalOpen(true);
            }}>
            Add Category
          </Button>
        </Stack>
      </Box>

      <Grid container spacing={2}>
        {categories.map((category) => (
          <Grid item xs={12} sm={6} md={4} key={category._id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Stack spacing={1} direction="row" alignItems="center">
                    {category.icon && (
                      <Box
                        component="img"
                        src={category.icon}
                        alt="Icon"
                        sx={{
                          width: 24,
                          height: 24,
                          objectFit: 'contain',
                        }}
                      />
                    )}
                    {category.image && (
                      <Box
                        component="img"
                        src={category.image}
                        alt={category.name[currentLanguage]}
                        sx={{
                          width: 80,
                          height: 80,
                          objectFit: 'cover',
                          borderRadius: 1,
                        }}
                      />
                    )}
                  </Stack>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      {typeof category.name === 'object'
                        ? category.name[currentLanguage] || category.name.en || 'Unnamed Category'
                        : category.name || 'Unnamed Category'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip size="small" label={`Slug: ${category.slug}`} />
                      {category.label && <Chip size="small" label={`Label: ${category.label}`} />}
                    </Stack>
                    {category.children?.length > 0 && (
                      <Box sx={{ mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Subcategories: {category.children.length}
                        </Typography>
                      </Box>
                    )}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        mb: 2,
                      }}>
                      {typeof category.description === 'object'
                        ? category.description[currentLanguage] ||
                          category.description.en ||
                          'No description'
                        : category.description || 'No description'}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingCategory(category);
                          setIsModalOpen(true);
                        }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDeleteCategory(category._id)}>
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={handleSaveCategory}
        />
      )}
    </Box>
  );
};

export default EditCategories;
