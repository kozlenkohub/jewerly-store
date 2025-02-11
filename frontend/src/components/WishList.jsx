import React from 'react';
import { Empty } from 'antd';
import { useTranslation } from 'react-i18next';

const WishList = () => {
  const { t } = useTranslation();

  return (
    <div className="p-4">
      <Empty description={t('wishlist.empty')} />
    </div>
  );
};

export default WishList;
