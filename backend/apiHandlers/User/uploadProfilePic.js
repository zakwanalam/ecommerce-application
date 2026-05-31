import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";

const uploadProfilePic = (req, res) => {
  const { url } = req.body;
  const { email } = jwt.decode(req.cookies.token);
  const query = "UPDATE users SET profile_picture= ? where email = ?";
  try {
    db.query(query, [url, email], (err, results) => {
      if (err) {
        res.send({ success: false });
        throw err;
      }
      if (results.affectedRows > 0) {
        res.send({ success: true });
      } else {
        res.send({ success: false });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false });
  }
};

export default uploadProfilePic;
