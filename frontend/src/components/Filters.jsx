import FilterItem from './FilterItem';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilters } from '../redux/slices/filterSlice';

const Filters = () => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter.filters);

  React.useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  return (
    <div>
      {filters.map((filter) => (
        <FilterItem
          key={filter._id}
          label={filter.label}
          type={filter.type}
          options={filter.options}
        />
      ))}
    </div>
  );
};

export default Filters;
