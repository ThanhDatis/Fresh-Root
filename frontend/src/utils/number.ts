/**
 * Giới hạn giá trị trong khoảng [min, max].
 * Dùng cho Quantity Selector (min=1, max=tồn kho) — tránh nhập số âm hoặc vượt tồn kho.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Tính % của một giá trị so với tổng.
 * Dùng cho: Rating bar chart (Reviews), Top Products progress bar, Category Performance.
 * Trả về 0 nếu total <= 0 để tránh chia cho 0 / NaN.
 */
export function calculatePercentage(value: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((value / total) * 100);
}
