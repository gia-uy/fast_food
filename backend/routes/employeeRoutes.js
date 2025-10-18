const express = require("express");
const router = express.Router();
const c = require("../controllers/employeeController");

router.get("/", c.getAllEmployees);
module.exports = router;
