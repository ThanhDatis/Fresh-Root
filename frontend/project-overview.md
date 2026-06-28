# 🍊 FreshRoot — Fresh Fruit & Gift Store

> Dự án Frontend Web cá nhân | E-commerce Storefront + Admin Dashboard

---

## 📌 Tổng quan dự án

**FreshRoot** là một nền tảng thương mại điện tử chuyên về trái cây tươi và các sản phẩm quà tặng từ trái cây, hướng đến đối tượng người dùng hiện đại quan tâm đến sức khỏe và lối sống lành mạnh. Dự án bao gồm hai phần chính: giao diện mua sắm dành cho khách hàng (Storefront) và hệ thống quản trị nội bộ (Admin Dashboard).

---

## 🎯 Mục tiêu dự án

- Xây dựng một sản phẩm hoàn chỉnh từ **Design (Figma) → Code → Triển khai**
- Thể hiện kỹ năng **UI/UX Design** và **Frontend Development** trong CV
- Áp dụng và làm quen với **Next.js**, **TypeScript**, kiến trúc **Microservice**
- Tích hợp **AI** vào giao diện theo hướng thực tế
- Xây dựng **Design System** nhất quán, có thể tái sử dụng

---

## 👤 Đối tượng người dùng

| Đối tượng             | Mô tả                                                                    |
| --------------------- | ------------------------------------------------------------------------ |
| **Khách hàng**        | Người dùng 20–35 tuổi, quan tâm sức khỏe, thích mua trái cây tươi online |
| **Người mua quà**     | Cá nhân / doanh nghiệp tìm kiếm quà tặng ý nghĩa, cao cấp từ trái cây    |
| **Admin / Nhân viên** | Người quản lý cửa hàng, xử lý đơn hàng, cập nhật sản phẩm                |

---

## 🎨 Design Direction

| Thuộc tính         | Chi tiết                                                          |
| ------------------ | ----------------------------------------------------------------- |
| **Màu chủ đạo**    | Sage Green — `#BCE7D4` (light), `#90B6A5` (mid), `#1F382D` (dark) |
| **Phong cách**     | Minimal, hiện đại, tối giản — không rườm rà                       |
| **Typography**     | Geist (mặc định Next.js)                                          |
| **Tone**           | Tự nhiên, trong sáng, đáng tin cậy                                |
| **Công cụ design** | Figma                                                             |

---

## 🗂️ Cấu trúc dự án (Trang cần thiết kế)

### 🛍️ Storefront (Phía khách hàng)

| Trang                  | Mô tả                                                                                           |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| **Home**               | Hero banner, danh mục nổi bật, best sellers, gift collection banner, testimonials, blog preview |
| **Product Listing**    | Danh sách sản phẩm, filter theo danh mục/giá/đánh giá/loại, sort, pagination                    |
| **Product Detail**     | Ảnh sản phẩm, mô tả, giá, chọn variant, đánh giá, sản phẩm liên quan                            |
| **Gift Products**      | Trang riêng/filter cho Giỏ quà tặng, Hộp quà, BST quà tặng                                      |
| **Cart**               | Danh sách giỏ, gift note, coupon, tổng tiền                                                     |
| **Checkout**           | Stepper: địa chỉ → phương thức giao → thanh toán                                                |
| **Order Confirmation** | Thông báo thành công, mã đơn hàng                                                               |
| **Order History**      | Lịch sử đơn hàng, filter trạng thái, xem chi tiết                                               |
| **User Profile**       | Thông tin cá nhân, địa chỉ, wishlist, đổi mật khẩu                                              |
| **Login / Register**   | Form đăng nhập, đăng ký, Google OAuth                                                           |
| **Our Story**          | Brand story, values, timeline, nhà vườn đối tác                                                 |
| **Blog**               | Danh sách bài viết về dinh dưỡng & sức khỏe, filter theo chủ đề                                 |
| **Blog Detail**        | Nội dung bài, table of contents, sản phẩm liên quan trong bài                                   |
| **AI Chatbot Widget**  | Floating widget tư vấn trái cây theo nhu cầu dinh dưỡng                                         |

### 🛠️ Admin Dashboard (Phía quản trị)

| Trang                   | Mô tả                                                                  |
| ----------------------- | ---------------------------------------------------------------------- |
| **Dashboard Overview**  | Metric cards, biểu đồ doanh thu, đơn mới, sản phẩm sắp hết hàng        |
| **Product Management**  | CRUD sản phẩm (bao gồm gift products), upload ảnh, quản lý tồn kho     |
| **Category Management** | CRUD danh mục, drag & drop thứ tự hiển thị                             |
| **Order Management**    | Danh sách đơn, cập nhật trạng thái, xem chi tiết + gift note           |
| **Customer Management** | Danh sách khách hàng, lịch sử mua, block/unblock tài khoản             |
| **Analytics**           | Biểu đồ doanh thu, sản phẩm bán chạy, category performance, export CSV |
| **Settings**            | Thông tin cửa hàng, cấu hình giao hàng, quản lý coupon                 |

---

## 🎁 Dòng sản phẩm

### Trái cây tươi

Sản phẩm cốt lõi — theo loại trái cây và xuất xứ. Bán theo kg hoặc phần nhỏ.

### Sản phẩm quà tặng

| Loại             | Mô tả                                  | Đặc điểm                                           |
| ---------------- | -------------------------------------- | -------------------------------------------------- |
| **Giỏ quà tặng** | Giỏ đóng sẵn nhiều loại trái cây tươi  | Có option thiệp + bọc giấy, size S/M/L             |
| **Hộp quà**      | Hộp cứng cao cấp, phù hợp tặng đối tác | Option in logo doanh nghiệp, B2B bulk order        |
| **BST quà tặng** | Bộ sưu tập theo dịp lễ/mùa vụ          | Tết, Trung Thu, Sinh nhật, v.v. — có lịch hiển thị |

---

## 🤖 AI Integration

| Feature                           | Mô tả                                                            | Cách tích hợp                               |
| --------------------------------- | ---------------------------------------------------------------- | ------------------------------------------- |
| **Fruit Advisor Chatbot**         | Tư vấn loại trái cây / quà tặng theo mục tiêu sức khỏe, dịp tặng | Gọi OpenAI / Gemini API, streaming response |
| **Smart Search**                  | Tìm kiếm thông minh, gợi ý khi gõ, chịu được typo                | Debounce + AI suggestion                    |
| **Product Description Generator** | Admin tự động tạo mô tả sản phẩm bằng AI                         | Tích hợp trong form thêm sản phẩm           |

---

## 🛠️ Tech Stack

### Frontend

| Công nghệ                 | Mục đích                                |
| ------------------------- | --------------------------------------- |
| **Next.js** (App Router)  | Framework chính, SSR/SSG, routing       |
| **TypeScript**            | Type safety, code chất lượng hơn        |
| **MUI (Material UI)**     | Component library, theming              |
| **Zustand**               | State management (cart, auth, UI state) |
| **Axios**                 | HTTP client, gọi API                    |
| **React Hook Form + Zod** | Form handling & validation              |

### Backend

| Công nghệ              | Mục đích        |
| ---------------------- | --------------- |
| **Node.js + Express**  | REST API server |
| **MongoDB + Mongoose** | Database        |
| **JWT**                | Authentication  |

### DevOps & Tooling

| Công nghệ                     | Mục đích                                                |
| ----------------------------- | ------------------------------------------------------- |
| **Docker Compose**            | Containerize toàn bộ services                           |
| **Microservice Architecture** | Tách biệt: Auth Service, Product Service, Order Service |
| **ESLint + Prettier**         | Code quality                                            |

---

## 📁 Cấu trúc thư mục

> Xem chi tiết tại file riêng: `cau-truc-thu-muc.md`

---

## 📋 Feature Specs

> Xem mô tả chi tiết từng tính năng tại: `feature-specs.md`

---

## ✅ Checklist trước khi bắt đầu code

- [ ] Hoàn thiện Design System trong Figma (Colors, Typography, Spacing, Components)
- [ ] Design đủ tất cả các trang (Desktop trước, Mobile sau)
- [ ] Xác định đủ API endpoints cần thiết
- [ ] Setup Git repository với branching strategy rõ ràng
- [ ] Viết README cho project

---

_Cập nhật lần cuối: 06/2025_