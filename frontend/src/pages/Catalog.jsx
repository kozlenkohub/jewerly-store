import React from 'react';
import { useSelector } from 'react-redux';

const Catalog = () => {
  const { products } = useSelector((state) => state.product);
  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      MainMainMainMainMain MainMainMainMainMainMainMainMainMainMain
    </div>
  );
};

export default Catalog;
