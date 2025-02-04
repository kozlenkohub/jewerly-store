import orderModel from '../models/orderModel.js';

const initSchedulers = () => {
  // Проверка просроченных заказов каждую минуту
  setInterval(() => {
    orderModel.removeExpiredProcessingOrders();
  }, 60000);

  // // Очистка неактивных корзин (каждые 24 часа)
  // setInterval(() => {
  //   cartModel.removeInactiveCarts(48); // удаляем корзины неактивные более 48 часов
  // }, 24 * 60 * 60 * 1000);

  // // Обновление статусов доставки (каждый час)
  // setInterval(() => {
  //   orderModel.updateDeliveryStatuses();
  // }, 60 * 60 * 1000);

  // // Отправка напоминаний о брошенных корзинах (каждые 4 часа)
  // setInterval(() => {
  //   const abandonedCarts = cartModel.getAbandonedCarts(4); // корзины без активности 4 часа
  //   abandonedCarts.forEach(cart => {
  //     emailService.sendAbandonedCartReminder(cart.userEmail, cart.items);
  //   });
  // }, 4 * 60 * 60 * 1000);

  // // Архивация старых заказов (раз в неделю)
  // setInterval(() => {
  //   orderModel.archiveOldOrders(30); // архивируем заказы старше 30 дней
  // }, 7 * 24 * 60 * 60 * 1000);

  // Здесь можно добавлять другие scheduled tasks
};

export default initSchedulers;
