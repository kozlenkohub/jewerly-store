import React from 'react';

const SelectSize = ({ sizes, activeSize, setActiveSize }) => {
  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap">
      {sizes.map((size, index) => (
        <button
          onClick={() => (activeSize === size ? setActiveSize(null) : setActiveSize(size))}
          key={index}
          className={`w-10 h-10 aspect-square border border-gray-300 rounded-md flex items-center justify-center ${
            activeSize === size ? 'bg-mainColor text-white' : ''
          }`}>
          {size}
        </button>
      ))}
    </div>
  );
};

export default SelectSize;
