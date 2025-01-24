import React from 'react';

const FilterItem = ({ label, options }) => {
  return (
    <div className="border border-gray-300 pl-5 py-3 my-5 sm:block">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {options.map((option) => (
          <p className="flex items-center gap-2" key={option}>
            <input type="checkbox" className="w-4 h-4" value={option} /> {option}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FilterItem;
