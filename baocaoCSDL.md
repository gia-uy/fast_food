# FastFood Web Database (MySQL)

## Chủ đề chính của hệ thống

Hệ thống **quản lý bán hàng đồ ăn nhanh trực tuyến** cho phép khách hàng đặt món, thanh toán, theo dõi đơn hàng; đồng thời hỗ trợ nhân viên và quản trị viên trong việc quản lý sản phẩm, khách hàng, đơn hàng, thanh toán và báo cáo doanh thu.

---

## 1. Các thực thể (Entities)

Dưới đây là danh sách các bảng chính trong cơ sở dữ liệu:

| STT | Bảng           | Vai trò                                                    |
| --- | -------------- | ---------------------------------------------------------- |
| 1   | `offices`      | Lưu thông tin văn phòng chi nhánh                          |
| 2   | `employees`    | Lưu thông tin nhân viên, phân quyền và mối quan hệ báo cáo |
| 3   | `customers`    | Lưu thông tin khách hàng                                   |
| 4   | `productlines` | Lưu danh mục/dòng sản phẩm                                 |
| 5   | `products`     | Lưu thông tin chi tiết của từng sản phẩm                   |
| 6   | `orders`       | Lưu thông tin đơn hàng                                     |
| 7   | `orderdetails` | Lưu chi tiết từng sản phẩm trong đơn hàng                  |
| 8   | `payments`     | Lưu thông tin thanh toán                                   |

---

## 2. Thuộc tính của từng thực thể

### 🏢 `offices`

| Thuộc tính   | Kiểu dữ liệu | Mô tả                      |
| ------------ | ------------ | -------------------------- |
| officeCode   | CHAR(10)     | Mã văn phòng (Primary Key) |
| city         | VARCHAR(50)  | Thành phố                  |
| addressLine1 | VARCHAR(100) | Địa chỉ chính              |
| country      | VARCHAR(50)  | Quốc gia                   |

---

### 👨‍💼 `employees`

| Thuộc tính     | Kiểu dữ liệu | Mô tả                                         |
| -------------- | ------------ | --------------------------------------------- |
| employeeNumber | INT          | Mã nhân viên (Primary Key)                    |
| lastName       | VARCHAR(50)  | Họ                                            |
| firstName      | VARCHAR(50)  | Tên                                           |
| email          | VARCHAR(100) | Email liên hệ                                 |
| officeCode     | CHAR(10)     | Mã văn phòng (FK → offices)                   |
| reportsTo      | INT          | Người quản lý (FK → employees.employeeNumber) |
| jobTitle       | VARCHAR(50)  | Chức vụ (Sales, Admin, Manager)               |

---

### 👥 `customers`

| Thuộc tính             | Kiểu dữ liệu  | Mô tả                                |
| ---------------------- | ------------- | ------------------------------------ |
| customerNumber         | INT           | Mã khách hàng (Primary Key)          |
| customerName           | VARCHAR(100)  | Tên khách hàng                       |
| contactLastName        | VARCHAR(50)   | Họ người liên hệ                     |
| contactFirstName       | VARCHAR(50)   | Tên người liên hệ                    |
| phone                  | VARCHAR(50)   | Số điện thoại                        |
| addressLine1           | VARCHAR(100)  | Địa chỉ                              |
| city                   | VARCHAR(50)   | Thành phố                            |
| country                | VARCHAR(50)   | Quốc gia                             |
| salesRepEmployeeNumber | INT           | Nhân viên phụ trách (FK → employees) |
| creditLimit            | DECIMAL(10,2) | Hạn mức tín dụng                     |

---

### 🍱 `productlines`

| Thuộc tính      | Kiểu dữ liệu | Mô tả                           |
| --------------- | ------------ | ------------------------------- |
| productLine     | VARCHAR(50)  | Tên dòng sản phẩm (Primary Key) |
| textDescription | TEXT         | Mô tả dòng sản phẩm             |

---

### 🍔 `products`

| Thuộc tính         | Kiểu dữ liệu  | Mô tả                             |
| ------------------ | ------------- | --------------------------------- |
| productCode        | VARCHAR(15)   | Mã sản phẩm (Primary Key)         |
| productName        | VARCHAR(100)  | Tên sản phẩm                      |
| productLine        | VARCHAR(50)   | Dòng sản phẩm (FK → productlines) |
| productVendor      | VARCHAR(50)   | Nhà cung cấp                      |
| productDescription | TEXT          | Mô tả sản phẩm                    |
| quantityInStock    | SMALLINT      | Số lượng tồn kho                  |
| buyPrice           | DECIMAL(10,2) | Giá nhập                          |
| MSRP               | DECIMAL(10,2) | Giá bán                           |

---

### 🧾 `orders`

| Thuộc tính     | Kiểu dữ liệu | Mô tả                                                          |
| -------------- | ------------ | -------------------------------------------------------------- |
| orderNumber    | INT          | Mã đơn hàng (Primary Key)                                      |
| orderDate      | DATE         | Ngày đặt hàng                                                  |
| requiredDate   | DATE         | Ngày yêu cầu giao                                              |
| shippedDate    | DATE         | Ngày giao hàng                                                 |
| status         | VARCHAR(20)  | Trạng thái (“Processing”, “Shipped”, “Delivered”, “Cancelled”) |
| comments       | TEXT         | Ghi chú đơn hàng                                               |
| customerNumber | INT          | FK → customers                                                 |

---

### 📦 `orderdetails`

| Thuộc tính      | Kiểu dữ liệu  | Mô tả                     |
| --------------- | ------------- | ------------------------- |
| orderNumber     | INT           | FK → orders               |
| productCode     | VARCHAR(15)   | FK → products             |
| quantityOrdered | INT           | Số lượng                  |
| priceEach       | DECIMAL(10,2) | Giá mỗi sản phẩm          |
| orderLineNumber | SMALLINT      | Thứ tự sản phẩm trong đơn |

**Primary Key (Composite):** `(orderNumber, productCode)`

---

### 💳 `payments`

| Thuộc tính     | Kiểu dữ liệu                    | Mô tả                       |
| -------------- | ------------------------------- | --------------------------- |
| customerNumber | INT                             | FK → customers              |
| checkNumber    | VARCHAR(50)                     | Mã thanh toán (Primary Key) |
| paymentDate    | DATE                            | Ngày thanh toán             |
| amount         | DECIMAL(10,2)                   | Số tiền                     |
| paymentStatus  | ENUM('pending','paid','failed') | Trạng thái thanh toán       |

---

## 3. Mối quan hệ giữa các thực thể

| Mối quan hệ                 | Kiểu  | Mô tả                                              |
| --------------------------- | ----- | -------------------------------------------------- |
| `offices` – `employees`     | 1 → N | Một văn phòng có nhiều nhân viên                   |
| `employees` – `customers`   | 1 → N | Một nhân viên phụ trách nhiều khách hàng           |
| `productlines` – `products` | 1 → N | Một dòng sản phẩm có nhiều sản phẩm                |
| `customers` – `orders`      | 1 → N | Một khách hàng có nhiều đơn hàng                   |
| `orders` – `orderdetails`   | 1 → N | Một đơn hàng có nhiều chi tiết                     |
| `products` – `orderdetails` | 1 → N | Một sản phẩm có thể xuất hiện trong nhiều đơn hàng |
| `customers` – `payments`    | 1 → N | Một khách hàng có thể thực hiện nhiều thanh toán   |

---

## 4. Logic tổng thể của hệ thống

* **Khách hàng (Front-end):**

  * Xem sản phẩm → thêm vào giỏ → đặt hàng → thanh toán → theo dõi đơn hàng.
* **Nhân viên (Back-office):**

  * Quản lý đơn hàng, khách hàng, thanh toán, cập nhật tồn kho.
* **Quản trị viên (Admin):**

  * Quản lý nhân viên, văn phòng, phân quyền, thống kê và cấu hình hệ thống.

---

## 5. Mô hình cơ sở dữ liệu (Logical Model)

```
offices(1) ──< employees(∞)
employees(1) ──< customers(∞)
customers(1) ──< orders(∞)
orders(1) ──< orderdetails(∞) >──(∞) products(1)
customers(1) ──< payments(∞)
productlines(1) ──< products(∞)
```

---

## Kết luận

Cơ sở dữ liệu được thiết kế theo chuẩn **3NF (Third Normal Form)**, đảm bảo:

* Không trùng lặp dữ liệu.
* Dễ mở rộng và tích hợp với backend/frontend.
* Hỗ trợ trực tiếp cho các chức năng của hệ thống: bán hàng, quản lý kho, thanh toán và báo cáo doanh thu.

---