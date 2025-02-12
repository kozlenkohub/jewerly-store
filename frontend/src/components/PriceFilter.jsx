import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';

const PriceFilter = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);
  const { currency } = useSelector((state) => state.product);
  const [priceRange, setPriceRange] = useState([0, 1000000]);

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
    <div className="p-4 my-4 border border-gray-300">
      <p className="mb-3 text-sm font-medium">{t('priceFilter.title')}</p>
      <div className="flex flex-col gap-2 text-sm text-textColor">
        <Slider
          range
          min={0}
          max={1000000}
          value={priceRange}
          onChange={handlePriceChange}
          onChangeComplete={handleAfterChange}
          className="w-full"
          trackStyle={{ backgroundColor: 'gray' }}
          handleStyle={[
            { borderColor: '#621b59', backgroundColor: '#621b59', opacity: 1 },
            { borderColor: '#621b59', backgroundColor: '#621b59', opacity: 1 },
          ]}
          railStyle={{ backgroundColor: 'rgba(128, 128, 128, 0.3)' }}
        />
        <div className="flex justify-between text-xs">
          <span>
            {t('priceFilter.min')}: {currency}
            {priceRange[0]}
          </span>
          <span>
            {t('priceFilter.max')}: {currency}
            {priceRange[1]}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceFilter;
