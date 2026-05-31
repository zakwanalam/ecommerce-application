import e from "express";
import verifyAdmin from "../apiHandlers/Admin/verifyAdmin.js";
import verifyAdminSession from "../apiHandlers/Admin/verifyAdminSession.js";
import getProducts from "../apiHandlers/Products/getProducts.js";
import saveProduct from "../apiHandlers/Products/saveProduct.js";
import deleteProduct from "../apiHandlers/Products/deleteProduct.js";
import adminLogout from "../apiHandlers/Admin/adminLogout.js";

const router = e.Router();

router.get("/verifyAdmin", verifyAdmin);
router.get("/verifyAdminSession", verifyAdminSession);
router.get("/getProducts", getProducts);
router.post("/saveProduct", saveProduct);
router.delete("/deleteProduct", deleteProduct);
router.post("/adminLogout", adminLogout);

export default router;
