/**
 * Format số tiền theo định dạng VND.
 * Dùng Intl.NumberFormat thay vì tự viết regex thay dấu phẩy —
 * chuẩn quốc tế, tự động xử lý đúng dấu phân cách hàng nghìn theo locale.
 */
export function formatVND(amount: number): string {
  const formattedNumber = new Intl.NumberFormat('vi-VN').format(amount);
  return `${formattedNumber}đ`;
}

/**
 * Format số tiền theo định dạng USD (dự phòng cho tương lai,
 * ví dụ nếu mở rộng thị trường quốc tế).
 */
export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Tính % giảm giá từ giá gốc và giá hiện tại.
 * Trả về số nguyên đã làm tròn, hoặc 0 nếu không có giảm giá / input không hợp lệ.
 */
export function calculateDiscountPercent(
  price: number,
  originalPrice: number,
): number {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}
/**
 * Chuyển chuỗi số tiền có định dạng VND (có dấu phẩy, có ký tự "đ") thành số nguyên.
 * Ví dụ: "1.234.567đ" => 1234567
 * Nếu input không hợp lệ, trả về 0.
 */
export function parseCurrency(value: string): number {
  const digitsOnly = value.replace(/[^0-9]/g, '');
  return digitsOnly ? parseInt(digitsOnly, 10) : 0;
}

/**
 * Format khoảng giá từ minPrice đến maxPrice theo định dạng VND.
 * Ví dụ: 1000000, 2000000 => "1.000.000đ - 2.000.000đ"
 * Nếu minPrice > maxPrice, trả về chuỗi rỗng.
 */
export function formatPriceRange(minPrice: number, maxPrice: number): string {
  return `${formatVND(minPrice)} - ${formatVND(maxPrice)}`;
}
