import { db } from "../../config/db.js";
import { sendVerificationEmail } from "../../sendVerificationEmail.js";

const resend = (req, res) => {
  const verifyCode = Math.floor(Math.random() * 9000 + 1000);
  const expiry = new Date(Date.now() + 3600000);
  const { email } = req.query;
  console.log(email);

  const dbQuery = `UPDATE users SET expiry = ?, verifyCode = ? WHERE email = ?;`;
  db.query(dbQuery, [expiry, verifyCode, email], (err, results) => {
    if (err) throw err;
    if (results) {
      sendVerificationEmail(email, verifyCode);
      res.send({ success: true, message: "Verification email Sent" });
    } else {
      res.send({ success: false, message: "Could Not find email" });
    }
  });
};

export default resend;
