const VN_PHONE_REGEX = /^0\d{9}$/;

// Đưa mọi biến thể về dạng 0xxxxxxxxx: bỏ khoảng trắng/dấu chấm/gạch/ngoặc, +84 hoặc 84 → 0.
// Không tự xóa ký tự lạ (chữ cái...) — để isValidPhone() bắt lỗi thay vì "sửa" sai dữ liệu
export function normalizePhone(raw: string): string {
  const compact = raw.trim().replace(/[\s.\-()]/g, '');

  if (compact.startsWith('+84')) {
    return `0${compact.slice(3)}`;
  }
  if (compact.startsWith('84') && compact.length === 11) {
    return `0${compact.slice(2)}`;
  }
  return compact;
}

export function isValidPhone(phone: string): boolean {
  return VN_PHONE_REGEX.test(phone);
}
