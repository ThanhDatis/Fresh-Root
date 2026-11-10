export interface AccessTokenPayload {
  userId: string;
  role: 'admin' | 'cashier';
  // Tùy chọn: token cấp trước khi auth-service bổ sung fullName không có field này
  fullName?: string;
}
