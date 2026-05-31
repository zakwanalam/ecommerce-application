import { db } from "../../config/db.js";

const verifyUser = (req, res) => {
  const { email, password, verifyCode } = req.query;
  const query = "SELECT * from users where email= ?";
  db.query(query, email, (err, results) => {
    console.log(results);
    if (err) throw err;
    if (results) {
      if (
        results[0].verifyCode.toString() === verifyCode.toString() &&
        results[0].verifyCode != "expired"
      ) {
        const expiredCode = "expired";
        let query = "";
        let queryParams = [];
        if (password) {
          let isVerified = true;
          query = "UPDATE users SET password= ?, verifyCode= ?, isVerified= ? WHERE email= ?";
          queryParams = [password, expiredCode, isVerified, email];
        } else {
          query = "UPDATE users SET verifyCode= ?, isVerified= ? WHERE email= ?";
          let isVerified = true;
          queryParams = [expiredCode, isVerified, email];
        }
        db.query(query, queryParams, (err) => {
          if (err) throw err;
        });
        res.send({ success: true, message: "Verification Successful" });
      } else {
        res.send({ success: false, message: "Invalid Otp" });
      }
    } else {
      res.send({ sucess: false, message: "User Not Registered", login: false });
    }
  });
};

export default verifyUser;
