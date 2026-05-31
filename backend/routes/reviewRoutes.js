import e from "express";
import saveReview from "../apiHandlers/Reviews/saveReview.js";
import getReviews from "../apiHandlers/Reviews/getReviews.js";
import deleteReview from "../apiHandlers/Reviews/deleteReview.js";

const router = e.Router();

router.post("/saveReview", saveReview);
router.get("/getReviews", getReviews);
router.delete("/deleteReview", deleteReview);

export default router;
