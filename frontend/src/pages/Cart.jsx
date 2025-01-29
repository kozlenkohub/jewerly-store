import React from 'react';
import { useSelector } from 'react-redux';
import Title from '../components/Title';

const Cart = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.product);
  console.log(cartItems);

  return (
    <div className="border-t pt-14 max-w-[1280px] mx-auto px-4">
      <div className="text-2xl mb-3 futura">
        <Title text1={'Your'} text2={'Cart'} />
        <div className="">
          {cartItems.map((item, index) => {
            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 ">
                <div className="flex items-start gap-6">
                  <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
                  <div className="">
                    <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      <p>
                        {currency}
                        {item.price}
                      </p>
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50">{item.size}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Cart;
