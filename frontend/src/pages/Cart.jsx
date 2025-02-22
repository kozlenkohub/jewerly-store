import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Title from '../components/Title';
import { FaTrashAlt, FaPlus, FaMinus } from 'react-icons/fa';
import { removeFromCart, updateQuantity, fetchCartItems } from '../redux/slices/cartSlice';
import CartTotal from '../components/CartTotal';
import { useNavigate } from 'react-router-dom';
import EmptyCart from '../components/EmptyCart';
import Loader from '../components/Loader';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { cartItems, isLoadingCart } = useSelector((state) => state.cart);
  const { currency } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  const handleIncrement = (item) => {
    dispatch(updateQuantity({ itemId: item._id, size: item.size, quantity: item.quantity + 1 }));
  };

  const handleDecrement = (item) => {
    if (item.quantity > 1) {
      dispatch(updateQuantity({ itemId: item._id, size: item.size, quantity: item.quantity - 1 }));
    } else {
      dispatch(removeFromCart({ itemId: item._id, size: item.size }));
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
    <div className="border-t pt-5 max-w-[1280px] mx-auto px-4 min-h-[95.5vh] relative flex flex-col justify-between">
      <div className="text-2xl mb-3">
        {isLoadingCart ? (
          <Loader />
        ) : cartItems.length === 0 ? (
          <EmptyCart />
        ) : (
          <>
            <Title text1={t('cart.title.text1')} text2={t('cart.title.text2')} />
            {cartItems.map((item, index) => {
              const discountedPrice = item.discount
                ? item.price - (item.price * item.discount) / 100
                : item.price;

              return (
                <div
                  key={index}
                  className="py-4 border-t border-b futura text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4 ">
                  <div className="flex items-start gap-6 ">
                    <div className="relative w-40 sm:w-40">
                      <img className="object-cover  " src={item.image[0]} alt="" />
                      <div className="absolute bottom-0 min-w-[57px] text-center  left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white text-xs px-1 py-1 whitespace-nowrap text-[13px] ">
                        <p>
                          {t('cart.size')}: {item.size}
                        </p>
                      </div>
                    </div>
                    <div className="">
                      <p className="text-sm sm:text-lg font-medium">{item.name}</p>
                      <div className="flex items-center mt-2 min-w-[120px]">
                        {item.discount ? (
                          <div className="flex items-center gap-2">
                            <span className="line-through text-[11px] sm:text-[13px] text-gray-500 tracking-[0px] sm:tracking-[1px] whitespace-nowrap">
                              {formatPrice(item.price)}&nbsp;{currency}
                            </span>
                            <span className="tracking-[0.3px] futura sm:tracking-[1px] text-[16px] sm:text-[17px] whitespace-nowrap">
                              {formatPrice(discountedPrice.toFixed(2))}&nbsp;{currency}
                            </span>
                          </div>
                        ) : (
                          <span className="tracking-[0.3px] sm:tracking-[1px] text-[16px] sm:text-[17px] whitespace-nowrap">
                            {formatPrice(item.price)}&nbsp;{currency}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="flex items-center gap-3 ">
                      <FaMinus
                        className="w-3 h-3 sm:w-5 text-gray-600 cursor-pointer"
                        onClick={() => handleDecrement(item)}
                      />
                      <span>{item.quantity}</span>
                      <FaPlus
                        className="w-3 h-3 sm:w-5 mr-3 sm:mr-0 text-gray-600 cursor-pointer"
                        onClick={() => handleIncrement(item)}
                      />
                      <FaTrashAlt
                        className="w-4 h-4 text-red-800 cursor-pointer block sm:hidden"
                        onClick={() => {
                          dispatch(removeFromCart({ itemId: item._id, size: item.size }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-red-800">
                    <FaTrashAlt
                      className="w-4 h-4 sm:w-5 cursor-pointer hidden sm:block "
                      onClick={() => {
                        dispatch(removeFromCart({ itemId: item._id, size: item.size }));
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
      {isLoadingCart || cartItems.length === 0 ? (
        ''
      ) : (
        <div className="flex justify-end ">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-center ">
              <button
                onClick={() => navigate('/checkout')}
                className="bg-mainColor text-white text-sm my-8 px-8 py-3">
                {t('cart.checkout')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
