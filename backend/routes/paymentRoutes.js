const express = require("express");
const router = express.Router();
const c = require("../controllers/paymentController");

router.get("/", c.getAllPayments);
router.post("/", c.createPayment);
router.put("/:id", c.updatePaymentStatus);

module.exports = router;
