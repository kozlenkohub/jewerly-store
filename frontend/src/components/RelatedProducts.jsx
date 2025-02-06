import React from 'react';
import { useTranslation } from 'react-i18next';
import Title from './Title';
import ProductItem from './ProductItem';

const RelatedProducts = ({ related }) => {
  const { t } = useTranslation();

  return (
    <div className="mt-8">
      <div className="text-center text-3xl py-2">
        <Title text1={t('relatedProducts.title.text1')} text2={t('relatedProducts.title.text2')} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 text-center">
        {related && related.map((product, index) => <ProductItem key={index} {...product} />)}
      </div>
    </div>
  );
};

export default RelatedProducts;
