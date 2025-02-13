import FilterItem from './FilterItem';
import React from 'react';
import { useSelector } from 'react-redux';
import FilterItemSkeleton from './FilterItemSkeleton';

const Filters = React.memo(() => {
  const { filters, isLoading } = useSelector((state) => state.filter);

  return (
    <div>
      {isLoading
        ? Array(3)
            .fill(0)
            .map((_, index) => <FilterItemSkeleton key={index} />)
        : filters.map((filter) => (
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
