import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleFilterOption } from '../redux/slices/filterSlice';
import { useNavigate } from 'react-router-dom';
import qs from 'qs';

const FilterItem = React.memo(({ filterKey, label, type, options }) => {
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
    <div className="border border-gray-300 pl-5 py-3 my-5 sm:block">
      <p className="mb-3 text-sm font-medium">{label}</p>
      <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
        {/* main type */}
        {type === 'checkbox' &&
          options.map((option) => (
            <div
              className="flex items-center gap-2 cursor-pointer"
              key={option.type}
              onClick={() => handleOptionClick(option)}>
              {option.img && (
                <img
                  src={option.img}
                  alt={option.type}
                  className={`w-6 h-6 object-contain ${
                    selectedFilters[filterKey]?.includes(option.type)
                      ? 'border-[1px] border-mainColor'
                      : ''
                  }`}
                />
              )}
              {option.type}
            </div>
          ))}
      </div>
    </div>
  );
});

FilterItem.displayName = 'FilterItem';

export default FilterItem;
