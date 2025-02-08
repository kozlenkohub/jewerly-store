export const formatOrderDetails = (order) => {
  const items = order.orderItems
    .map((item) => `- ${item.name.ru || item.name.en} (${item.quantity} шт.)`)
    .join('\n');

  const paymentMethodText =
    {
      cash: 'Наличные',
      stripe: 'Stripe',
      liqpay: 'LiqPay',
    }[order.paymentMethod] || order.paymentMethod;

  return `
📦 Заказ #${order._id}
📅 Дата: ${new Date(order.dateOrdered).toLocaleString()}
👤 Покупатель: ${order.shippingFields.firstName} ${order.shippingFields.lastName}
📱 Телефон: ${order.shippingFields.phone}
📧 Email: ${order.email}
🏠 Адрес: ${order.shippingFields.country}, ${order.shippingFields.city}, ${
    order.shippingFields.street
  }
💰 Сумма: ${order.totalPrice}₴
💳 Оплата: ${paymentMethodText}
🚚 Статус: ${order.status}

Товары:
${items}`;
};
