import { default as bcrypt } from "bcryptjs";
import { db } from "../../config/db.js";
import { sendVerificationEmail } from "../../sendVerificationEmail.js";

const signup = (req, res) => {
  const { email, fullName, address, password } = req.query;
  let query = "SELECT * FROM users where email = ?";
  db.query(query, email, async (err, results) => {
    if (err) {
      res.send({ success: "false", msg: "error occured" });
      return;
    }
    if (results.length > 0) {
      if (results[0].isVerified) {
        res.send({ success: "false", msg: "user already exists" });
      } else {
        const verifyCode = Math.floor(Math.random() * 9000 + 1000);
        const expiryDate = new Date(Date.now() + 3600000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const updated = {
          email, fullName, address,
          password: hashedPassword,
          expiry: expiryDate,
          verifyCode,
          isVerified: false,
        };
        let updateQuery = "UPDATE users SET ? WHERE email = ?";
        db.query(updateQuery, [updated, email], async (err) => {
          if (err) {
            console.error("Error updating user:", err);
            res.status(500).send({ success: "false", msg: "Error updating user" });
            return;
          }
          await sendVerificationEmail(email, verifyCode);
          res.send({ success: "true", msg: "User updated" });
        });
      }
      return;
    } else {
      const verifyCode = Math.floor(Math.random() * 9000 + 1000);
      const expiryDate = new Date(Date.now() + 3600000);
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        email, fullName, address,
        profile_picture: 'https://avatars.githubusercontent.com/u/124599?v=4',
        password: hashedPassword,
        expiry: expiryDate,
        verifyCode,
        isVerified: false,
      };
      let insertQuery = "INSERT INTO users SET ?";
      db.query(insertQuery, newUser, async (err) => {
        if (err) {
          console.error("Error adding user:", err);
          res.status(500).send({ success: "false", msg: "Error adding user" });
          return;
        }
        console.log("User added");
        await sendVerificationEmail(email, verifyCode);
        res.send({ success: "true", msg: "User added" });
      });
    }
  });
};

export default signup;
