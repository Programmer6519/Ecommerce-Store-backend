// templates/otpTemplate.js
export const otpTemplate = (otp) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:30px; border-radius:8px; box-shadow:0 0 10px rgba(0,0,0,0.05);">

        <h2 style="text-align:center; color:#333; margin-bottom:10px;">Faizan Store</h2>
        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

        <p style="font-size:16px; color:#555; text-align:center;">Your One-Time Password (OTP) for verification is:</p>

        <div style="text-align:center; margin:25px 0;">
          <span style="
            display:inline-block;
            font-size:28px;
            font-weight:bold;
            padding:15px 30px;
            color:#ffffff;
            background-color:#4caf50;
            border-radius:6px;
            letter-spacing:2px;
          ">
            ${otp}
          </span>
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
          ">Verify Now</a>
        </div>

        <p style="font-size:14px; color:#999; text-align:center;">
          This OTP will expire in <strong>5 minutes</strong>. Please do not share it with anyone.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;">

        <p style="font-size:12px; color:#777; text-align:center;">
          © 2026 Faizan Store. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
