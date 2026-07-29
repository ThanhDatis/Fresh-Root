import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.email('Email không hợp lệ'),
  password: z.string().min(8, 'Password phải có ít nhất 8 ký tự'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Password không được để trống'),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const googleLoginSchema = z.object({
  idToken: z.string().min(1, 'idToken không được để trống'),
});
export type GoogleLoginInput = z.infer<typeof googleLoginSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email('Email không hợp lệ'),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  email: z.email('Email không hợp lệ'),
  token: z.string().min(1, 'Token không được để trống'),
  newPassword: z.string().min(8, 'Password phải có ít nhất 8 ký tự'),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Vui lòng nhập mật khẩu cũ'),
  newPassword: z.string().min(8, 'Password phải có ít nhất 8 ký tự'),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').optional(),
  phone: z.string().min(1, 'Số điện thoại không hợp lệ').optional(),
  avatar: z.url('Avatar phải là URL hợp lệ').optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
