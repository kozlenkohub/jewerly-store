import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterOption } from '../redux/slices/filterSlice';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

const FilterItem = React.memo(({ filterKey, label, type, options }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selectedFilters = useSelector((state) => state.filter.selectedFilters);

  const handleCheckboxChange = useCallback(
    (option) => {
      const newSelectedFilters = { ...selectedFilters };
      const currentFilter = newSelectedFilters[filterKey] || [];

      if (currentFilter.includes(option)) {
        newSelectedFilters[filterKey] = currentFilter.filter((item) => item !== option);
      } else {
        newSelectedFilters[filterKey] = [...currentFilter, option];
      }

      dispatch(toggleFilterOption({ key: filterKey, option }));

      const queryString = qs.stringify(newSelectedFilters, { arrayFormat: 'repeat' });
      navigate(`?${queryString}`);
    },
    [dispatch, filterKey, selectedFilters, navigate],
  );

  return (
    <div className="border border-gray-300 pl-5 py-3 my-5 sm:block">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {type === 'checkbox' &&
          options.map((option) => (
            <p className="flex items-center gap-2" key={option}>
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedFilters[filterKey]?.includes(option) || false}
                onChange={() => handleCheckboxChange(option)}
              />
              {option}
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
});

FilterItem.displayName = 'FilterItem';

export default FilterItem;
