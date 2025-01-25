import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const PriceFilter = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);
  const [priceRange, setPriceRange] = useState([0, 1000]);

  useEffect(() => {
    if (typeof selectedFilters.price === 'string') {
      const [min, max] = selectedFilters.price.split('-').map(Number);
      setPriceRange([min, max]);
    }
  }, [selectedFilters.price]);

  const handlePriceChange = (range) => {
    setPriceRange(range);
  };

  const handleAfterChange = (range) => {
    const newSelectedFilters = { ...selectedFilters, price: `${range[0]}-${range[1]}` };
    const queryString = qs.stringify(newSelectedFilters, { arrayFormat: 'repeat' });
    navigate(`?${queryString}`);
  };

  return (
    <div className="p-4 my-4 border rounded-md">
      <p className="mb-3 text-sm font-medium">Price</p>
      <div className="flex flex-col gap-2 text-sm text-textColor">
        <Slider
          range
          min={0}
          max={1000}
          value={priceRange}
          onChange={handlePriceChange}
          onAfterChange={handleAfterChange}
          className="w-full"
          trackStyle={{ backgroundColor: 'gray' }}
          handleStyle={[
            { borderColor: '#8c2d60', backgroundColor: '#8c2d60' },
            { borderColor: '#8c2d60', backgroundColor: '#8c2d60' },
          ]}
          railStyle={{ backgroundColor: 'rgba(128, 128, 128, 0.3)' }}
        />
        <div className="flex justify-between text-xs">
          <span>Min: ₴{priceRange[0]}</span>
          <span>Max: ₴{priceRange[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
