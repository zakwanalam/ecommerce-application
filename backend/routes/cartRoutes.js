import e from "express";
import addToCart from "../apiHandlers/Cart/addToCart.js";
import removeFromCart from "../apiHandlers/Cart/removeFromCart.js";
import updateCartItemQuantity from "../apiHandlers/Cart/updateCartItemQuantity.js";
import getCart from "../apiHandlers/Cart/getCart.js";

const router = e.Router();

router.post("/addToCart", addToCart);
router.post("/removeFromCart", removeFromCart);
router.post("/updateCartItemQuantity", updateCartItemQuantity);
router.get("/getCart", getCart);

export default router;
