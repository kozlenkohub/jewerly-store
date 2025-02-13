import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const FilterItemSkeleton = () => {
  return (
    <div className="filter-item flex gap-8 flex-col">
      <Skeleton height={20} count={2} />
      <Skeleton height={20} count={2} />
    </div>
  );
};

export default FilterItemSkeleton;
