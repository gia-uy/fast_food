const db = require("../db");

// Danh sách sản phẩm + tìm kiếm theo tên, dòng sản phẩm
exports.getAllProducts = (req, res) => {
  const { search, line } = req.query;
  let sql = "SELECT * FROM products";
  const params = [];

  if (search) {
    sql += " WHERE productName LIKE ?";
    params.push(`%${search}%`);
  } else if (line) {
    sql += " WHERE productLine = ?";
    params.push(line);
  }

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// Lấy 1 sản phẩm
exports.getProductById = (req, res) => {
  db.query("SELECT * FROM products WHERE productCode=?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows[0]);
  });
};

// Thêm sản phẩm
exports.createProduct = (req, res) => {
  const { productCode, productName, productLine, buyPrice, MSRP, productVendor, productDescription, quantityInStock, image } = req.body;
  const sql = "INSERT INTO products (productCode, productName, productLine, productVendor, productDescription, quantityInStock, buyPrice, MSRP, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  db.query(sql, [productCode, productName, productLine, productVendor, productDescription, quantityInStock, buyPrice, MSRP, image], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Thêm sản phẩm thành công!" });
  });
};

// Cập nhật sản phẩm
exports.updateProduct = (req, res) => {
  const { id } = req.params;
  const { productName, buyPrice, MSRP, quantityInStock } = req.body;
  db.query("UPDATE products SET productName=?, buyPrice=?, MSRP=?, quantityInStock=? WHERE productCode=?", [productName, buyPrice, MSRP, quantityInStock, id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Cập nhật sản phẩm thành công!" });
  });
};

// Xóa
exports.deleteProduct = (req, res) => {
  db.query("DELETE FROM products WHERE productCode=?", [req.params.id], err => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Xóa sản phẩm thành công!" });
  });
};
