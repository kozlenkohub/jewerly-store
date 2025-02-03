export function createResetPasswordMessage(resetUrl) {
  return `
  <div style="font-family:Helvetica,Arial,sans-serif; padding:40px; background:#f9f9f9;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; text-align:center;">
      <div style="background:#b79259; padding:20px;">
        <h1 style="color:white; margin:0;">Luxury Jewelry Store</h1>
      </div>
      <div style="padding:30px;">
        <h2 style="margin-bottom:10px;">Reset Password</h2>
        <p style="margin-bottom:20px;">
          To reset your password, please click the button below:
        </p>
        <a 
          href="${resetUrl}" 
          style="display:inline-block; padding:15px 30px; background:#b79259; color:white; 
          text-decoration:none; border-radius:5px; margin-bottom:20px;">
          Reset Now
        </a>
        <p style="font-size:14px; color:#777;">If the button doesn’t work, copy and paste this link in your browser:</p>
        <a href="${resetUrl}" style="color:#b79259; word-wrap:break-word;">${resetUrl}</a>
      </div>
    </div>
  </div>
  `;
}

export function createWelcomeMessage() {
  return `
  <div style="font-family:Helvetica,Arial,sans-serif; padding:40px; background:#f9f9f9;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; text-align:center;">
      <div style="background:#b79259; padding:20px;">
        <h1 style="color:white; margin:0;">Luxury Jewelry Store</h1>
      </div>
      <div style="padding:30px;">
        <h2 style="margin-bottom:10px;">Welcome to Luxury Jewelry Store</h2>
        <p style="margin-bottom:20px;">
          Thank you for creating an account with us. We are thrilled to have you on board.
        </p>
        <p style="margin-bottom:20px;">
          You can now enjoy shopping for our exclusive collection of fine jewelry pieces. 
        </p>
        <p style="margin-bottom:20px;">
          If you have any questions, feel free to contact us at
          <a href="mailto:support@luxuryjewelry.com" style="color:#b79259;">support@luxuryjewelry.com</a>
        </p>
        <a 
          href="https://luxuryjewelry.com/catalog" 
          style="display:inline-block; padding:15px 30px; background:#b79259; color:white; 
          text-decoration:none; border-radius:5px;">
          Start Shopping
        </a>
      </div>
    </div>
  </div>
  `;
}

export function createOrderMessage(orderDetails) {
  const orderDate = new Date(orderDetails.dateOrdered).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const formatPrice = (price) =>
    price.toLocaleString('en-US', { style: 'currency', currency: 'UAH' });

  const orderItemsHtml = orderDetails.orderItems
    .map(
      (item) => `
    <div style="border-bottom:1px solid #eee; padding:10px 0; margin-bottom:10px;">
      <div class="responsive-items" style="display:flex; align-items:start; flex-wrap:wrap;">
        <img src="${item.image[0].split('#')[0]}" alt="${
        item.name
      }" style="width:100%; max-width:100px; height:auto; object-fit:cover; margin-right:15px;">
        <div style="flex:1; min-width:200px;">
          <h4 style="margin:0 0 5px; color:#333;">${item.name}</h4>
          <p style="margin:0 0 5px; color:#666;">Quantity: ${item.quantity}</p>
          ${item.metal ? `<p style="margin:0 0 5px; color:#666;">Metal: ${item.metal}</p>` : ''}
          ${item.weight ? `<p style="margin:0 0 5px; color:#666;">Weight: ${item.weight}g</p>` : ''}
          ${item.carats ? `<p style="margin:0 0 5px; color:#666;">Carats: ${item.carats}</p>` : ''}
          <p style="margin:0; color:#b79259;">Price: ${formatPrice(item.price)} × ${
        item.quantity
      }</p>
        </div>
      </div>
    </div>
  `,
    )
    .join('');

  return `
  <style>
    @media only screen and (max-width: 600px) {
      .responsive-items {
        display: block !important;
      }
      .responsive-items img {
        margin: 0 auto 15px !important;
        max-width: 100% !important;
      }
    }
  </style>
  <div style="font-family:Helvetica,Arial,sans-serif; padding:40px; background:#f9f9f9;">
    <div style="width:100%; max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden;">
      <div style="background:#b79259; padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">Luxury Jewelry Store</h1>
      </div>
      <div style="padding:30px;">
        <h2 style="margin-bottom:20px; text-align:center;">Order Confirmation</h2>
        <p style="margin-bottom:20px; text-align:center;">
          Thank you for your order! Your order has been ${orderDetails.status.toLowerCase()}.
        </p>
        
        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin-bottom:20px;">
          <h3 style="color:#b79259; margin-top:0;">Order Information</h3>
          <p>Order Date: ${orderDate}</p>
          <p>Order Status: ${orderDetails.status}</p>
          <p>Payment Method: ${orderDetails.paymentMethod}</p>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:#b79259;">Customer Details</h3>
          <p>${orderDetails.shippingFields.firstName} ${orderDetails.shippingFields.lastName}</p>
          <p>Email: ${orderDetails.shippingFields.email}</p>
          <p>Phone: ${orderDetails.shippingFields.phone}</p>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:#b79259;">Shipping Address</h3>
          <p>${orderDetails.shippingFields.street}, Apt ${
    orderDetails.shippingFields.apartament
  }</p>
          <p>${orderDetails.shippingFields.city}, ${orderDetails.shippingFields.country} ${
    orderDetails.shippingFields.zipCode
  }</p>
        </div>

        <div style="margin-bottom:20px;">
          <h3 style="color:#b79259;">Order Items</h3>
          ${orderItemsHtml}
        </div>

        <div style="background:#f5f5f5; padding:15px; border-radius:5px; margin-top:20px;">
          <h3 style="color:#b79259; margin-top:0;">Order Summary</h3>
          <p style="font-weight:bold; color:#b79259; font-size:18px;">Total: ${formatPrice(
            orderDetails.totalPrice,
          )}</p>
        </div>

        <p style="font-size:14px; color:#777; margin-top:30px; text-align:center;">
          If you have any questions about your order, please contact us at 
          <a href="mailto:support@luxuryjewelry.com" style="color:#b79259;">support@luxuryjewelry.com</a>
        </p>
      </div>
    </div>
  </div>
  `;
}
