import React, { useEffect, useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import Sparkle from 'react-sparkle';
import Title from '../components/Title';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import EmptyOrders from '../components/EmptyOrders';
import Loader from '../components/Loader';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoadingOrder, status } = useSelector((state) => state.order);
  const { currency } = useSelector((state) => state.product);
  const [openOrderIndex, setOpenOrderIndex] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const formatPrice = (price) => {
    if (price === undefined || price === null) return '';
    return price
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      .replace(/\.00$/, '');
  };

  const toggleOrder = (index) => {
    const previousOpenOrderIndex = openOrderIndex;
    setOpenOrderIndex(openOrderIndex === index ? null : index);
    if (previousOpenOrderIndex !== index) {
      setTimeout(() => {
        const orderElement = document.getElementById(`order-${index}`);
        if (orderElement) {
          orderElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    }
  };

  if (isLoadingOrder || status === 'loading') {
    return <Loader />;
  }

  if (status === 'failed' || !orders || orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="border-t pt-4 max-w-[1280px] mx-auto px-4 min-h-[95.5vh] mb-12">
      <div className="text-2xl text-right border-b">
        <Title text1={t('orders.title.text1')} text2={t('orders.title.text2')} />
      </div>
      <div className="mt-4">
        {orders &&
          orders.map((order, index) => (
            <div className="border-b-4" key={index} id={`order-${index}`}>
              <div
                className={`text-xl ${
                  index !== 0 ? 'mt-4' : ''
                } text-center font-bold mb-4 forum flex items-center justify-center cursor-pointer relative`}
                onClick={() => toggleOrder(index)}>
                <FaBoxOpen className="mr-2" />
                {order._id
                  ? `${t('orders.orderNumber')} ${order._id.slice(-4)}`
                  : t('orders.orderNumber')}
                <div className="flex items-center gap-2 ml-4 futura">
                  <div className="w-2 h-2 rounded-full bg-mainColor"></div>
                  <p className="text-mainColor text-xs sm:text-sm">{order.status}</p>
                </div>
                <Sparkle
                  overflowPx={2}
                  color="#320C30"
                  count={8}
                  fadeOutSpeed={3}
                  flicker={false}
                />
              </div>

              {openOrderIndex === index && (
                <div>
                  {order.orderItems &&
                    order.orderItems.map((item, itemIndex) => {
                      const discountedPrice = item.discount
                        ? item.price - (item.price * item.discount) / 100
                        : item.price;

                      return (
                        <div
                          key={itemIndex}
                          className="py-4 border-t text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_2fr_1fr] items-center gap-4 futura text-sm sm:text-base">
                          <div className="flex flex-col sm:flex-row items-start gap-4 ">
                            <div className="relative w-32 sm:w-20">
                              <img
                                className="object-cover w-full h-auto rounded"
                                src={item.image[0]}
                                alt=""
                              />
                              <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs px-1 py-1 truncate">
                                {t('orders.details.size')}: {item.size}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm sm:text-lg font-medium break-words">
                                {item.name}
                              </p>
                              <div className="flex items-center mt-2">
                                {item.discount ? (
                                  <>
                                    <span className="line-through text-xs sm:text-sm text-gray-500 mr-2">
                                      {formatPrice(item.price)} {currency}
                                    </span>
                                    <span className="text-mainColor text-sm sm:text-base">
                                      {formatPrice(discountedPrice.toFixed(2))} {currency}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-sm sm:text-base">
                                    {formatPrice(item.price)} {currency}
                                  </span>
                                )}
                              </div>
                              <p className="mt-2 text-gray-400">
                                {t('orders.details.date')}:{' '}
                                {new Date(order.dateOrdered).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span>
                              {t('orders.details.quantity')}: {item.quantity}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  <div className="mt-4 text-center futura text-xl py-4  font-medium">
                    {t('orders.details.totalPrice')}: {formatPrice(order.totalPrice)} {currency}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};

export default Orders;
