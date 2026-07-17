import e from "express";
import uploadImage from "../apiHandlers/Upload/uploadImage.js";
import removeImage from "../apiHandlers/Upload/removeImage.js";

const router = e.Router();

router.post("/uploadImage", uploadImage);
router.post("/removeImage", removeImage);

export default router;
