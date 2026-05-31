import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS_VERIFY } from "./config/dotenv.js";
import { verificationEmailTemplate } from "./templates/verificationEmail.js";

export async function sendVerificationEmail(email, verifyCode) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    port: 465,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS_VERIFY,
    },
  });

  try {
    const info = await transporter.sendMail({
      to: email,
      subject: "OTP Verificaton",
      html: verificationEmailTemplate(email, verifyCode),
    });
    console.log("Message sent: %s", info.messageId);
    return { success: true, message: "verification email send successfully" };
  } catch (error) {
    console.error(error, "Error in sending verification email");
    return { success: false, message: "failed to send verification email" };
  }
}
