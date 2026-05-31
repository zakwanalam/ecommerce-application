import e from "express";
import getUser from "../apiHandlers/User/getUser.js";
import loadUserData from "../apiHandlers/User/loadUserData.js";
import getProfilePic from "../apiHandlers/User/getProfilePic.js";
import uploadProfilePic from "../apiHandlers/User/uploadProfilePic.js";
import saveUser from "../apiHandlers/User/saveUser.js";

const router = e.Router();

router.get("/getUser", getUser);
router.get("/loadUserData", loadUserData);
router.get("/getProfilePic", getProfilePic);
router.post("/uploadProfilePic", uploadProfilePic);
router.post("/saveUser", saveUser);

export default router;
