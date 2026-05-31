import { default as jwt } from "jsonwebtoken";
import { JWT_SECRET, TOKEN_EXPIRY } from "../../config/dotenv.js";
import { db } from "../../config/db.js";

const saveUser = (req, res) => {
  try {
    const userData = req.body;
    const { email, firstName, lastName, address, profile_picture } = userData;
    const fullName = `${firstName} ${lastName}`;
    const query = `UPDATE users SET fullName = ?, address = ?, profile_picture = ? WHERE email = ?`;
    console.log(fullName);

    db.query(query, [fullName, address, profile_picture, email], (err, results) => {
      if (err) throw err;
      else {
        const { token } = req.cookies;
        const previousToken = jwt.decode(token);
        const jwtToken = jwt.sign(
          { email, fullName, address },
          JWT_SECRET,
          { expiresIn: previousToken.exp }
        );
        const options = { expires: new Date(previousToken.exp * 1000), httpOnly: true };
        res.cookie("token", jwtToken, options).send({ success: true, msg: "User Updated SuccessFully" });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

export default saveUser;
