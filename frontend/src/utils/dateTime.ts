import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);
dayjs.locale('vi'); // Default locale — sẽ có setLocale() để đổi khi làm i18n

/**
 * Đổi locale toàn cục cho dayjs (dùng khi bổ sung config đa ngôn ngữ VN/EN).
 */
export function setDateLocale(locale: 'vi' | 'en'): void {
  dayjs.locale(locale);
}

/**
 * Format ngày theo pattern chỉ định, mặc định DD/MM/YYYY (chuẩn VN).
 */
export function formatDate(
  date: string | Date,
  pattern = 'DD/MM/YYYY',
): string {
  return dayjs(date).format(pattern);
}

/**
 * Trả về thời gian tương đối, ví dụ "2 ngày trước" (dùng locale hiện tại của dayjs).
 * Dùng cho Reviews, Order timeline, Blog "đăng X ngày trước".
 */
export function getRelativeTime(date: string | Date): string {
  return dayjs(date).fromNow();
}

/**
 * Ước tính thời gian đọc bài blog dựa trên số từ.
 * Công thức chuẩn: ~200 từ/phút cho tiếng Việt, làm tròn lên, tối thiểu 1 phút.
 */
export function estimateReadingTime(
  wordCount: number,
  wordsPerMinute = 200,
): number {
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Kiểm tra xem ngày có phải là hôm nay hay không.
 */
export function isToday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs(), 'day');
}

/**
 * Kiểm tra xem ngày có phải là hôm qua hay không.
 */
export function isYesterday(date: string | Date): boolean {
  return dayjs(date).isSame(dayjs().subtract(1, 'day'), 'day');
}

/**
 * Kiểm tra xem ngày có hợp lệ hay không.
 * Dùng để validate input ngày tháng từ user (ví dụ: form đặt hàng, form blog).
 */
export function isValidDate(date: unknown): boolean {
  return dayjs(date as string | Date).isValid();
}
