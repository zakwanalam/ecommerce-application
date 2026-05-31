import { default as jwt } from "jsonwebtoken";
import { db } from "../../config/db.js";

const getProfilePic = (req, res) => {
  const { email } = jwt.decode(req.cookies.token);
  console.log(email);
  const query = `SELECT profile_picture from users where email = '${email}'`;
  db.query(query, (err, results) => {
    if (err) throw err;
    if (results) {
      console.log(results);
      res.send({ success: true, profile_picture: results[0].profile_picture });
    }
  });
};

export default getProfilePic;
