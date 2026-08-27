export interface AccessTokenPayload {
  userId: string;
  role: 'admin' | 'cashier';
}

export interface RefreshTokenPayload {
  userId: string;
  tokenVersion: number;
}

// Hình dạng employee trả về cho client — không bao giờ chứa password/resetPasswordTokenHash
export interface SafeEmployee {
  id: string;
  employeeCode: string;
  fullName: string;
  username: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'cashier';
  employmentStatus: 'active' | 'resigned';
  startDate?: Date;
  baseSalary?: number;
  createdAt: Date;
  updatedAt: Date;
}
