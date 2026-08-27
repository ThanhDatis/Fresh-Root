import { AppError } from '../errors/AppError';
import {
  employeeRepository,
  type EmployeeDocument,
} from '../repositories/employee.repository';
import { env } from '../config/env.config';
import type { SafeEmployee } from '../types/auth.types';
import { comparePassword, hashPassword } from '../utils/hash';
import { toSafeEmployee } from '../utils/employeeMapper';
import { generateRawResetToken, hashResetToken } from '../utils/resetToken';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  LoginInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../validations/auth.validation';
import { mailService } from './mail.service';
import { tokenService } from './token.service';

function issueTokens(employee: EmployeeDocument): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = tokenService.generateAccessToken({
    userId: employee._id.toString(),
    role: employee.role,
  });
  const refreshToken = tokenService.generateRefreshToken({
    userId: employee._id.toString(),
    tokenVersion: employee.refreshTokenVersion,
  });
  return { accessToken, refreshToken };
}

interface AuthResult {
  user: SafeEmployee;
  accessToken: string;
  refreshToken: string;
}

// 5.2. Login
async function login(input: LoginInput): Promise<AuthResult> {
  const employee = await employeeRepository.findByUsername(
    input.username,
    true,
  );

  if (!employee) {
    throw new AppError(
      401,
      'Sai username hoặc mật khẩu',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  const isMatch = await comparePassword(input.password, employee.password);
  if (!isMatch) {
    throw new AppError(
      401,
      'Sai username hoặc mật khẩu',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  if (employee.employmentStatus === 'resigned') {
    throw new AppError(
      403,
      'Tài khoản đã ngừng hoạt động',
      'AUTH_ACCOUNT_RESIGNED',
    );
  }

  const { accessToken, refreshToken } = issueTokens(employee);

  return { user: toSafeEmployee(employee), accessToken, refreshToken };
}

// 5.3. Refresh Token
async function refreshToken(
  rawRefreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = tokenService.verifyRefreshToken(rawRefreshToken);

  const employee = await employeeRepository.findById(payload.userId);
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  if (employee.refreshTokenVersion !== payload.tokenVersion) {
    throw new AppError(
      401,
      'Refresh token đã bị thu hồi',
      'AUTH_REFRESH_TOKEN_INVALID',
    );
  }

  return issueTokens(employee);
}

// 5.5. Forgot Password
async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const employee = await employeeRepository.findByEmail(input.email);

  if (!employee) {
    return;
  }

  const rawToken = generateRawResetToken();
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(
    Date.now() + env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES * 60 * 1000,
  );

  await employeeRepository.updateById(employee._id, {
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: expiresAt,
  });

  await mailService.sendResetPasswordEmail(
    employee.email ?? input.email,
    rawToken,
  );
}

// 5.6. Reset Password
async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const employee = await employeeRepository.findByEmail(input.email);

  if (!employee) {
    throw new AppError(
      400,
      'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      'AUTH_RESET_TOKEN_INVALID',
    );
  }

  const tokenHash = hashResetToken(input.token);
  const isTokenValid =
    employee.resetPasswordTokenHash === tokenHash &&
    employee.resetPasswordExpires !== undefined &&
    employee.resetPasswordExpires.getTime() > Date.now();

  if (!isTokenValid) {
    throw new AppError(
      400,
      'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      'AUTH_RESET_TOKEN_INVALID',
    );
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await employeeRepository.updateById(employee._id, {
    password: hashedPassword,
  });
  await employeeRepository.clearResetPasswordToken(employee._id);
  await employeeRepository.incrementRefreshTokenVersion(employee._id);
}

// 5.7. Change Password
async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const employee = await employeeRepository.findById(userId, true);

  if (!employee) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  const isMatch = await comparePassword(input.oldPassword, employee.password);
  if (!isMatch) {
    throw new AppError(
      401,
      'Mật khẩu cũ không đúng',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await employeeRepository.updateById(employee._id, {
    password: hashedPassword,
  });
  await employeeRepository.incrementRefreshTokenVersion(employee._id);
}

// 5.8. Update Profile
async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<SafeEmployee> {
  const update = {
    ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
  };

  const employee = await employeeRepository.updateById(userId, update);
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  return toSafeEmployee(employee);
}

// GET /auth/me
async function getMe(userId: string): Promise<SafeEmployee> {
  const employee = await employeeRepository.findById(userId);
  if (!employee) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  return toSafeEmployee(employee);
}

export const authService = {
  login,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getMe,
};
