export const getStatusKeyboard = (orderId) => {
  const statuses = ['Order Placed', 'Processing', 'Shipped', 'Delivered'];

  const keyboard = statuses.map((status) => [
    {
      text: status,
      callback_data: `status_${orderId}_${status}`,
    },
  ]);

  keyboard.push([
    {
      text: '🔙 Назад',
      callback_data: `order_${orderId}`,
    },
  ]);

  return keyboard;
};
