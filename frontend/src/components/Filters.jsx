import FilterItem from './FilterItem';
import React from 'react';
import { useSelector } from 'react-redux';
import useQueryFilters from '../hooks/useQueryFilters';

const Filters = React.memo(() => {
  const filters = useSelector((state) => state.filter.filters);

  useQueryFilters();

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
