import { default as bcrypt } from "bcryptjs";
import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";
import { JWT_SECRET, TOKEN_EXPIRY } from "../../config/dotenv.js";

const login = async (req, res) => {
  const { email, password } = req.query;
  console.log("Email and password", email, password);
  const dbQuery = "SELECT * FROM users where email= ?";
  db.query(dbQuery, email, async (err, results) => {
    console.log(results);
    try {
      if (err) return res.send({ success: false });
      if (results) {
        if (results[0].isVerified === 1) {
          const hashedPassword = results[0].password;
          const compareResult = await bcrypt.compare(password, hashedPassword);
          if (compareResult === true) {
            const jwtToken = jwt.sign(
              { email, fullName: results[0].fullName, address: results[0].address },
              JWT_SECRET,
              { expiresIn: TOKEN_EXPIRY }
            );
            const expiry_day = 24 * 60 * 60 * 1000;
            const options = { expires: new Date(Date.now() + expiry_day), httpOnly: true };
            res.cookie("token", jwtToken, options).send({ success: true, message: "Login was successful" });
          } else {
            res.send({ success: false, message: "Incorrect Password" });
          }
        } else {
          res.send({ success: false, message: "Register your account first", isNotVerified: true });
        }
      } else {
        res.send({ success: false, message: "Register Your account First", isNotRegistered: true });
      }
    } catch (error) {
      res.send({ success: false });
    }
  });
};

export default login;
