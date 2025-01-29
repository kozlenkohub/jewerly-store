import React from 'react';
import { useSelector } from 'react-redux';
import Title from './Title';

const CartTotal = () => {
  const { totalPrice, delivery_fee } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.product);
  return (
    <div className="w-full ">
      <div className="text-2xl ">
        <Title text1={'Cart'} text2={'Total'} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm ">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency} {totalPrice}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency} {delivery_fee}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Total</p>
          <p>
            {currency} {totalPrice + delivery_fee}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
