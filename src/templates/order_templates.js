// templates/orderTemplate.js
export const orderTemplate = (orderId, orderTotal) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.05);">

        <h2 style="text-align:center; color:#333; margin-bottom:10px;">Faizan Store</h2>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

        <p style="font-size:16px; color:#555; text-align:center;">Your order has been confirmed successfully! 🎉</p>

        <div style="background:#f9f9f9; padding:20px; border-radius:6px; margin:20px 0;">
          <p style="font-size:16px;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="font-size:16px;"><strong>Total Amount:</strong> $${orderTotal}</p>
        </div>

        <div style="text-align:center; margin:25px 0;">
          <a href="https://www.google.com" style="
            text-decoration:none;
            background-color:#4caf50;
            color:#ffffff;
            padding:12px 25px;
            border-radius:6px;
            font-weight:bold;
            display:inline-block;
          ">View Order</a>
        </div>

        <p style="font-size:14px; color:#999; text-align:center;">
          Thank you for shopping with Faizan Store! We appreciate your business.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

        <p style="font-size:12px; color:#777; text-align:center;">
          © 2026 Faizan Store. All rights reserved.
        </p>

      </div>
    </div>
  `;
};
