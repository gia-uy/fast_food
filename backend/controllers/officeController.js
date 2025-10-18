const db = require("../db");

exports.getAllOffices = (req, res) => {
  db.query("SELECT * FROM offices", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
