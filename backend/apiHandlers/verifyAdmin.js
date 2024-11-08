import { db } from "../index.js";
import { default as jwt } from "jsonwebtoken";
import cookieParser from "cookie-parser";
const verifyAdmin = (req, res) => {
    try {
      const { email, password } = req.query;
      console.log(email, password);
      const query = "SELECT * FROM admins where email = ? and password = ?";
  
      db.query(query, [email, password], (err, results) => {
        console.log(results.length);
        
        if (err) {
          res.send({ success: false });
        }
        if (results.length > 0) {
          const adminToken = jwt.sign({email},'adminToken',{expiresIn:'24h'})
          res.cookie('adminToken',adminToken,{options:{httpOnly:true,maxAge:new Date(Date.now + 24*60*60*1000)}}).send({ success: true});
        } else {
          res.send({ success: false });
        } 
      });
    } catch (error) {
      console.error("Error while verifying");
      res.send({ success: false });
    }
  }
  export default verifyAdmin