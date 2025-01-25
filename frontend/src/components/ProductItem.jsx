import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProductItem = ({ _id = 0, image = '', name, price, discount, bestseller }) => {
  const { currency } = useSelector((state) => state.product);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <Link className="px-4 cursor-pointer text-gray-700" to={`/product/${_id}`}>
      <div className="relative overflow-hidden flex justify-center items-center">
        {bestseller && (
          <div className="absolute top-0 right-0 bg-slate-500/40 text-white text-xs px-2 py-1 z-10">
            Bestseller
          </div>
        )}
        <img className="hover:scale-110 transition ease-in-out w-32" src={image[0]} alt="" />
      </div>
      <div className="pt-3 pb-1 text-[14px] leading-4 font-light text-[#170d0f] h-20 sm:text-[14px] futura mb-2 tracking-[1px]">
        <p>{name}</p>
      </div>
      <p className="font-medium text-textColor futura-normal sm:text-[14px] text-[14px] tracking-[1px]">
        {discount ? (
          <>
            <span className="line-through text-[13px]  text-gray-500 mr-2 tracking-[1px]">
              {currency} {price}
            </span>
            <span className="">
              {currency} {discountedPrice.toFixed(2)}
            </span>
          </>
        ) : (
          `${currency} ${price}`
        )}
      </p>
    </Link>
  );
};

export default ProductItem;
