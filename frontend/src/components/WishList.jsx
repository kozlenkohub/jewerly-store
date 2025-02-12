import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import ProductItem from './ProductItem';
import { useWishlist } from '../hooks/useWishlist';

const WishList = () => {
  const { t } = useTranslation();
  const { wishlistItems } = useWishlist();

  if (wishlistItems.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Empty description={t('wishlist.empty')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 futura max-w-[1280px]">
      <h2 className="text-xl sm:text-2xl font-medium mb-4 sm:mb-6">{t('wishlist.title')}</h2>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 gap-y-4 sm:gap-y-6 mt-4 sm:mt-6 min-h-[44vh] w-full sm:w-auto max-w-[1000px] mx-auto ${
          wishlistItems.length === 0 ? 'px-2 sm:px-4' : ''
        }`}>
        {wishlistItems.map((item, index) => (
          <ProductItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
};

export default WishList;
