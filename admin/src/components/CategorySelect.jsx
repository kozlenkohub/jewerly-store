import React from 'react';
import Select from 'react-select';

const CategorySelect = ({ categories, onChange, value }) => {
  const createOptions = (categories, prefix = '') => {
    let options = [];

    for (const category of categories) {
      // Добавляем текущую категорию
      options.push({
        value: category._id,
        label: prefix + category.name,
      });

      // Если есть дочерние категории, добавляем их с отступом
      if (category.children && category.children.length > 0) {
        const childOptions = createOptions(category.children, prefix + '    ');
        options = [...options, ...childOptions];
      }
    }

    return options;
  };

  const options = createOptions(categories);
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <Select
      value={selectedOption}
      onChange={(option) => {
        onChange({
          target: {
            name: 'category',
            value: option ? option.value : '',
          },
        });
      }}
      options={options}
      isClearable
      isSearchable
      placeholder="Select Category"
      classNamePrefix="select"
      styles={{
        option: (base, state) => ({
          ...base,
          paddingLeft: base.paddingLeft + (state.data.label.match(/^\s+/) || [''])[0].length * 4,
          backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#BFDBFE' : 'white',
          color: state.isSelected ? 'white' : '#374151',
          ':active': {
            backgroundColor: '#2563EB',
          },
        }),
        control: (base, state) => ({
          ...base,
          borderColor: state.isFocused ? '#3B82F6' : '#E5E7EB',
          boxShadow: state.isFocused ? '0 0 0 1px #3B82F6' : 'none',
          '&:hover': {
            borderColor: '#3B82F6',
          },
        }),
      }}
    />
  );
};

export default CategorySelect;
