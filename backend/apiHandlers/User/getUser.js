import { default as jwt } from "jsonwebtoken";
const getUser = async(req, res) => {
    try {
        const { token } = req.cookies;
        const user = jwt.decode(token);
        res.status(200).send({ user: user });
    } catch (error) {
        console.log(error);
    }

}
export default getUser
