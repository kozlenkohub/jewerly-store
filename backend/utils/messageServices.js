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
