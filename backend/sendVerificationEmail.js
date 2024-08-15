
import nodemailer from "nodemailer";

export async function sendVerificationEmail(
    email,
    verifyCode
  ) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      secure: true,
      port: 465,
      auth: {
        user: "zakwanalam07@gmail.com",
        pass: "mnsm bygh snmy qhhd",
      },
    });
  
    try {
      const info = await transporter.sendMail({
        to: email,
        subject: "OTP Verificaton",
        html:`<table cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#f9f9f9">
              <tr>
                <td align="center" valign="top">
                  <table cellpadding="0" cellspacing="0" border="0" width="600" bgcolor="#ffffff" style="border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
                    <tr>
                      <td align="center" valign="top">
                        <h1 style="color: #600CF7; font-size: 24px; margin-bottom: 10px;">Verify Your Email Address</h1>
                        <p style="font-size: 16px; margin-bottom: 20px;">We just need to verify your email address before you can signup/login.</p>
                        <h2 style="color: #600CF7; font-size: 18px; font-weight:500;margin-bottom: 6px;">Your OTP Verification Code is:</h2>
                        <h3 style="font-size: 36px; font-weight: bold; margin-bottom: 20px;"><strong>${ verifyCode }</strong></h3>
                        <p style="font-size: 14px; margin-top: 20px;">If you have any questions, send us an email <a href="mailto:support@example.com" style="color: #600CF7;">support@example.com</a>.</p>
                        <p style="font-size: 12px; color: #999; margin-top: 20px;">This email was sent to <strong>${ email }</strong>.</p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>`
      });
      console.log("Message sent: %s", info.messageId);
      return { success: true, message: "verification email send successfully" };
    } catch (error) {
      console.error(error, "Error in sending verification email");
      return { success: false, message: "failed to send verification email" };
    }
  }
  