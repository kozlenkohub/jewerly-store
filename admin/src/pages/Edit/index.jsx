import React, { useState, useEffect } from 'react';
import axios from '../../config/axiosInstance';
import CategorySelect from '../../components/CategorySelect';
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
  Tooltip,
  Chip,
  Divider,
  Paper,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  CircularProgress,
  Alert,
  InputAdornment,
  Stack,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  CheckBox as CheckBoxIcon,
  LinearScale as RangeIcon,
  Category as CategoryIcon,
  Edit as EditIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';

const Edit = () => {
  const [filters, setFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');

  useEffect(() => {
    Promise.all([axios.get('api/filter'), axios.get('api/category/get')])
      .then(([filtersRes, categoriesRes]) => {
        setFilters(filtersRes.data);
        setCategories(categoriesRes.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSaveCategories = async (newCategories) => {
    try {
      const currentFilter = filters.find((filter) =>
        filter.options.some((opt) => opt === editingOption),
      );

      if (!currentFilter) return;

      const updatedOptions = currentFilter.options.map((opt) =>
        opt === editingOption ? { ...opt, category: newCategories } : opt,
      );

      const response = await axios.put(`api/filter/${currentFilter._id}`, {
        ...currentFilter,
        options: updatedOptions,
      });

      if (response.status === 200) {
        setFilters((prevFilters) =>
          prevFilters.map((filter) => (filter._id === currentFilter._id ? response.data : filter)),
        );
        setIsModalOpen(false);
        setEditingOption(null);
      }
    } catch (error) {
      console.error('Failed to update categories:', error);
    }
  };

  const CategoryModal = ({ option, onClose, onSave }) => {
    const [selectedCategories, setSelectedCategories] = useState(option.category || []);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);

    const getAllCategoryIds = (categories) => {
      let ids = [];
      categories.forEach((category) => {
        ids.push(category._id);
        if (category.children?.length > 0) {
          ids = [...ids, ...getAllCategoryIds(category.children)];
        }
      });
      return ids;
    };

    const handleSelectAll = () => {
      setLoading(true);
      setTimeout(() => {
        const allIds = getAllCategoryIds(categories);
        setSelectedCategories(allIds);
        setLoading(false);
      }, 300);
    };

    const handleClearAll = () => {
      setSelectedCategories([]);
    };

    const handleToggleCategory = (categoryId) => {
      setSelectedCategories((prev) =>
        prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId],
      );
    };

    const filteredCategories = categories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return (
      <Dialog
        open={true}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { minHeight: '60vh' },
        }}>
        <DialogTitle>
          <Stack spacing={2}>
            <Typography variant="h6">
              Edit Categories for <strong>{option.name[currentLanguage]}</strong>
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearchQuery('')}>
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ mb: 2 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
              <Button
                size="small"
                variant="outlined"
                onClick={handleSelectAll}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}>
                Select All
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                onClick={handleClearAll}
                disabled={selectedCategories.length === 0}>
                Clear All
              </Button>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {selectedCategories.length} categories selected
            </Typography>
          </Box>

          {filteredCategories.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No categories found matching your search
            </Alert>
          ) : (
            <List
              sx={{
                maxHeight: '50vh',
                overflow: 'auto',
                bgcolor: 'background.paper',
                '& .MuiListItem-root:hover': {
                  bgcolor: 'action.hover',
                },
              }}>
              {filteredCategories.map((category) => (
                <ListItem
                  key={category._id}
                  dense
                  button
                  onClick={() => handleToggleCategory(category._id)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                  }}>
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={selectedCategories.includes(category._id)}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={category.name}
                    secondary={category.description || 'No description'}
                    primaryTypographyProps={{
                      variant: 'body2',
                      fontWeight: selectedCategories.includes(category._id) ? 500 : 400,
                    }}
                    secondaryTypographyProps={{
                      variant: 'caption',
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2.5, bgcolor: 'background.default' }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button onClick={() => onSave(selectedCategories)} variant="contained" disabled={loading}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const getFilterIcon = (type) => {
    switch (type) {
      case 'checkbox':
        return <CheckBoxIcon />;
      case 'range':
        return <RangeIcon />;
      default:
        return <FilterIcon />;
    }
  };

  const renderOptions = (filter) => {
    if (filter.type === 'checkbox') {
      return (
        <Grid container spacing={2}>
          {filter.options.map((option, idx) => (
            <Grid item xs={12} sm={6} key={idx}>
              <Paper
                elevation={0}
                variant="outlined"
                sx={{
                  p: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.02)',
                    transition: 'background-color 0.3s',
                  },
                }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                  {option.img && (
                    <Box
                      component="img"
                      src={option.img}
                      alt={option.name[currentLanguage]}
                      sx={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        borderRadius: 1,
                        padding: '4px',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      }}
                    />
                  )}
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {option.name[currentLanguage]}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.type}
                    </Typography>
                  </Box>
                  <Tooltip title="Edit Categories">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingOption(option);
                        setIsModalOpen(true);
                      }}
                      sx={{ color: 'primary.main' }}>
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {option.category?.length > 0 ? (
                    option.category.map((catId) => {
                      const category = categories.find((c) => c._id === catId);
                      return category ? (
                        <Chip
                          key={catId}
                          label={category.name}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.75rem' }}
                        />
                      ) : null;
                    })
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      No categories assigned
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (filter.type === 'range') {
      return (
        <Box sx={{ mt: 2 }}>
          {filter.options.map((option, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Typography variant="body2">{option.name[currentLanguage]}</Typography>
              <Chip
                label={option.type}
                size="small"
                variant="outlined"
                sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
              />
            </Paper>
          ))}
        </Box>
      );
    }
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
          Filter Management
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            sx={{ height: 40 }}>
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="ru">Russian</MenuItem>
            <MenuItem value="uk">Ukrainian</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filters.map((filter) => (
          <Grid item xs={12} key={filter._id}>
            <Card sx={{ overflow: 'visible' }}>
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    mb: 3,
                  }}>
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      backgroundColor: 'primary.main',
                      color: 'white',
                    }}>
                    {getFilterIcon(filter.type)}
                  </Box>
                  <Box flex={1}>
                    <Typography variant="h6" gutterBottom>
                      {filter.label[currentLanguage]}
                    </Typography>
                    <Chip
                      label={`Type: ${filter.type}`}
                      size="small"
                      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.04)' }}
                    />
                  </Box>
                </Box>
                <Divider sx={{ mb: 3 }} />
                {renderOptions(filter)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {isModalOpen && editingOption && (
        <CategoryModal
          option={editingOption}
          onClose={() => {
            setIsModalOpen(false);
            setEditingOption(null);
          }}
          onSave={handleSaveCategories}
        />
      )}
    </Box>
  );
};

export default Edit;
