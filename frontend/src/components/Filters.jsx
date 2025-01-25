import FilterItem from './FilterItem';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchFilters } from '../redux/slices/filterSlice';
import useQueryFilters from '../hooks/useQueryFilters';

const Filters = React.memo(() => {
  const dispatch = useDispatch();
  const filters = useSelector((state) => state.filter.filters);

  useQueryFilters();

  React.useEffect(() => {
    dispatch(fetchFilters());
  }, [dispatch]);

  return (
    <div>
      {filters.map((filter) => (
        <FilterItem
          key={filter._id}
          filterKey={filter.key}
          label={filter.label}
          type={filter.type}
          options={filter.options}
        />
      ))}
    </div>
  );
});

Filters.displayName = 'Filters';

export default Filters;
