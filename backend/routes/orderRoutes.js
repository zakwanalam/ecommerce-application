import e from "express";
import getSessions from "../apiHandlers/Orders/getSessions.js";
import getOrders from "../apiHandlers/Orders/getOrders.js";
import checkout from "../apiHandlers/Orders/checkout.js";
import testApi from "../apiHandlers/Orders/testApi.js";
import storeOrder from "../apiHandlers/Orders/storeOrder.js";

const router = e.Router();

router.get("/getSessions", getSessions);
router.get("/getOrders", getOrders);
router.post("/checkout", checkout);
router.post("/testApi", testApi);
router.get("/storeOrder", storeOrder);

export default router;
