import e from "express";
import signup from "../apiHandlers/Auth/signup.js";
import verifyUser from "../apiHandlers/Auth/verifyUser.js";
import resend from "../apiHandlers/Auth/resend.js";
import login from "../apiHandlers/Auth/login.js";
import verifySession from "../apiHandlers/Auth/verifySession.js";
import logout from "../apiHandlers/Auth/logout.js";

const router = e.Router();

router.get("/signup", signup);
router.get("/verifyUser", verifyUser);
router.get("/resend", resend);
router.get("/login", login);
router.use("/verifySession", verifySession);
router.get("/logout", logout);

export default router;
