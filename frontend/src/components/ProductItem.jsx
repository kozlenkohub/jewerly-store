import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/shopContext';

const ProductItem = ({ _id, image, name, price, discount, bestseller }) => {
  const { currency } = useContext(ShopContext);
  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  return (
    <Link className="cursor-pointer text-gray-700 " to={`/product/${_id}`}>
      <div className="relative overflow-hidden">
        {bestseller && (
          <div className="absolute top-0 right-0 bg-slate-500/40 text-white text-xs px-2 py-1 z-10">
            Bestseller
          </div>
        )}
        <img className="hover:scale-110 transition ease-in-out" src={image[0]} alt="" />
      </div>
      <div className="pt-3 pb-1 text-[14px] leading-4 font-light text-[#170d0f] poppins h-20 sm:text-[12px]">
        <p>{name}</p>
      </div>
      <p className="text-lg font-medium text-[#6e162d]">
        {discount ? (
          <>
            <span className="line-through text-[13px] text-gray-500 mr-2">
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
