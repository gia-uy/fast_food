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

| Quan hệ                               | Kiểu                | Giải thích                                                                                                              |
| ------------------------------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **productlines → products**           | 1–N Optional        | Một dòng sản phẩm có thể có nhiều sản phẩm, nhưng cũng có thể chưa có sản phẩm nào.                                     |
| **offices → employees**               | 1–N Optional        | Một văn phòng có thể có nhiều nhân viên, nhưng cũng có thể chưa có nhân viên nào được gán.                              |
| **employees → employees (reportsTo)** | 1–N Optional (self) | Một nhân viên có thể báo cáo cho người quản lý khác; có thể có hoặc không (ví dụ: quản lý cấp cao không cần reportsTo). |
| **employees → customers**             | 1–N Optional        | Một nhân viên có thể phụ trách nhiều khách hàng, nhưng khách hàng cũng có thể chưa được gán cho nhân viên cụ thể nào.   |
| **customers → orders**                | 1–N Optional        | Một khách hàng có thể đặt nhiều đơn hàng, nhưng cũng có thể chưa có đơn hàng nào.                                       |
| **orders → orderdetails**             | 1–N Mandatory       | Mỗi đơn hàng phải có ít nhất một chi tiết sản phẩm (bắt buộc).                                                          |
| **products → orderdetails**           | 1–N Mandatory       | Mỗi sản phẩm có thể nằm trong nhiều chi tiết đơn hàng, nhưng sản phẩm phải thuộc ít nhất một đơn hàng nếu đã bán ra.    |
| **customers → payments**              | 1–N Optional        | Một khách hàng có thể thực hiện nhiều thanh toán, nhưng cũng có thể chưa phát sinh giao dịch nào.                       |

---

### 🔍 Tổng kết logic mối quan hệ:

* **1–N Optional (◦──<)**: Quan hệ có thể tồn tại hoặc không (phía “1” có thể chưa có bản ghi liên kết).
* **1–N Mandatory (●──<)**: Quan hệ bắt buộc; bản ghi phía “1” phải có ít nhất một bản ghi liên kết ở phía “N”.

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
