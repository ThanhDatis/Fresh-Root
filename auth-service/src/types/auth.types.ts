export interface AccessTokenPayload {
  userId: string;
  role: 'customer' | 'admin';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

// Hình dạng user trả về cho client — không bao giờ chứa password/resetPasswordTokenHash
export interface SafeUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  authProvider: 'local' | 'google';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
