import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import Title from './Title';

const CartTotal = () => {
  const { t } = useTranslation();
  const { totalPrice, shippingFee } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.product);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={t('cartTotal.title.text1')} text2={t('cartTotal.title.text2')} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm futura">
        <div className="flex justify-between">
          <p>{t('cartTotal.subtotal')}</p>
          <p>
            {currency} {totalPrice.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>{t('cartTotal.shippingFee')}</p>
          <p>
            {currency} {shippingFee.toFixed(2)}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>{t('cartTotal.total')}</p>
          <p>
            {currency} {(totalPrice + shippingFee).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
