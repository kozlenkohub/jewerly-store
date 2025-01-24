import React from 'react';

const FilterItem = ({ label, type, options }) => {
  return (
    <div className="border border-gray-300 pl-5 py-3 my-5 sm:block">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {type === 'checkbox' &&
          options.map((option) => (
            <p className="flex items-center gap-2" key={option}>
              <input type="checkbox" className="w-4 h-4" value={option} /> {option}
            </p>
          ))}
        {type === 'select' && (
          <select className="w-full border border-gray-300 rounded-md">
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default FilterItem;
