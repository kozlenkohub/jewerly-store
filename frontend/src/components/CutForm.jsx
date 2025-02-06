import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterOption } from '../redux/slices/filterSlice';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

const CutForm = ({ filterKey, label, options }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);

  const handleOptionClick = useCallback(
    (option) => {
      const newSelectedFilters = { ...selectedFilters };
      const currentFilter = newSelectedFilters[filterKey] || [];

      if (currentFilter.includes(option.type)) {
        newSelectedFilters[filterKey] = currentFilter.filter((item) => item !== option.type);
      } else {
        newSelectedFilters[filterKey] = [...currentFilter, option.type];
      }

      dispatch(toggleFilterOption({ key: filterKey, option: option.type }));

      const queryString = qs.stringify(newSelectedFilters, { arrayFormat: 'repeat' });
      navigate(`?${queryString}`);
    },
    [dispatch, filterKey, selectedFilters, navigate],
  );

  return (
    <div className="border border-gray-300 py-3 my-5 sm:block">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="grid grid-cols-2 gap-4 text-sm font-light text-gray-700">
        {options.map((option) => (
          <div
            className="flex flex-col items-center cursor-pointer"
            key={option.type}
            onClick={() => handleOptionClick(option)}>
            {option.img && (
              <img
                src={option.img}
                alt={option.type}
                className={`w-10 h-10 object-contain mb-2 ${
                  selectedFilters[filterKey]?.includes(option.type)
                    ? 'border-[1px] border-mainColor'
                    : ''
                }`}
              />
            )}
            <span>{option.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CutForm;
