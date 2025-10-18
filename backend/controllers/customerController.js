const db = require("../db");

exports.getAllCustomers = (req, res) => {
  db.query("SELECT * FROM customers", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.getCustomerById = (req, res) => {
  db.query("SELECT * FROM customers WHERE customerNumber=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
};

exports.createCustomer = (req, res) => {
  const { customerName, contactLastName, contactFirstName, phone, addressLine1, city, country, email, password } = req.body;
  db.query("INSERT INTO customers (customerName, contactLastName, contactFirstName, phone, addressLine1, city, country, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [customerName, contactLastName, contactFirstName, phone, addressLine1, city, country, email, password],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Tạo khách hàng thành công!" });
    });
};

exports.updateCustomer = (req, res) => {
  const { id } = req.params;
  const { customerName, phone, city, email } = req.body;
  db.query("UPDATE customers SET customerName=?, phone=?, city=?, email=? WHERE customerNumber=?",
    [customerName, phone, city, email, id],
    err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Cập nhật khách hàng thành công!" });
    });
};
