const db = require("../db");

exports.getAllPayments = (req, res) => {
  db.query("SELECT * FROM payments", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

exports.createPayment = (req, res) => {
  const { customerNumber, paymentMethod, amount } = req.body;
  db.query("INSERT INTO payments (customerNumber, paymentMethod, paymentDate, amount, status) VALUES (?, ?, CURDATE(), ?, 'Pending')",
    [customerNumber, paymentMethod, amount], err => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "💳 Thêm thanh toán thành công!" });
    });
};

exports.updatePaymentStatus = (req, res) => {
  db.query("UPDATE payments SET status=? WHERE paymentNumber=?", [req.body.status, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "💳 Cập nhật thanh toán thành công!" });
  });
};
