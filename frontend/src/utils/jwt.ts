/**
 * Decode phần payload của JWT (base64url), không verify chữ ký.
 * Chỉ dùng cho mục đích đọc thông tin (vd. role) để điều hướng UI —
 * bảo mật thật sự do backend verify ở middleware đảm nhiệm.
 */
export function decodeJwtPayload<T>(token: string): T | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json =
      typeof window === 'undefined'
        ? Buffer.from(base64, 'base64').toString('utf-8')
        : decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + c.charCodeAt(0).toString(16).padStart(2, '0'))
              .join(''),
          );
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
