import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheckCircle, FaTruck, FaUndo } from 'react-icons/fa';

const ProductDetails = () => {
  const { t } = useTranslation();

  const productDetails = [
    { icon: FaCheckCircle, translationKey: 'original' },
    { icon: FaTruck, translationKey: 'cashOnDelivery' },
    { icon: FaUndo, translationKey: 'returnPolicy' },
  ];

  return (
    <>
      {productDetails.map(({ icon: Icon, translationKey }, index) => (
        <p key={index} className="flex items-center gap-2">
          <Icon className="inline" />
          {t(`productDetails.${translationKey}`)}
        </p>
      ))}
    </>
  );
};

export default ProductDetails;
