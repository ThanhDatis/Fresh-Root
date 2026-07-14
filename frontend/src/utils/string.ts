/**
 * Chuyển text tiếng Việt có dấu thành slug không dấu.
 * Dùng cho Category slug, Product slug (auto-generate từ tên).
 */
export function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // bỏ dấu
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // bỏ ký tự đặc biệt
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Cắt ngắn text và thêm "..." nếu vượt quá độ dài cho phép.
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

/**
 * Viết hoa chữ cái đầu tiên của chuỗi.
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Loại bỏ khoảng trắng thừa trong chuỗi, chỉ giữ lại 1 khoảng trắng giữa các từ.
 * Ví dụ: "  Nguyễn   Văn   A  " => "Nguyễn Văn A"
 */
export function removeExtraSpaces(text: string): string {
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Lấy chữ cái đầu tiên của mỗi từ trong tên đầy đủ, viết hoa.
 * Ví dụ: "Nguyễn Văn A" => "NVA"
 * maxChars: số ký tự tối đa trong kết quả (mặc định 2).
 * Nếu fullName rỗng, trả về chuỗi rỗng.
 */
export function initials(fullName: string, maxChars = 2): string {
  const words = removeExtraSpaces(fullName).split(' ').filter(Boolean);
  if (words.length === 0) return '';
  return words
    .map((word) => word.charAt(0).toUpperCase())
    .slice(-maxChars)
    .join('');
}
