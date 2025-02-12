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
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-medium mb-6">{t('wishlist.title')}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {wishlistItems.map((product) => (
          <ProductItem key={product._id} {...product} />
        ))}
      </div>
    </div>
  );
};

export default WishList;
