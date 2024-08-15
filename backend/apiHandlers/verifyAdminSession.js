import { db } from "../index.js"
import { default as jwt } from "jsonwebtoken";
import cookieParser from "cookie-parser";
const verifyAdminSession = (req,res)=>{
    try {
      const {adminToken} = req.cookies
      const {email} = jwt.decode(adminToken)
      res.send({success:true,email})
    } catch (error) {
      res.send(error)
    }
}

  export default verifyAdminSession