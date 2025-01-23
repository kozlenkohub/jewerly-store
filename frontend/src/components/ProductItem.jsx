import React, { useContext } from 'react';
import { ShopContext } from '../context/shopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ _id, image, name, price }) => {
  const { currency } = useContext(ShopContext);
  return (
    <Link className="cursor-pointer text-gray-700 " to={`/product/${_id}`}>
      <div className="overflow-hidden">
        <img className="hover:scale-110 transition ease-in-out" src={image[0]} alt="" />
      </div>
      <div className="pt-3 pb-1 text-[14px] leading-4 font-light text-[#170d0f] poppins h-16">
        <p>{name}</p>
      </div>
      <p className="text-sm font-medium text-[#6e162d]">
        {currency} {price}
      </p>
    </Link>
  );
};

export default ProductItem;
