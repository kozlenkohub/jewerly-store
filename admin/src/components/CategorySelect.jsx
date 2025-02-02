import React, { useMemo } from 'react';
import Select from 'react-select';

const CategorySelect = ({ categories, onChange, value }) => {
  const options = useMemo(() => {
    const createOptions = (categories, level = 0) => {
      return categories.reduce((acc, category) => {
        acc.push({
          value: category._id,
          label: category.name,
          level: level,
        });

        if (category.children?.length > 0) {
          acc.push(...createOptions(category.children, level + 1));
        }

        return acc;
      }, []);
    };

    return createOptions(categories);
  }, [categories]);

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
      formatOptionLabel={({ label, level }) => (
        <span style={{ paddingLeft: `${level * 20}px` }}>{label}</span>
      )}
      styles={{
        option: (base, state) => ({
          ...base,
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
