// templates/passwordChangedTemplate.js
export const passwordChangedTemplate = (name) => {
  return `
    <div style="font-family: Arial, sans-serif; background:#f4f4f4; padding:20px;">
      <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">

        <h2 style="text-align:center; color:#333;">Faizan Store</h2>
        <hr />

        <p>Hi ${name},</p>

        <p>This is a confirmation that your account password has been successfully changed.</p>

        <div style="background:#f9f9f9; padding:15px; border-radius:6px; margin-top:10px;">
          <p><strong>Important:</strong> If you did not make this change, please reset your password immediately and contact our support team.</p>
        </div>

        <p style="margin-top:20px;">Thank you for keeping your account secure.</p>

        <hr />
        <p style="font-size:12px; color:#777; text-align:center;">
          © 2026 Faizan Store
        </p>

      </div>
    </div>
  `;
};
