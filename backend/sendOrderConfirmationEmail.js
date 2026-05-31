import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS_ORDER } from "./config/dotenv.js";
import { orderConfirmationEmailTemplate } from "./templates/orderConfirmationEmail.js";

export async function sendOrderConfirmationEmail(products, email = EMAIL_USER) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS_ORDER,
    },
  });

  try {
    const info = await transporter.sendMail({
      to: email,
      subject: "Foot Finesse - Order Confirmation",
      html: orderConfirmationEmailTemplate(products),
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "Order confirmation email sent successfully." };
  } catch (error) {
    console.error(error, "Error in sending order confirmation email");
    return { success: false, message: "Failed to send order confirmation email." };
  }
}
