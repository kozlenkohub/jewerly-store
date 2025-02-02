import React, { useState, useEffect } from 'react';
import axios from '../../config/axiosInstance';
import CategorySelect from '../../components/CategorySelect';

const Edit = () => {
  const [filters, setFilters] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingOption, setEditingOption] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      // Find the filter and option index
      const currentFilter = filters.find((filter) =>
        filter.options.some((opt) => opt === editingOption),
      );

      if (!currentFilter) return;

      // Update the specific option with new categories
      const updatedOptions = currentFilter.options.map((opt) =>
        opt === editingOption ? { ...opt, category: newCategories } : opt,
      );

      // Prepare the update payload
      const updatePayload = {
        key: currentFilter.key,
        label: currentFilter.label,
        type: currentFilter.type,
        options: updatedOptions,
      };

      // Send update request
      const response = await axios.put(`api/filter/${currentFilter._id}`, updatePayload);

      if (response.status === 200) {
        // Update local state with the response data
        setFilters((prevFilters) =>
          prevFilters.map((filter) => (filter._id === currentFilter._id ? response.data : filter)),
        );
        setIsModalOpen(false);
        setEditingOption(null);
      }
    } catch (error) {
      console.error('Failed to update categories:', error);
      // Optionally add error notification here
    }
  };

  const CategoryModal = ({ option, onClose, onSave }) => {
    const [selectedCategories, setSelectedCategories] = useState(option.category);

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
      const allIds = getAllCategoryIds(categories);
      setSelectedCategories(allIds);
    };

    return (
      <div className="fixed inset-0 bg-black/10 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-[400px]">
          <h3 className="text-lg font-medium mb-4">Edit Categories</h3>
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium">Selected Categories:</label>
                <button onClick={handleSelectAll} className="text-blue-500 text-sm hover:underline">
                  Select All Categories
                </button>
              </div>
              {selectedCategories.map((catId, idx) => (
                <div key={idx} className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <CategorySelect
                      categories={categories}
                      value={catId}
                      onChange={(e) => {
                        const newCategories = [...selectedCategories];
                        newCategories[idx] = e.target.value;
                        setSelectedCategories(newCategories);
                      }}
                    />
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCategories(selectedCategories.filter((_, i) => i !== idx));
                    }}
                    className="text-red-500 hover:text-red-700 px-2">
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSelectedCategories([...selectedCategories, categories[0]?._id])}
                className="text-blue-500 text-sm hover:underline">
                + Add Category
              </button>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => onSave(selectedCategories)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderOptions = (filter) => {
    if (filter.type === 'checkbox') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filter.options.map((option, idx) => (
            <div key={idx} className="flex flex-col gap-2 p-2 border rounded-md hover:bg-gray-50">
              <div className="flex items-center gap-2">
                {option.img && (
                  <img src={option.img} alt={option.type} className="w-8 h-8 object-contain" />
                )}
                <span className="text-sm">{option.type}</span>
              </div>
              <button
                onClick={() => {
                  setEditingOption(option);
                  setIsModalOpen(true);
                }}
                className="text-xs text-blue-500 hover:underline text-left">
                Categories:{' '}
                {option.category
                  .map((catId) => categories.find((c) => c._id === catId)?.name)
                  .join(', ')}
              </button>
            </div>
          ))}
        </div>
      );
    }

    if (filter.type === 'range') {
      return (
        <div className="space-y-2">
          {filter.options.map((option, idx) => (
            <div key={idx} className="p-2 bg-gray-50 rounded-md text-sm">
              {option.type}
            </div>
          ))}
        </div>
      );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filters.map((filter) => (
        <div key={filter._id} className="bg-white rounded-lg shadow-sm p-4">
          <div className="border-b pb-3 mb-4">
            <h3 className="text-lg font-medium">{filter.label}</h3>
            <span className="text-sm text-gray-500">Type: {filter.type}</span>
          </div>
          {renderOptions(filter)}
        </div>
      ))}

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
    </div>
  );
};

export default Edit;
