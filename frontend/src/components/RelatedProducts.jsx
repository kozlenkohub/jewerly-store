import React, { useState, useEffect } from 'react';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';

const RelatedProducts = ({ related }) => {
  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={'Related'} text2={'Products'} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 text-center">
        {related && related.map((product, index) => <ProductItem key={index} {...product} />)}
      </div>
    </div>
  );
};

export default RelatedProducts;
