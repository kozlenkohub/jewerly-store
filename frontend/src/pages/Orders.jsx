import React, { useEffect } from 'react';
import Title from '../components/Title';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders } from '../redux/slices/orderSlice';
import EmptyOrders from '../components/EmptyOrders';
import { DotLoader } from 'react-spinners';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, isLoadingOrder } = useSelector((state) => state.order);
  const { currency } = useSelector((state) => state.product);

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

  if (orders == null) {
    return (
      <div className="min-h-[100vh] relative">
        {' '}
        <div className="flex justify-center items-center absolute top-1/3 left-1/2">
          <DotLoader size={50} color={'#1F3A63'} loading={isLoadingOrder} speedMultiplier={0.5} />
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="border-t pt-4 max-w-[1280px] mx-auto px-4">
      <div className="text-2xl">
        <Title text1="Your" text2="Orders" />
      </div>
      <div>
        {orders.map((order, index) => (
          <div key={index}>
            {order.orderItems &&
              order.orderItems.map((item, itemIndex) => {
                const discountedPrice = item.discount
                  ? item.price - (item.price * item.discount) / 100
                  : item.price;

                return (
                  <div
                    key={itemIndex}
                    className="py-4 border-t border-b text-gray-700 grid grid-cols-1 sm:grid-cols-[4fr_2fr_1fr] items-center gap-4 futura text-sm sm:text-base">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="relative w-32 sm:w-20">
                        <img
                          className="object-cover w-full h-auto rounded"
                          src={item.image[0]}
                          alt=""
                        />
                        <div className="absolute bottom-0 w-full text-center bg-black bg-opacity-50 text-white text-xs px-1 py-1 truncate">
                          Size: {item.size}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm sm:text-lg font-medium break-words">{item.name}</p>
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
                          Date: {new Date(order.dateOrdered).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span>Quantity: {item.quantity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-mainColor"></div>
                      <p className="text-mainColor text-xs sm:text-sm">{order.status}</p>
                    </div>
                    <button className="border bg-mainColor text-white px-3 py-2 text-xs sm:text-sm font-medium rounded">
                      Track Order
                    </button>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
