const db = require("../db");

exports.getAllEmployees = (req, res) => {
  db.query("SELECT * FROM employees", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
