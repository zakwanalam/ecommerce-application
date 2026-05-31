import e from "express";
import uploadImage from "../apiHandlers/Upload/uploadImage.js";

const router = e.Router();

router.post("/uploadImage", uploadImage);

export default router;
