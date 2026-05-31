import { default as jwt } from "jsonwebtoken";

const loadUserData = (req, res) => {
  try {
    const { token } = req.cookies;
    const { email, fullName, address } = jwt.decode(token);
    res.send({ success: true, email, fullName, address });
  } catch (error) {
    res.send({ success: false });
  }
};

export default loadUserData;
