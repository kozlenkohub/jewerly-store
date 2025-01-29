import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Title from '../components/Title';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '../redux/slices/cartSlice';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.product);

  const handleIncrement = (item) => {
    dispatch(
      updateQuantity({ product: item.product, size: item.size, quantity: item.quantity + 1 }),
    );
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(
        updateQuantity({ product: item.product, size: item.size, quantity: item.quantity - 1 }),
      );
    } else {
      dispatch(removeFromCart(item));
    }
  };

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      .replace(/\.00$/, '');
  };

  return (
    <div className="border-t pt-14 max-w-[1280px] mx-auto px-4">
      <div className="text-2xl mb-3 ">
        <Title text1={'Your'} text2={'Cart'} />
        <div className="futura">
          {cartItems.map((item, index) => {
            const discountedPrice = item.discount
              ? item.price - (item.price * item.discount) / 100
              : item.price;

            return (
              <div
                key={index}
                className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 ">
                <div className="flex items-start gap-6">
                  <div className="relative w-36 sm:w-20">
                    <img className="object-cover " src={item.image[0]} alt="" />
                    <div className="absolute bottom-0  left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 py-1 whitespace-nowrap text-[13px] ">
                      Size: {item.size}
                    </div>
                  </div>
                  <div className="">
                    <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                    <div className="flex items-center gap-5 mt-2">
                      {item.discount ? (
                        <>
                          <span className="line-through text-[11px] sm:text-[13px] text-gray-500 mr-2 tracking-[0px] sm:tracking-[1px]">
                            {formatPrice(item.price)} {currency}
                          </span>
                          <span className="tracking-[0.3px] futura-normal  sm:tracking-[1px] text-[16px] sm:text-[17px]">
                            {formatPrice(discountedPrice.toFixed(2))} {currency}
                          </span>
                        </>
                      ) : (
                        <span className="tracking-[0.3px] sm:tracking-[1px] text-[16px] sm:text-[17px]">
                          {formatPrice(item.price)} {currency}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaMinus
                    className="w-3 h-3 sm:w-5 text-gray-600 cursor-pointer"
                    onClick={() => handleDecrement(item)}
                  />
                  <span>{item.quantity}</span>
                  <FaPlus
                    className="w-3 h-3 sm:w-5 text-gray-600 cursor-pointer"
                    onClick={() => handleIncrement(item)}
                  />
                </div>
                <FaTrashAlt
                  className="w-4 h-4 sm:w-5 cursor-pointer hidden sm:block"
                  onClick={() => {
                    dispatch(removeFromCart(item));
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-end my-8">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-center futura">
              <button
                onClick={() => navigate('/checkout')}
                className="bg-mainColor text-white text-sm my-8 px-8 py-3">
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
