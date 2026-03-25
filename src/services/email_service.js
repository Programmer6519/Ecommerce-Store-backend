import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { otpTemplate } from "../templates/otp_templates.js";
import { orderTemplate } from "../templates/order_templates.js";
import { orderUpdateTemplate } from "../templates/order_status_templates.js";
import { passwordChangedTemplate } from "../templates/password_changed_templates.js";

dotenv.config({ path: "./.env" });
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const emailService = {
  sendOtp: async (recipientEmail, otp) => {
    const info = await transporter.sendMail({
      from: `Faizan Store ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Your otp is here!!",
      html: otpTemplate(otp),
    });

    console.log("Message sent: ", info.messageId);
  },
  orderConfirmed: async (recipientEmail, orderId, orderTotal) => {
    const info = await transporter.sendMail({
      from: `Faizan Store ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Your order is confirmed!",
      html: orderTemplate(orderId, orderTotal),
    });

    console.log("Message sent: ", info.messageId);
  },
  orderChanged: async (recipientEmail, name, orderId, status) => {
    const info = await transporter.sendMail({
      from: `Faizan Store ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Your order is updated!",
      html: orderUpdateTemplate(name, orderId, status),
    });

    console.log("Message sent: ", info.messageId);
  },
  passwordChanged: async (recipientEmail, name) => {
    const info = await transporter.sendMail({
      from: `Faizan Store ${process.env.EMAIL_USER}`,
      to: recipientEmail,
      subject: "Your password is changed",
      html: passwordChangedTemplate(name),
    });

    console.log("Message sent: ", info.messageId);
  },
};
