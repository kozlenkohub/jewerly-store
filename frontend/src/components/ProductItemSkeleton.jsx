import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductItemSkeleton = () => {
  return (
    <div className="product-item">
      <div className="image-container">
        <Skeleton height={170} />
      </div>
      <div className="text-container">
        <Skeleton count={3} />
      </div>
    </div>
  );
};

export default ProductItemSkeleton;
