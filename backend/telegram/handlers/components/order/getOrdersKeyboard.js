import Order from '../../../../models/orderModel.js';

const ORDERS_PER_PAGE = 5;

export const getOrdersKeyboard = async (page = 1) => {
  const skip = (page - 1) * ORDERS_PER_PAGE;
  const orders = await Order.find().sort({ dateOrdered: -1 }).skip(skip).limit(ORDERS_PER_PAGE);

  const totalOrders = await Order.countDocuments();
  const totalPages = Math.ceil(totalOrders / ORDERS_PER_PAGE);

  const keyboard = [];

  orders.forEach((order) => {
    keyboard.push([
      {
        text: `Заказ #${order._id}`,
        callback_data: `order_${order._id}`,
      },
    ]);
  });

  const navRow = [];
  if (page > 1) {
    navRow.push({
      text: '⬅️ Назад',
      callback_data: `page_${page - 1}`,
    });
  }
  navRow.push({
    text: `${page} из ${totalPages}`,
    callback_data: 'current_page',
  });
  if (page < totalPages) {
    navRow.push({
      text: 'Вперед ➡️',
      callback_data: `page_${page + 1}`,
    });
  }
  if (navRow.length > 0) {
    keyboard.push(navRow);
  }

  return {
    keyboard,
    totalOrders,
    currentPage: page,
    totalPages,
  };
};
