const db = require("../db");

// Lấy danh sách đơn hàng
exports.getAllOrders = (req, res) => {
  db.query("SELECT * FROM orders", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Tạo đơn hàng mới
exports.createOrder = (req, res) => {
  const { customerNumber, orderDetails } = req.body;
  const sqlOrder = "INSERT INTO orders (orderDate, requiredDate, status, customerNumber) VALUES (CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), 'Processing', ?)";
  db.query(sqlOrder, [customerNumber], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    const orderNumber = result.insertId;

    const detailValues = orderDetails.map(d => [orderNumber, d.productCode, d.quantityOrdered, d.priceEach, 1]);
    db.query("INSERT INTO orderdetails (orderNumber, productCode, quantityOrdered, priceEach, orderLineNumber) VALUES ?", [detailValues], err2 => {
      if (err2) return res.status(500).json({ error: err2.message });
      res.json({ message: "✅ Đặt hàng thành công!", orderNumber });
    });
  });
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = (req, res) => {
  db.query("UPDATE orders SET status=? WHERE orderNumber=?", [req.body.status, req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Cập nhật trạng thái thành công!" });
  });
};
