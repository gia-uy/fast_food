const express = require("express");
const router = express.Router();
const c = require("../controllers/officeController");

router.get("/", c.getAllOffices);
module.exports = router;
