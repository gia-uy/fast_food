const express = require("express");
const router = express.Router();
const c = require("../controllers/customerController");

router.get("/", c.getAllCustomers);
router.get("/:id", c.getCustomerById);
router.post("/", c.createCustomer);
router.put("/:id", c.updateCustomer);

module.exports = router;
