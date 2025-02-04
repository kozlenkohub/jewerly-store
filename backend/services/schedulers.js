import orderModel from '../models/orderModel.js';

const initSchedulers = () => {
  // Проверка просроченных заказов каждую минуту
  setInterval(() => {
    orderModel.removeExpiredProcessingOrders();
  }, 60000);

  // Здесь можно добавлять другие scheduled tasks
};

export default initSchedulers;
