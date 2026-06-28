# 📋 Feature Specs — FreshRoot

> Mô tả chi tiết từng tính năng của dự án FreshRoot
> Dùng làm tài liệu tham chiếu khi design và phát triển

---

## 🛍️ STOREFRONT

---

### HOME PAGE

**Mục tiêu:** Giới thiệu thương hiệu, dẫn dắt người dùng khám phá sản phẩm và tạo chuyển đổi.

> **Nav bar (Header):** Thay vì dùng Section Category Showcase (ảnh tròn + tên danh mục), việc điều hướng theo danh mục được đưa lên **Header Navigation Bar** với các mục: `Trang chủ | Sản phẩm | Quà tặng | Our Story | Blog`. Section Category Showcase đã được **bỏ** khỏi Home Page.

| Section                         | Mô tả chi tiết                                                                                                                                                                                   |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hero Banner**                 | Ảnh nền toàn màn hình hoặc slideshow 2–3 ảnh. Tagline ngắn + nút CTA "Mua ngay" / "Khám phá". Có thể có countdown nếu đang có khuyến mãi.                                                        |
| **Gift Collection Banner**      | Banner visual lớn giới thiệu dòng sản phẩm quà tặng — Giỏ quà, Hộp quà, BST. Thiết kế sang trọng, có ảnh editorial + CTA "Khám phá quà tặng". Đặt ngay sau Hero để tận dụng vùng nhìn đầu trang. |
| **Best Sellers**                | Grid 4–6 sản phẩm bán chạy nhất. Mỗi ProductCard gồm: ảnh, tên, giá, badge "Bán chạy", nút thêm giỏ.                                                                                             |
| **Why Choose Us**               | 3–4 icon + text: Trái cây tươi mỗi ngày / Giao hàng nhanh / Nguồn gốc rõ ràng / Đóng gói cẩn thận.                                                                                               |
| **Seasonal / Promotion Banner** | Banner khuyến mãi theo mùa. Có thể là full-width hoặc 2-col split layout.                                                                                                                        |
| **New Arrivals**                | Grid 4 sản phẩm mới nhất với badge "Mới".                                                                                                                                                        |
| **Testimonials**                | Carousel 3–5 review từ khách hàng thực. Có avatar, tên, rating sao, nội dung ngắn.                                                                                                               |
| **Blog Preview**                | 3 bài blog mới nhất dạng card — thumbnail, tiêu đề, excerpt, link đọc thêm.                                                                                                                      |
| **Newsletter CTA**              | Banner đơn giản với input email + nút đăng ký. Giảm giá 10% cho lần mua đầu.                                                                                                                     |

---

### PRODUCT LISTING PAGE (`/products`)

**Mục tiêu:** Giúp người dùng tìm và lọc sản phẩm hiệu quả.

| Element                    | Mô tả chi tiết                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------- |
| **Breadcrumb**             | Home > Sản phẩm (hoặc > Tên danh mục nếu đang filter)                                                           |
| **Page Header**            | Tiêu đề trang + số lượng sản phẩm tìm được                                                                      |
| **Filter Sidebar / Panel** | Filter theo: Danh mục, Khoảng giá (range slider), Đánh giá (từ X sao), Loại sản phẩm (Tươi / Quà tặng), Xuất xứ |
| **Sort Bar**               | Dropdown sort: Mặc định / Giá tăng dần / Giá giảm dần / Mới nhất / Đánh giá cao nhất                            |
| **View Toggle**            | Chuyển giữa Grid view (2–4 col) và List view                                                                    |
| **Product Grid**           | ProductCard gồm: ảnh, tên, giá, giá gốc (nếu giảm), badge (Mới/Giảm giá/Bán chạy), rating, nút thêm giỏ         |
| **Pagination**             | Page number pagination hoặc "Load more" button                                                                  |
| **Active Filters**         | Chips hiển thị các filter đang áp dụng, có thể xóa từng cái                                                     |
| **Empty State**            | Khi không tìm thấy sản phẩm: illustration + message + nút xóa filter                                            |

---

### PRODUCT DETAIL PAGE (`/products/[slug]`)

**Mục tiêu:** Cung cấp đủ thông tin để người dùng ra quyết định mua.

| Element                   | Mô tả chi tiết                                                                                     |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Breadcrumb**            | Home > Sản phẩm > Tên sản phẩm                                                                     |
| **Image Gallery**         | Ảnh chính lớn + thumbnail row bên dưới. Click thumbnail để đổi ảnh chính. Zoom on hover (desktop). |
| **Product Info**          | Tên, badge trạng thái (Còn hàng / Hết hàng), SKU, rating tổng hợp + số review                      |
| **Price Block**           | Giá hiện tại (nổi bật), giá gốc gạch ngang (nếu đang giảm), % giảm giá badge                       |
| **Variant Selector**      | Nếu có variant (trọng lượng: 500g / 1kg / 2kg) — dạng button group                                 |
| **Quantity Selector**     | Input số có nút +/- với min=1, max=tồn kho                                                         |
| **Add to Cart / Buy Now** | 2 nút: "Thêm vào giỏ" (outlined) và "Mua ngay" (contained)                                         |
| **Product Description**   | Tab hoặc accordion: Mô tả / Thông tin dinh dưỡng / Hướng dẫn bảo quản / Xuất xứ                    |
| **Reviews Section**       | Rating tổng hợp (bar chart 5 sao) + danh sách review. Có thể lọc theo sao.                         |
| **Related Products**      | Grid 4 sản phẩm cùng danh mục                                                                      |
| **Recently Viewed**       | 4 sản phẩm xem gần đây (lưu localStorage)                                                          |

> **Lưu ý cho Quà tặng:** ProductDetail của Giỏ quà / Hộp quà cần thêm section "Nội dung bộ quà" — danh sách sản phẩm bên trong, có thể có option cá nhân hóa (thêm thiệp, chọn màu ribbon).

---

### GIFT PRODUCTS

**Danh mục sản phẩm quà tặng** gồm 3 loại, mỗi loại có đặc thù riêng:

#### 🧺 Giỏ quà tặng (Gift Baskets)

Giỏ được đóng sẵn với nhiều loại trái cây tươi, phù hợp làm quà biếu.

| Thuộc tính       | Chi tiết                                              |
| ---------------- | ----------------------------------------------------- |
| **Hiển thị giá** | Theo giỏ (không tính theo kg)                         |
| **Variant**      | Size giỏ: Nhỏ / Vừa / Lớn                             |
| **Nội dung**     | Danh sách trái cây bên trong (có ảnh + tên)           |
| **Option**       | Thêm thiệp tay viết (+15,000đ), bọc giấy kraft/ribbon |
| **Shipping**     | Chú ý giao nhanh trong ngày để đảm bảo tươi           |

#### 📦 Hộp quà (Gift Boxes)

Hộp cứng cao cấp, thiết kế đẹp — phù hợp tặng đối tác, khách hàng doanh nghiệp.

| Thuộc tính       | Chi tiết                                             |
| ---------------- | ---------------------------------------------------- |
| **Hiển thị giá** | Theo hộp, có thể kèm giá dịch vụ in logo             |
| **Variant**      | Loại hộp: Standard / Premium / Corporate             |
| **Option**       | In logo doanh nghiệp, thêm voucher, thiết kế riêng   |
| **B2B Note**     | Có thể đặt số lượng lớn — link đến trang liên hệ B2B |

#### 🎁 BST Quà tặng (Gift Collections)

Bộ sưu tập theo chủ đề: Sức khỏe mùa hè, Tết Nguyên Đán, Trung Thu, Sinh nhật...

| Thuộc tính       | Chi tiết                                                            |
| ---------------- | ------------------------------------------------------------------- |
| **Hiển thị giá** | Theo bộ, thường có giá "tiết kiệm X%" so với mua lẻ                 |
| **Tính mùa vụ**  | BST thay đổi theo dịp lễ/mùa — cần Admin quản lý thời gian hiển thị |
| **Curated feel** | Ảnh editorial đẹp, storytelling về concept của BST                  |

---

### CART PAGE (`/cart`)

| Element               | Mô tả chi tiết                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| **Cart Item List**    | Ảnh nhỏ, tên, variant (nếu có), giá đơn vị, quantity selector, giá tổng dòng, nút xóa          |
| **Gift Note**         | Input thêm ghi chú tặng quà (free text, max 200 chars) — đặc biệt quan trọng cho gift products |
| **Order Summary**     | Tạm tính, phí ship (tính theo địa chỉ), giảm giá (nếu có coupon), tổng cuối                    |
| **Coupon Input**      | Input mã giảm giá + nút áp dụng                                                                |
| **Checkout CTA**      | Nút "Tiến hành thanh toán" nổi bật                                                             |
| **Continue Shopping** | Link quay lại Product Listing                                                                  |
| **Empty State**       | Illustration + "Giỏ hàng trống" + nút "Mua sắm ngay"                                           |
| **Upsell Section**    | "Có thể bạn thích" — 4 sản phẩm gợi ý                                                          |

---

### CHECKOUT PAGE (`/checkout`)

Chia thành các bước rõ ràng (stepper):

**Bước 1 — Thông tin giao hàng:**

- Họ tên, SĐT, Email
- Địa chỉ (Province/District/Ward dropdowns theo API đơn vị hành chính VN)
- Địa chỉ cụ thể
- Giao tới địa chỉ khác (toggle) — hữu ích khi mua quà

**Bước 2 — Phương thức giao hàng:**

- Giao tiêu chuẩn (2–3 ngày)
- Giao nhanh trong ngày (chỉ nội thành)
- Hiển thị phí ship tương ứng

**Bước 3 — Thanh toán:**

- COD (Thanh toán khi nhận hàng)
- Chuyển khoản ngân hàng
- Ví điện tử (MoMo, ZaloPay)

**Order Summary Sidebar:** Luôn hiển thị bên phải (sticky) — danh sách sản phẩm, tổng tiền.

---

### OUR STORY PAGE (`/our-story`)

**Mục tiêu:** Xây dựng niềm tin và cảm xúc với thương hiệu.

| Section              | Mô tả chi tiết                                                                                    |
| -------------------- | ------------------------------------------------------------------------------------------------- |
| **Hero**             | Ảnh nền lớn (vườn cây/nông trại), tagline _"Từ vườn đến tay bạn"_, không CTA                      |
| **Brand Story**      | 2-col layout: text kể câu chuyện thành lập + ảnh editorial. Giọng văn ấm, chân thực.              |
| **Our Values**       | 3–4 icon cards ngang: Tươi nguyên chất / Nguồn gốc rõ ràng / Giao nhanh / Thân thiện môi trường   |
| **Journey Timeline** | Vertical timeline từ năm thành lập đến nay. Minimal: line + dot + năm + mô tả ngắn                |
| **Farmer Partners**  | Grid 3–4 card nhà vườn đối tác — ảnh, tên vùng trồng, loại trái cây đặc trưng, một câu quote ngắn |
| **CTA cuối**         | Banner _"Khám phá sản phẩm của chúng tôi"_ → link đến `/products`                                 |

---

### BLOG

#### Blog Listing (`/blog`)

| Element           | Mô tả chi tiết                                                                                                        |
| ----------------- | --------------------------------------------------------------------------------------------------------------------- |
| **Hero nhỏ**      | Tiêu đề "Blog sức khỏe" + mô tả ngắn + search bar                                                                     |
| **Featured Post** | Card lớn full-width: ảnh hero, category badge, tiêu đề lớn, excerpt 2 dòng, tác giả + ngày + thời gian đọc            |
| **Category Tabs** | Tabs lọc bài: Tất cả / Dinh dưỡng / Công thức / Mùa vụ / Tips & Tricks                                                |
| **Post Grid**     | 3 col desktop, 2 col tablet, 1 col mobile. Mỗi card: thumbnail, category badge, tiêu đề, excerpt, ngày, thời gian đọc |
| **Pagination**    | Số trang hoặc "Xem thêm"                                                                                              |

#### Blog Detail (`/blog/[slug]`)

| Element               | Mô tả chi tiết                                                                                     |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| **Hero**              | Ảnh lớn + tiêu đề + metadata (tác giả, ngày, thời gian đọc, category)                              |
| **Table of Contents** | Sticky sidebar bên phải liệt kê các heading trong bài (hiển thị khi bài > 5 phút đọc)              |
| **Article Body**      | Typography đẹp: h2/h3 hierarchy rõ, blockquote styled, image với caption, list có bullet tùy chỉnh |
| **Related Products**  | Widget "Sản phẩm nhắc đến trong bài" — 3–4 ProductCard nhỏ                                         |
| **Share Buttons**     | Facebook, Copy link                                                                                |
| **Related Posts**     | 3 bài cùng category ở cuối trang                                                                   |
| **Author Box**        | Avatar, tên, bio ngắn của tác giả                                                                  |

---

### LOGIN / REGISTER (`/login`, `/register`)

| Element           | Mô tả chi tiết                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- |
| **Layout**        | 2-col: bên trái ảnh brand/illustration, bên phải form. Mobile: chỉ form            |
| **Login Form**    | Email + Password, nút "Đăng nhập", link "Quên mật khẩu?", divider + Google OAuth   |
| **Register Form** | Họ tên + Email + Password + Confirm Password + checkbox đồng ý ĐKSD, nút "Đăng ký" |
| **Tab Switch**    | Tab để chuyển giữa Đăng nhập / Đăng ký (không route mới)                           |
| **Validation**    | Real-time validation với React Hook Form + Zod                                     |

---

### USER PROFILE (`/profile`)

Sidebar navigation với các tab:

| Tab                   | Nội dung                                       |
| --------------------- | ---------------------------------------------- |
| **Thông tin cá nhân** | Họ tên, email, SĐT, avatar upload              |
| **Địa chỉ**           | Danh sách địa chỉ, thêm/sửa/xóa, chọn mặc định |
| **Đổi mật khẩu**      | Form: mật khẩu cũ + mới + xác nhận             |
| **Đơn hàng của tôi**  | Redirect đến Order History                     |
| **Wishlist**          | Danh sách sản phẩm yêu thích                   |

---

### ORDER HISTORY (`/orders`)

| Element                     | Mô tả chi tiết                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| **Filter**                  | Filter theo trạng thái: Tất cả / Chờ xác nhận / Đang giao / Đã nhận / Đã hủy                  |
| **Order Card**              | Mã đơn, ngày đặt, trạng thái badge, danh sách sản phẩm rút gọn, tổng tiền, nút "Xem chi tiết" |
| **Order Detail Modal/Page** | Timeline trạng thái đơn, danh sách sản phẩm đầy đủ, thông tin giao hàng, tóm tắt thanh toán   |

---

## 🛠️ ADMIN DASHBOARD

---

### DASHBOARD OVERVIEW (`/dashboard`)

| Section             | Mô tả chi tiết                                                                                                                  |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Metric Cards**    | 4 cards: Doanh thu hôm nay, Đơn hàng mới, Khách hàng mới, Sản phẩm sắp hết hàng. Mỗi card có trend % so với hôm qua/tuần trước. |
| **Revenue Chart**   | Line chart doanh thu 7 ngày / 30 ngày / 3 tháng (tab toggle). Dùng Recharts.                                                    |
| **Recent Orders**   | Table 5–10 đơn mới nhất: mã, khách hàng, sản phẩm, tổng tiền, trạng thái, nút xem.                                              |
| **Top Products**    | List 5 sản phẩm bán chạy nhất tuần/tháng với progress bar.                                                                      |
| **Low Stock Alert** | List sản phẩm tồn kho < threshold, link nhanh đến trang chỉnh sửa.                                                              |

---

### PRODUCT MANAGEMENT (`/admin/products`)

| Feature                   | Mô tả chi tiết                                                                                                                  |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Product Table**         | Columns: ảnh thumbnail, tên, danh mục, giá, tồn kho, trạng thái (Active/Inactive), ngày tạo. Sortable columns.                  |
| **Search & Filter**       | Tìm theo tên, filter theo danh mục, trạng thái, loại sản phẩm (Trái cây / Quà tặng)                                             |
| **Add/Edit Product Form** | Tên, mô tả (rich text), giá, giá gốc, tồn kho, danh mục, upload nhiều ảnh, variants, trạng thái, AI generate description button |
| **Gift Product Fields**   | Thêm: Nội dung bộ quà (danh sách sản phẩm con), option cá nhân hóa, loại quà tặng                                               |
| **Bulk Actions**          | Chọn nhiều → Xóa / Kích hoạt / Vô hiệu hóa                                                                                      |
| **Delete Confirmation**   | Dialog xác nhận trước khi xóa                                                                                                   |

---

### CATEGORY MANAGEMENT (`/admin/categories`)

| Feature           | Mô tả chi tiết                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------- |
| **Category List** | Dạng table hoặc tree view nếu có danh mục con. Columns: tên, slug, số sản phẩm, trạng thái   |
| **Add/Edit Form** | Tên danh mục, slug (auto-generate từ tên), ảnh đại diện, danh mục cha (optional), trạng thái |
| **Reorder**       | Drag & drop để sắp xếp thứ tự hiển thị                                                       |

---

### ORDER MANAGEMENT (`/admin/orders`)

| Feature               | Mô tả chi tiết                                                                                                           |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| **Order Table**       | Mã đơn, khách hàng, ngày đặt, tổng tiền, phương thức thanh toán, trạng thái giao hàng                                    |
| **Status Filter**     | Tabs: Tất cả / Chờ xác nhận / Đang xử lý / Đang giao / Hoàn thành / Đã hủy                                               |
| **Order Detail Page** | Timeline trạng thái, thông tin khách hàng, địa chỉ giao hàng, danh sách sản phẩm, gift note (nếu có), tóm tắt thanh toán |
| **Update Status**     | Dropdown chọn trạng thái mới, có confirm dialog                                                                          |
| **Search**            | Tìm theo mã đơn, tên khách hàng, SĐT                                                                                     |

---

### CUSTOMER MANAGEMENT (`/admin/customers`)

| Feature             | Mô tả chi tiết                                                                                   |
| ------------------- | ------------------------------------------------------------------------------------------------ |
| **Customer Table**  | Avatar, tên, email, SĐT, tổng đơn hàng, tổng chi tiêu, ngày đăng ký, trạng thái (Active/Blocked) |
| **Customer Detail** | Thông tin cá nhân, lịch sử đơn hàng, tổng giá trị, địa chỉ đã lưu                                |
| **Block/Unblock**   | Toggle trạng thái tài khoản                                                                      |
| **Search & Filter** | Tìm theo tên/email, filter theo trạng thái                                                       |

---

### ANALYTICS (`/admin/analytics`)

| Section                  | Mô tả chi tiết                                                          |
| ------------------------ | ----------------------------------------------------------------------- |
| **Revenue Chart**        | Line/Bar chart doanh thu theo ngày/tuần/tháng/năm. Date range picker.   |
| **Orders Chart**         | Số đơn hàng theo thời gian, tỉ lệ hủy đơn                               |
| **Top Products**         | Bar chart hoặc table: sản phẩm bán chạy nhất theo số lượng và doanh thu |
| **Category Performance** | Pie/Donut chart tỉ lệ doanh thu theo danh mục                           |
| **Customer Acquisition** | Số khách hàng mới theo tháng                                            |
| **Export**               | Nút export báo cáo ra CSV/Excel                                         |

---

### GIFT MANAGEMENT (trong Product Management)

Phần quản lý riêng cho dòng Gift Products:

| Feature                   | Mô tả chi tiết                                                                |
| ------------------------- | ----------------------------------------------------------------------------- |
| **Gift Type**             | Phân loại: Giỏ quà / Hộp quà / BST quà tặng                                   |
| **Bundle Contents**       | Quản lý danh sách sản phẩm trong giỏ/hộp (many-to-many với products)          |
| **Seasonal Scheduling**   | Set ngày bắt đầu / kết thúc hiển thị (cho BST theo mùa/dịp lễ)                |
| **Customization Options** | Cấu hình các option cá nhân hóa (thiệp, ribbon, in logo) và phụ phí tương ứng |

---

### SETTINGS (`/admin/settings`)

| Tab                    | Nội dung                                                    |
| ---------------------- | ----------------------------------------------------------- |
| **Thông tin cửa hàng** | Tên, logo, địa chỉ, SĐT, email, mô tả                       |
| **Cấu hình giao hàng** | Phí ship theo khu vực, ngưỡng miễn phí ship, vùng giao hàng |
| **Mã giảm giá**        | Tạo/quản lý coupon codes                                    |
| **Thông báo**          | Cấu hình email thông báo đơn hàng                           |

---

## 🤖 AI FEATURES

### Fruit Advisor Chatbot

| Spec         | Chi tiết                                                                                                     |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| **Trigger**  | Floating button góc dưới phải, icon lá cây/chat                                                              |
| **UI**       | Dialog nổi lên, không route mới. Header có avatar bot + tên "FreshRoot Advisor"                              |
| **Input**    | Text input có gợi ý nhanh: "Trái cây tốt cho da?" / "Quà tặng cho người cao tuổi?" / "Trái cây theo mùa hè?" |
| **Response** | Streaming text (typewriter effect) + có thể kèm ProductCard gợi ý sản phẩm                                   |
| **Context**  | Bot biết danh mục sản phẩm hiện có của FreshRoot                                                             |

### Smart Search

| Spec                 | Chi tiết                                                                                 |
| -------------------- | ---------------------------------------------------------------------------------------- |
| **Trigger**          | Search bar trên Navbar                                                                   |
| **Behavior**         | Debounce 300ms, gọi API sau khi dừng gõ                                                  |
| **Results dropdown** | Hiển thị: Sản phẩm gợi ý (thumbnail + tên + giá), Danh mục liên quan, Bài blog liên quan |
| **AI layer**         | Gợi ý khi typo: "bưởi" → gợi ý "bưởi da xanh, bưởi năm roi"                              |

### Product Description Generator (Admin)

| Spec              | Chi tiết                                                                |
| ----------------- | ----------------------------------------------------------------------- |
| **Trigger**       | Nút "✨ Tạo mô tả bằng AI" trong form thêm/sửa sản phẩm                 |
| **Input context** | Tên sản phẩm + danh mục + các từ khóa (xuất xứ, đặc điểm) do admin nhập |
| **Output**        | Đoạn mô tả 100–150 chữ, tone phù hợp với FreshRoot (tươi mới, đáng tin) |
| **Editable**      | Admin có thể chỉnh sửa trước khi lưu                                    |
