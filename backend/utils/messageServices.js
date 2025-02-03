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
  return `
  <div style="font-family:Helvetica,Arial,sans-serif; padding:40px; background:#f9f9f9;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:8px; overflow:hidden; text-align:center;">
      <div style="background:#b79259; padding:20px;">
        <h1 style="color:white; margin:0;">Luxury Jewelry Store</h1>
      </div>
      <div style="padding:30px;">
        <h2 style="margin-bottom:10px;">Order Confirmation</h2>
        <p style="margin-bottom:20px;">
          Thank you for your order! We're processing it right now.
        </p>
        <div style="margin-bottom:20px; text-align:left;">
          <h3 style="color:#b79259;">Order Details:</h3>
          <p>Order Total: $${orderDetails.totalPrice}</p>
          <p>Payment Method: ${orderDetails.paymentMethod}</p>
          <h4 style="color:#b79259;">Shipping Address:</h4>
          <p>${orderDetails.shippingFields.street}</p>
          <p>${orderDetails.shippingFields.apartament}</p>
          <p>${orderDetails.shippingFields.city}, ${orderDetails.shippingFields.country} ${orderDetails.shippingFields.zipCode}</p>
        </div>
        <p style="font-size:14px; color:#777;">
          If you have any questions about your order, please contact us at 
          <a href="mailto:support@luxuryjewelry.com" style="color:#b79259;">support@luxuryjewelry.com</a>
        </p>
      </div>
    </div>
  </div>
  `;
}
