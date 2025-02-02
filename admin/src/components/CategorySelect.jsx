import React, { useMemo } from 'react';
import Select from 'react-select';

const CategorySelect = ({ categories, onChange, value }) => {
  const options = useMemo(() => {
    const createOptions = (categories, level = 0) => {
      return categories.reduce((acc, category) => {
        // Add parent category
        acc.push({
          value: category._id,
          label: category.name,
          level,
          isParent: category.children?.length > 0,
          hasImage: !!category.icon || !!category.image,
        });

        // Add children if they exist
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
      formatOptionLabel={({ label, level, isParent, hasImage }) => (
        <div className="flex items-center gap-2">
          <span style={{ paddingLeft: `${level * 16}px` }} className="flex items-center gap-2">
            {level > 0 ? (
              <span className="text-gray-400">└─</span>
            ) : isParent ? (
              <span className="text-blue-500">📁</span>
            ) : null}
            <span className={isParent ? 'font-medium' : 'font-normal'}>{label}</span>
          </span>
        </div>
      )}
      styles={{
        container: (base) => ({
          ...base,
          width: '100%',
          minWidth: '250px',
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#BFDBFE' : 'white',
          color: state.isSelected ? 'white' : '#374151',
          padding: '8px 12px',
          cursor: 'pointer',
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
        menu: (base) => ({
          ...base,
          zIndex: 100,
        }),
      }}
    />
  );
};

export default CategorySelect;
