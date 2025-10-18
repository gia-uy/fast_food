const express = require("express");
const router = express.Router();
const c = require("../controllers/orderController");

router.get("/", c.getAllOrders);
router.post("/", c.createOrder);
router.put("/:id", c.updateOrderStatus);

module.exports = router;
