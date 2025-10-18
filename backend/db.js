// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",        // máy chủ MySQL local
  user: "root",             // tài khoản mặc định của XAMPP
  password: "Lethibaodiep0501@",             // XAMPP mặc định KHÔNG có mật khẩu (để trống)
  database: "fastfood_store" // tên database bạn import từ file .sql
});

db.connect(err => {
  if (err) {
    console.error("❌ Lỗi kết nối MySQL:", err.message);
  } else {
    console.log("✅ Kết nối MySQL thành công!");
  }
});

module.exports = db;
