# 📋 Feature Specs — Giao diện Admin (Phase 1)

> FreshRoot — Hệ thống Bán hàng & Quản lý Kho | Tham khảo mô hình KiotViet
> Đặc tả chi tiết chức năng cho 10 trang thuộc giao diện Admin

---

## Điều hướng chính (Sidebar dọc)

`Tổng quan (Dashboard) | Hàng hóa (Products) | Đơn hàng (Orders) | Khách hàng (Customers) | Nhân viên (Employees) | Báo cáo (Report) | Mua hàng (Purchasing) | Sổ quỹ (Cashbook) | Thuế (Tax) | Cài đặt (Settings)`

- Nút nổi bật **"POS"** ở góc phải header → mở nhanh giao diện Bán hàng.

---

## 1. 📊 DASHBOARD (Tổng quan)

### Bộ lọc thời gian

- Date range selector: Hôm nay / 7 ngày qua / Tháng này / Tùy chọn — áp dụng toàn trang
- Nút refresh làm mới thủ công

### Metric Cards

| Card           | Nội dung                    |
| -------------- | --------------------------- |
| Doanh thu      | Số tiền + % so với kỳ trước |
| Số hóa đơn     | Tổng số + % so với kỳ trước |
| Trả hàng       | Số tiền hoàn + số đơn trả   |
| Khách hàng mới | Số khách mới tạo trong kỳ   |

### Biểu đồ Doanh thu

- Line chart (Recharts), tabs: Theo ngày / Theo tuần / Theo tháng
- Tooltip hover hiển thị chi tiết từng điểm
- Empty state "Chưa có dữ liệu" khi chưa có hóa đơn

### Top sản phẩm bán chạy

- List 5 sản phẩm: ảnh, tên, số lượng bán, progress bar
- Toggle: Số lượng bán / Doanh thu

### Top nhân viên bán hàng

- List 5 nhân viên: avatar, tên, doanh thu, số hóa đơn
- Click tên → điều hướng sang trang chi tiết nhân viên

### Cảnh báo tồn kho thấp

- List sản phẩm tồn kho ≤ ngưỡng cảnh báo
- CTA "Xem tất cả" → sang Hàng hóa với filter tồn kho thấp

### Hoạt động gần đây (Realtime)

- Feed danh sách, mới nhất trên cùng, icon theo loại hành động + mô tả + thời gian tương đối
- Loại hành động: Lập hóa đơn, Trả hàng, Nhập kho, Đăng nhập, Hết hàng
- Cơ chế: WebSocket hoặc polling 15–30s

---

## 2. 👥 CUSTOMER (Khách hàng)

### Bảng danh sách

| Cột              | Ghi chú                                    |
| ---------------- | ------------------------------------------ |
| Mã khách hàng    | Auto KH0001                                |
| Tên              |                                            |
| SĐT              | Định danh chính, dùng tra cứu tại POS (F4) |
| Nhóm khách hàng  | Badge: Lẻ / Sỉ / VIP                       |
| Tổng số hóa đơn  |                                            |
| Tổng chi tiêu    |                                            |
| Lần mua gần nhất |                                            |
| Trạng thái       | Active / Đã chặn                           |

**Chức năng bảng:** phân trang, tìm kiếm (tên/SĐT), lọc (nhóm, khoảng ngày mua gần nhất, khoảng chi tiêu), ẩn/hiện cột, import Excel (validate trùng SĐT), export Excel, bulk actions (đổi nhóm hàng loạt / xóa).

### Thêm/Sửa khách hàng

Tên*, SĐT* (validate VN, check trùng), Email, Địa chỉ, Nhóm khách hàng (Lẻ mặc định/Sỉ/VIP), Ghi chú.

> Dùng chung component với panel "Tìm khách hàng (F4)" ở POS.

### Xóa khách hàng

Dialog xác nhận. Nếu đã có hóa đơn liên kết → không xóa cứng, chuyển "Đã chặn"/ẩn khỏi chọn nhanh ở POS.

### Chi tiết khách hàng

Thông tin cơ bản · Metric tổng quan (tổng chi tiêu, số hóa đơn, giá trị đơn TB) · Lịch sử mua hàng (link sang Order) · Nút Sửa/Đổi nhóm.

### Nhóm khách hàng

**Phase 1: chỉ dùng để phân loại/lọc/báo cáo** — chưa áp giá tự động theo nhóm. Sẽ mở rộng ở phase sau.

---

## 3. 👔 EMPLOYEE (Nhân viên)

### Bảng danh sách

Mã NV, Avatar+Tên, **Vai trò** (badge Admin/Thu ngân), SĐT, Ngày vào làm, Trạng thái (Đang làm/Đã nghỉ), Doanh thu tháng này.
Chức năng: phân trang, tìm kiếm, lọc (vai trò, trạng thái), import/export Excel.

### Thêm/Sửa nhân viên

Họ tên*, SĐT*, Email, Username\* (unique), Mật khẩu (admin đặt ban đầu), **Vai trò\*** (Admin/Thu ngân — field quan trọng nhất, quyết định `useRoleGuard`), Ngày vào làm, Lương cơ bản/đơn giá công, Ảnh đại diện.

### Xóa/Vô hiệu hóa

Không xóa cứng nếu đã có hóa đơn/chấm công gắn liền → chuyển "Đã nghỉ việc", không đăng nhập được nữa.

### Chi tiết nhân viên (tabs)

Thông tin | Lịch làm việc | Chấm công | Bảng lương | Hóa đơn đã lập

### Lịch làm việc

Calendar tuần, Admin định nghĩa ca chuẩn trước (VD: Ca sáng 7h–13h, Ca chiều 13h–19h, Ca tối 19h–22h), xếp lịch bằng click/kéo-thả vào ô ngày+ca. Xem theo nhân viên hoặc toàn cửa hàng.

### Chấm công & Bảng lương

> ⚠️ **Trạng thái: "Đang phát triển..."** — đặc tả chi tiết dưới đây được giữ lại làm tài liệu tham chiếu, nhưng **chưa triển khai UI thật ở Phase 1**. 2 tab "Chấm công" và "Bảng lương" trong trang chi tiết nhân viên hiển thị placeholder "Đang phát triển...".

<details>
<summary>Đặc tả tham chiếu (chưa triển khai)</summary>

**Chấm công:**

- Check-in/Check-out đầu/cuối ca, hoặc Admin nhập tay hộ
- Đối chiếu với lịch làm việc → Đúng giờ / Trễ / Vắng
- Bảng chấm công theo tháng: hàng = ngày, cột = trạng thái từng ca
- Đánh dấu nghỉ phép (có lương) riêng với vắng không phép

**Bảng lương:**

- Kỳ lương theo tháng
- Công thức tính: _(chưa chốt — cần xác định giữa: theo giờ công / theo ca cố định / lương cứng + trừ vắng, và có/không thưởng theo % doanh thu cá nhân)_
- Bảng chi tiết: số công thực tế, lương cơ bản, phụ cấp, thưởng/phạt, tổng lương
- Xuất phiếu lương PDF/Excel
- Xác nhận đã trả lương → tự động ghi khoản chi vào Sổ quỹ

</details>

---

## 4. 📈 REPORT (Báo cáo)

Mỗi báo cáo con đều có chung: bộ lọc thời gian, nút Export Excel.

| Báo cáo        | Nội dung                                                                                                       |
| -------------- | -------------------------------------------------------------------------------------------------------------- |
| **Trong ngày** | Doanh thu, số hóa đơn, số khách, giờ cao điểm; biểu đồ theo giờ; danh sách hóa đơn trong ngày                  |
| **Đặt hàng**   | Doanh thu theo thời gian; tỷ lệ trả hàng/hủy đơn; phân bổ theo chế độ bán; phân bổ theo phương thức thanh toán |
| **Nhân viên**  | Bảng xếp hạng doanh thu; số hóa đơn/nhân viên; giá trị đơn TB/nhân viên                                        |
| **NCC**        | Tổng giá trị nhập theo NCC; số phiếu nhập/NCC; Top NCC                                                         |
| **Hàng hóa**   | Top bán chạy (số lượng & doanh thu); hàng bán chậm; phân bổ doanh thu theo danh mục                            |
| **Khách hàng** | Khách mới theo thời gian; Top khách chi tiêu nhiều; phân bổ theo nhóm khách hàng                               |
| **Lợi nhuận**  | Doanh thu − Giá vốn = Lợi nhuận gộp; biên lợi nhuận (%); lợi nhuận theo danh mục/sản phẩm                      |
| **Tồn kho**    | Giá trị tồn kho hiện tại (theo giá vốn); hàng tồn lâu (không giao dịch X ngày); lịch sử biến động kho          |

---

## 5. 🧾 ORDER (Đơn hàng)

### Bảng danh sách

Mã hóa đơn, Ngày giờ, Nhân viên lập, Khách hàng, Chế độ bán (badge), Số sản phẩm, Tổng tiền, Phương thức thanh toán, Trạng thái (badge: Hoàn thành / Đã hủy / Đã trả một phần / Đã trả toàn bộ).

**Lọc & tìm kiếm:** khoảng thời gian, nhân viên (multi-select), trạng thái, chế độ bán, phương thức thanh toán, tìm theo mã HĐ/tên/SĐT khách, khoảng giá trị đơn.

### Chi tiết hóa đơn

Header (mã, trạng thái, ngày giờ, nhân viên, chế độ bán) · Thông tin khách hàng (link Customer) · Danh sách sản phẩm (ảnh, đơn giá, SL, giảm giá dòng, thành tiền) · Tổng kết (tạm tính, giảm giá tổng, tổng tiền, tiền khách đưa, tiền thối) · Ghi chú · Lịch sử thay đổi (timeline nếu đã trả/hủy).

### Hành động

| Hành động      | Điều kiện                 | Xử lý                                                     |
| -------------- | ------------------------- | --------------------------------------------------------- |
| In lại hóa đơn | Mọi trạng thái            | Mở bản in/PDF                                             |
| Hủy hóa đơn    | Vừa lập, chưa bị trả hàng | Dialog xác nhận (nhập lý do) → "Đã hủy" → tự hoàn tồn kho |
| Trả hàng       | Đã "Hoàn thành"           | Xem luồng bên dưới                                        |

### Luồng Trả hàng

1. Chọn hóa đơn gốc → "Trả hàng"
2. Chọn sản phẩm & số lượng trả (≤ số lượng đã mua)
3. Lý do: Hàng lỗi / Khách đổi ý / Giao nhầm / Khác
4. Số tiền hoàn tự tính, hiển thị trước xác nhận
5. Hình thức hoàn: Tiền mặt / Trừ công nợ (tùy chọn)
6. Xác nhận → cộng lại tồn kho → tạo bản ghi con gắn hóa đơn gốc → cập nhật trạng thái → ghi khoản chi vào Sổ quỹ

### Export Excel

Theo bộ lọc áp dụng, tùy chọn thêm cột chi tiết sản phẩm (1 dòng = 1 sản phẩm).

---

## 6. 📦 PRODUCT (Hàng hóa)

### Bảng danh sách

Ảnh, Tên, Mã vạch/SKU, Danh mục, Đơn vị tính, Giá vốn, Giá bán, Tồn kho (highlight nếu ≤ ngưỡng), Trạng thái.
Chức năng: phân trang, tìm kiếm (tên/mã vạch), lọc (danh mục, trạng thái, tồn kho thấp), ẩn/hiện cột, import/export Excel, bulk actions.

### Thêm/Sửa sản phẩm

Tên*, Mô tả, Danh mục* (chọn từ cây danh mục cha/con), **Mã vạch** (nhập tay/quét/tự sinh), Đơn vị tính (xem mục Đơn vị quy đổi bên dưới), Giá vốn, Giá bán, Tồn kho ban đầu, Ngưỡng cảnh báo tồn kho thấp, Ảnh (nhiều ảnh), Trạng thái.

### Đơn vị tính — Quy đổi

| Element             | Chi tiết                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| Đơn vị cơ bản       | Đơn vị nhỏ nhất, dùng tính tồn kho nội bộ (VD: Lon)                                                  |
| Đơn vị quy đổi      | Nhiều đơn vị lớn hơn, mỗi đơn vị có hệ số quy đổi về đơn vị cơ bản (VD: Thùng = 24 Lon, Lốc = 6 Lon) |
| Giá bán theo đơn vị | Mỗi đơn vị có giá riêng (không nhất thiết = giá cơ bản × hệ số)                                      |
| Ở Nhập hàng         | Nhập theo đơn vị bất kỳ → tự quy đổi cộng vào tồn kho theo đơn vị cơ bản                             |
| Ở POS               | Bán theo đơn vị bất kỳ → tự quy đổi trừ tồn kho theo đơn vị cơ bản                                   |
| Ở Kiểm kho          | Đếm hỗn hợp đơn vị (VD: 2 thùng + 5 lon) → tự quy ra tổng đơn vị cơ bản để đối chiếu                 |

> Model dữ liệu: bảng `ProductUnit` riêng (`productId`, `unitName`, `conversionRate`, `sellPrice`). Ở UI thể hiện qua bảng nhỏ "Đơn vị tính" trong form Thêm/Sửa sản phẩm.

### Quản lý danh mục — Phân cấp cha/con

- Hiển thị dạng tree view (expand/collapse)
- Thêm/Sửa có field "Danh mục cha" (để trống = danh mục gốc)
- Giới hạn tối đa 2 cấp (Cha → Con)
- Lọc theo danh mục cha tự bao gồm cả danh mục con
- Không xóa nếu còn sản phẩm — yêu cầu chuyển sản phẩm sang danh mục khác trước

### Kiểm kho (Stock Take)

1. Tạo phiếu kiểm mới — toàn bộ kho hoặc theo danh mục
2. Quét/nhập từng sản phẩm, nhập số lượng đếm thực tế
3. Bảng đối chiếu: tồn hệ thống vs. đếm thực tế vs. chênh lệch (highlight)
4. Xác nhận → điều chỉnh tồn kho theo số liệu thực tế, lưu lịch sử phiếu

### Thiết lập giá

- Sửa giá từng sản phẩm (trong form Sửa)
- Sửa giá hàng loạt: chọn nhiều SP/theo danh mục → tăng/giảm theo % hoặc số tiền cố định
- Lịch sử thay đổi giá: ngày đổi, giá cũ/mới, người đổi

---

## 7. 🚚 MUA HÀNG

### Quản lý Nhà cung cấp (NCC)

Bảng: tên, người liên hệ, SĐT, mặt hàng chính, tổng giá trị đã nhập, trạng thái.
Thêm/Sửa: tên, người liên hệ, SĐT, email, địa chỉ, MST (tùy chọn), ghi chú.
Xóa: không xóa cứng nếu có phiếu nhập liên kết → "Ngừng hợp tác".
Chi tiết NCC: lịch sử phiếu nhập, tổng giá trị theo thời gian.

### Nhập hàng (Phiếu nhập kho)

1. Tạo phiếu — chọn NCC, ngày nhập, số phiếu giao hàng của NCC
2. Thêm sản phẩm — quét/tìm tên → chọn đơn vị nhập (theo hệ đơn vị đã khai báo) → số lượng + giá nhập
3. Bảng chi tiết phiếu, tổng giá trị
4. Xác nhận → cộng tồn kho (quy đổi đơn vị cơ bản) → cập nhật giá vốn mới → ghi khoản chi vào Sổ quỹ (nếu thanh toán ngay) hoặc để công nợ
5. Trạng thái: Nháp / Đã nhập kho

### Trả hàng nhập

1. Chọn phiếu nhập gốc → "Trả hàng nhập"
2. Chọn sản phẩm & số lượng (≤ đã nhập)
3. Lý do: Hàng lỗi / Giao sai / Hết hạn / Khác
4. Xác nhận → trừ lại tồn kho đã cộng → ghi khoản thu hoàn tiền vào Sổ quỹ

### Lịch sử phiếu nhập

Bảng: mã phiếu, NCC, ngày, tổng giá trị, trạng thái. Lọc theo NCC/thời gian/trạng thái. Export Excel.

---

## 8. 💰 SỔ QUỸ

### Đa quỹ

2 quỹ riêng biệt: **Quỹ tiền mặt** (tại quầy) và **Tài khoản ngân hàng** — mỗi quỹ có số dư & lịch sử độc lập. Tab/toggle chọn quỹ đang xem. Tổng quan đầu trang hiển thị số dư cả 2 quỹ cạnh nhau.

### Tự động phân loại

Thanh toán "Tiền mặt" → ghi Quỹ tiền mặt. Thanh toán "Chuyển khoản" → ghi Tài khoản ngân hàng. Áp dụng tương tự cho Nhập hàng, Trả hàng, Trả lương — chọn quỹ tương ứng lúc xác nhận nghiệp vụ.

### Chuyển quỹ nội bộ

Loại phiếu đặc biệt "Chuyển quỹ" (VD: nộp tiền mặt cuối ngày vào ngân hàng) — tạo 1 phiếu Chi ở Tiền mặt + 1 phiếu Thu ở Ngân hàng, liên kết nhau.

### Tổng quan (mỗi quỹ)

Tồn quỹ hiện tại · Thu hôm nay · Chi hôm nay.

### Bảng danh sách phiếu

Mã phiếu, Loại (Thu/Chi), Nguồn gốc (tự động/thủ công), Số tiền, Người tạo, Ngày giờ, Ghi chú. Lọc theo loại/nguồn/thời gian/người tạo. Export Excel.

### Nguồn tự động ghi nhận (không sửa/xóa trực tiếp)

| Nghiệp vụ                              | Loại |
| -------------------------------------- | ---- |
| Bán hàng (POS) — tiền mặt/chuyển khoản | Thu  |
| Trả hàng (Order) — hoàn tiền           | Chi  |
| Nhập hàng — thanh toán ngay            | Chi  |
| Trả hàng nhập — NCC hoàn tiền          | Thu  |
| Trả lương                              | Chi  |

### Thêm phiếu thủ công

Loại (Thu/Chi), Số tiền\*, Danh mục (Bổ sung quỹ, Rút quỹ, Chi điện/nước/mặt bằng, Chi khác... — Admin tự thêm danh mục mới), Ghi chú.
Xóa: chỉ áp dụng phiếu thủ công, có dialog xác nhận.

---

## 9. 🧮 THUẾ (mức đơn giản)

| Element                        | Chi tiết                                                            |
| ------------------------------ | ------------------------------------------------------------------- |
| Bật/tắt áp dụng thuế           | Toggle                                                              |
| % VAT mặc định                 | Áp dụng chung toàn bộ sản phẩm                                      |
| VAT theo sản phẩm _(tùy chọn)_ | Override riêng nếu cần, có thể để trống ở Phase 1                   |
| Cách tính                      | Giá đã gồm thuế / Giá + thuế cộng thêm — chọn 1, áp dụng thống nhất |

**Ảnh hưởng hóa đơn (POS):** hiển thị dòng Tạm tính → Thuế (VAT X%) → Tổng cộng, in trên bản in nếu đang bật.

> Chưa có báo cáo thuế riêng ở Phase 1 — mở rộng (khai thuế, báo cáo nộp thuế...) ở phase sau.

---

## 10. ⚙️ CÀI ĐẶT

> ⚠️ **Trạng thái: "Đang phát triển..."** — chưa đặc tả, bổ sung sau.

---

## 🔐 Ghi chú xuyên suốt — Phân quyền

| Trang                  | Admin | Thu ngân                |
| ---------------------- | ----- | ----------------------- |
| Toàn bộ 10 trang Admin | ✅    | ❌ (redirect về `/pos`) |
| POS (Bán hàng)         | ✅    | ✅                      |

---

_Cập nhật lần cuối: 08/2026 — Đặc tả chi tiết giao diện Admin, Phase 1_
