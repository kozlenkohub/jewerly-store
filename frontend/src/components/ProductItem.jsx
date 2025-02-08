import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { localizeField } from '../utils/localizeField';

const ProductItem = ({ _id = 0, image, name, price, discount, bestseller }) => {
  const { currency } = useSelector((state) => state.product);
  const { t } = useTranslation();
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      .replace(/\.00$/, '');
  };

  return (
    <Link className="px-2 sm:px-4 cursor-pointer text-gray-700" to={`/product/${_id}`}>
      <div className="relative overflow-hidden flex justify-center items-center">
        {bestseller && (
          <div className="absolute top-0 right-0 bg-slate-500/40 text-white text-xs px-2 py-1 z-10">
            {t('product.bestseller')}
          </div>
        )}
        <img
          className="hover:scale-110 transition ease-in-out w-32"
          src={image[0]}
          alt={localizeField(name)}
        />
      </div>
      <div className="pt-3 pb-1 text-[11px] leading-4 font-light text-[#170d0f] h-20 sm:text-[12px] futura mb-2 tracking-[1px]">
        <p>{localizeField(name)}</p>
      </div>
      <p className=" sm:mt-3 leading-[30px] text-textColor futura-normal sm:text-[18px] text-[17px] tracking-[1px]">
        {discount ? (
          <>
            <span className="line-through futura text-[11px] sm:text-[13px] text-gray-500 mr-2 tracking-[0px] sm:tracking-[1px]">
              {formatPrice(price)} {currency}
            </span>
            <span className="tracking-[0.3px] font-medium sm:tracking-[1px] text-[16px] sm:text-[17px]  ">
              {formatPrice(discountedPrice.toFixed(2))} {currency}
            </span>
          </>
        ) : (
          `${formatPrice(price)} ${currency}`
        )}
      </p>
    </Link>
  );
};

export default ProductItem;
