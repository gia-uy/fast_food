-- 1. Tạo cơ sở dữ liệu
CREATE DATABASE IF NOT EXISTS fastfood_store;
USE fastfood_store;

-- 2. Bảng dòng sản phẩm (productlines)
CREATE TABLE productlines (
    productLine VARCHAR(50) PRIMARY KEY,
    textDescription VARCHAR(4000),
    htmlDescription MEDIUMTEXT,
    image MEDIUMBLOB
);

-- 3. Bảng sản phẩm (products)
CREATE TABLE products (
    productCode VARCHAR(15) PRIMARY KEY,
    productName VARCHAR(70) NOT NULL,
    productLine VARCHAR(50),
    productVendor VARCHAR(50),
    productDescription TEXT,
    quantityInStock SMALLINT,
    buyPrice DECIMAL(10,2),
    MSRP DECIMAL(10,2),
    image VARCHAR(255),
    FOREIGN KEY (productLine) REFERENCES productlines(productLine)
);

-- 4. Bảng văn phòng chi nhánh (offices)
CREATE TABLE offices (
    officeCode VARCHAR(10) PRIMARY KEY,
    city VARCHAR(50),
    phone VARCHAR(50),
    addressLine1 VARCHAR(100),
    addressLine2 VARCHAR(100),
    state VARCHAR(50),
    country VARCHAR(50),
    postalCode VARCHAR(15),
    territory VARCHAR(10)
);

-- 5. Bảng nhân viên (employees)
CREATE TABLE employees (
    employeeNumber INT PRIMARY KEY AUTO_INCREMENT,
    lastName VARCHAR(50),
    firstName VARCHAR(50),
    extension VARCHAR(10),
    email VARCHAR(100),
    officeCode VARCHAR(10),
    reportsTo INT,
    jobTitle VARCHAR(50),
    role ENUM('sales', 'admin', 'manager') DEFAULT 'sales',
    FOREIGN KEY (officeCode) REFERENCES offices(officeCode),
    FOREIGN KEY (reportsTo) REFERENCES employees(employeeNumber)
);

-- 6. Bảng khách hàng (customers)
CREATE TABLE customers (
    customerNumber INT PRIMARY KEY AUTO_INCREMENT,
    customerName VARCHAR(50),
    contactLastName VARCHAR(50),
    contactFirstName VARCHAR(50),
    phone VARCHAR(50),
    addressLine1 VARCHAR(100),
    addressLine2 VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    postalCode VARCHAR(15),
    country VARCHAR(50),
    salesRepEmployeeNumber INT,
    creditLimit DECIMAL(10,2),
    email VARCHAR(100),
    password VARCHAR(255),
    FOREIGN KEY (salesRepEmployeeNumber) REFERENCES employees(employeeNumber)
);

-- 7. Bảng đơn hàng (orders)
CREATE TABLE orders (
    orderNumber INT PRIMARY KEY AUTO_INCREMENT,
    orderDate DATE,
    requiredDate DATE,
    shippedDate DATE,
    status ENUM('Processing','Shipped','Delivered','Cancelled') DEFAULT 'Processing',
    comments TEXT,
    customerNumber INT,
    FOREIGN KEY (customerNumber) REFERENCES customers(customerNumber)
);

-- 8. Bảng chi tiết đơn hàng (orderdetails)
CREATE TABLE orderdetails (
    orderNumber INT,
    productCode VARCHAR(15),
    quantityOrdered INT,
    priceEach DECIMAL(10,2),
    orderLineNumber SMALLINT,
    PRIMARY KEY (orderNumber, productCode),
    FOREIGN KEY (orderNumber) REFERENCES orders(orderNumber),
    FOREIGN KEY (productCode) REFERENCES products(productCode)
);

-- 9. Bảng thanh toán (payments)
CREATE TABLE payments (
    paymentNumber INT PRIMARY KEY AUTO_INCREMENT,
    customerNumber INT,
    paymentMethod ENUM('Bank Transfer', 'Credit Card', 'COD'),
    checkNumber VARCHAR(50),
    paymentDate DATE,
    amount DECIMAL(10,2),
    status ENUM('Pending','Paid','Failed') DEFAULT 'Pending',
    FOREIGN KEY (customerNumber) REFERENCES customers(customerNumber)
);

-- 10. Bảng banner / khuyến mãi (system_configs)
CREATE TABLE system_configs (
    configID INT PRIMARY KEY AUTO_INCREMENT,
    bannerImage VARCHAR(255),
    promotionText VARCHAR(255),
    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);




-- Dữ liệu APP cho ứng dụng bán đồ ăn nhanh
USE fastfood_store;

-- ==============================
-- 🥗 1. Dòng sản phẩm (productlines)
-- ==============================
INSERT INTO productlines VALUES
('Burger', 'Các loại burger đặc biệt', NULL, NULL),
('Pizza', 'Pizza phô mai, hải sản, xúc xích', NULL, NULL),
('Drinks', 'Đồ uống có gas, nước ép, cà phê', NULL, NULL),
('Snacks', 'Khoai tây chiên, gà rán, xúc xích', NULL, NULL),
('Dessert', 'Tráng miệng kem, bánh ngọt, pudding', NULL, NULL);

-- ==============================
-- 🍔 2. Sản phẩm (products)
-- ==============================
INSERT INTO products VALUES
('P001', 'Cheese Burger', 'Burger', 'FastFood VN', 'Burger bò phô mai đặc biệt', 120, 20000, 35000, 'cheese_burger.jpg'),
('P002', 'Double Beef Burger', 'Burger', 'FastFood VN', 'Burger hai lớp bò', 80, 25000, 40000, 'double_burger.jpg'),
('P003', 'Seafood Pizza', 'Pizza', 'PizzaCo', 'Pizza hải sản đặc biệt', 100, 50000, 85000, 'seafood_pizza.jpg'),
('P004', 'Pepperoni Pizza', 'Pizza', 'PizzaCo', 'Pizza xúc xích tiêu cay', 90, 45000, 80000, 'pepperoni_pizza.jpg'),
('P005', 'Coca Cola', 'Drinks', 'Coca-Cola', 'Nước ngọt có gas', 300, 8000, 12000, 'coca.jpg'),
('P006', 'Orange Juice', 'Drinks', 'FruitHouse', 'Nước cam tươi nguyên chất', 200, 10000, 18000, 'orange_juice.jpg'),
('P007', 'French Fries', 'Snacks', 'Snacky', 'Khoai tây chiên giòn tan', 250, 12000, 20000, 'fries.jpg'),
('P008', 'Fried Chicken', 'Snacks', 'Snacky', 'Gà rán cay giòn', 150, 30000, 50000, 'chicken.jpg'),
('P009', 'Chocolate Cake', 'Dessert', 'SweetHome', 'Bánh socola phủ kem', 60, 40000, 70000, 'cake.jpg'),
('P010', 'Vanilla Ice Cream', 'Dessert', 'SweetHome', 'Kem vani mát lạnh', 80, 15000, 25000, 'icecream.jpg');

-- ==============================
-- 🏢 3. Văn phòng (offices)
-- ==============================
INSERT INTO offices VALUES
('HCM01', 'Hồ Chí Minh', '028123456', '123 Lê Lợi', NULL, 'HCM', 'Việt Nam', '700000', 'South');

-- ==============================
-- 👩‍💼 4. Nhân viên (employees)
-- ==============================
INSERT INTO employees (lastName, firstName, email, officeCode, jobTitle, role) VALUES
('Nguyen', 'Lan', 'lan@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Tran', 'Minh', 'minh@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Le', 'Huy', 'huy@fastfood.vn', 'HCM01', 'Manager', 'manager'),
('Pham', 'Tuan', 'tuan@fastfood.vn', 'HCM01', 'Admin', 'admin'),
('Bui', 'Khanh', 'khanh@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Do', 'Nga', 'nga@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Vu', 'Hoa', 'hoa@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Hoang', 'Dat', 'dat@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Dang', 'Linh', 'linh@fastfood.vn', 'HCM01', 'Sales Rep', 'sales'),
('Nguyen', 'Long', 'long@fastfood.vn', 'HCM01', 'Admin', 'admin');

-- ==============================
-- 🧍‍♂️ 5. Khách hàng (customers)
-- ==============================
INSERT INTO customers (customerName, contactLastName, contactFirstName, phone, addressLine1, city, country, email, password, salesRepEmployeeNumber) VALUES
('Phạm Văn A', 'Phạm', 'Văn A', '0901111111', '12 Nguyễn Huệ', 'HCM', 'Việt Nam', 'a@gmail.com', '123456', 1),
('Trần Thị B', 'Trần', 'Thị B', '0902222222', '23 Lê Lợi', 'HCM', 'Việt Nam', 'b@gmail.com', '123456', 2),
('Lê Văn C', 'Lê', 'Văn C', '0903333333', '45 Trần Phú', 'HCM', 'Việt Nam', 'c@gmail.com', '123456', 3),
('Nguyễn Thị D', 'Nguyễn', 'Thị D', '0904444444', '56 Lý Thường Kiệt', 'HCM', 'Việt Nam', 'd@gmail.com', '123456', 4),
('Phan Văn E', 'Phan', 'Văn E', '0905555555', '67 Nguyễn Trãi', 'HCM', 'Việt Nam', 'e@gmail.com', '123456', 5),
('Bùi Thị F', 'Bùi', 'Thị F', '0906666666', '78 Hai Bà Trưng', 'HCM', 'Việt Nam', 'f@gmail.com', '123456', 6),
('Hoàng Văn G', 'Hoàng', 'Văn G', '0907777777', '89 Pasteur', 'HCM', 'Việt Nam', 'g@gmail.com', '123456', 7),
('Vũ Thị H', 'Vũ', 'Thị H', '0908888888', '90 Lê Thánh Tôn', 'HCM', 'Việt Nam', 'h@gmail.com', '123456', 8),
('Đỗ Văn I', 'Đỗ', 'Văn I', '0909999999', '91 Nguyễn Văn Cừ', 'HCM', 'Việt Nam', 'i@gmail.com', '123456', 9),
('Trịnh Thị J', 'Trịnh', 'Thị J', '0910000000', '92 Điện Biên Phủ', 'HCM', 'Việt Nam', 'j@gmail.com', '123456', 10);

-- ==============================
-- 📦 6. Đơn hàng (orders)
-- ==============================
INSERT INTO orders (orderDate, requiredDate, shippedDate, status, comments, customerNumber) VALUES
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 1),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 2),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 3),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 4),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 5 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 5),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 6),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 7),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 1 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 8),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 4 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 9),
(CURDATE(), DATE_ADD(CURDATE(), INTERVAL 3 DAY), NULL, 'Processing', 'Đơn hàng đang xử lý', 10);

-- ==============================
-- 🍟 7. Chi tiết đơn hàng (orderdetails)
-- ==============================
INSERT INTO orderdetails VALUES
(1, 'P001', 2, 35000, 1),
(2, 'P003', 1, 85000, 1),
(3, 'P007', 3, 20000, 1),
(4, 'P004', 2, 80000, 1),
(5, 'P002', 1, 40000, 1),
(6, 'P009', 1, 70000, 1),
(7, 'P005', 4, 12000, 1),
(8, 'P006', 2, 18000, 1),
(9, 'P010', 2, 25000, 1),
(10, 'P008', 1, 50000, 1);

-- ==============================
-- 💳 8. Thanh toán (payments)
-- ==============================
INSERT INTO payments (customerNumber, paymentMethod, checkNumber, paymentDate, amount, status) VALUES
(1, 'COD', 'CHK001', CURDATE(), 70000, 'Paid'),
(2, 'Credit Card', 'CHK002', CURDATE(), 85000, 'Paid'),
(3, 'Bank Transfer', 'CHK003', CURDATE(), 60000, 'Pending'),
(4, 'COD', 'CHK004', CURDATE(), 160000, 'Paid'),
(5, 'Credit Card', 'CHK005', CURDATE(), 40000, 'Paid'),
(6, 'COD', 'CHK006', CURDATE(), 70000, 'Pending'),
(7, 'Bank Transfer', 'CHK007', CURDATE(), 48000, 'Paid'),
(8, 'COD', 'CHK008', CURDATE(), 36000, 'Paid'),
(9, 'Credit Card', 'CHK009', CURDATE(), 50000, 'Pending'),
(10, 'Bank Transfer', 'CHK010', CURDATE(), 90000, 'Paid');

