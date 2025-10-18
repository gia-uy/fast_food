// db.js
const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",        // máy chủ MySQL local
  user: "root",             // gõ tên user của bạn
  password: "",             // gõ mật khẩu của bạn nếu có
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
