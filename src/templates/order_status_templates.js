// templates/orderUpdateTemplate.js
export const orderUpdateTemplate = (name, orderId, status) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
        
        <h2 style="text-align:center; color:#333;">Faizan Store</h2>
        <hr />

        <p>Hi ${name},</p>

        <p>Your order has been updated successfully. Here are the latest details:</p>

        <div style="background:#f9f9f9; padding:15px; border-radius:6px;">
          <p><strong>Order ID:</strong> ${orderId}</p>


          ${
            status
              ? `<p><strong>Status:</strong> 
                  <span style="
                    color:${
                      status === "delivered"
                        ? "green"
                        : status === "cancelled"
                          ? "red"
                          : "orange"
                    };
                    font-weight:bold;
                  ">
                    ${status}
                  </span>
                </p>`
              : ""
          }
        </div>

        <p style="margin-top:20px;">
          If you did not request this change, please contact support immediately.
        </p>

        <hr />
        <p style="font-size:12px; color:#777; text-align:center;">
          © 2026 Faizan Store
        </p>

      </div>
    </div>
  `;
};
