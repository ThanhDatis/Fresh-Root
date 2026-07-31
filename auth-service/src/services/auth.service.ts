import { OAuth2Client } from 'google-auth-library';

import { env } from '../config/env.config';
import { AppError } from '../errors/AppError';
import type { IUser } from '../models/user.model';
import {
  userRepository,
  type UserDocument,
} from '../repositories/user.repository';
import type { SafeUser } from '../types/auth.types';
import { comparePassword, hashPassword } from '../utils/hash';
import { generateRawResetToken, hashResetToken } from '../utils/resetToken';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../validations/auth.validation';
import { mailService } from './mail.service';
import { tokenService } from './token.service';

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID);

function toSafeUser(user: UserDocument): SafeUser {
  return {
    id: user._id.toString(),
    fullName: user.fullName,
    email: user.email,
    ...(user.phone !== undefined ? { phone: user.phone } : {}),
    ...(user.avatar !== undefined ? { avatar: user.avatar } : {}),
    role: user.role,
    authProvider: user.authProvider,
    isActive: user.isActive,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function issueTokens(user: UserDocument): {
  accessToken: string;
  refreshToken: string;
} {
  const accessToken = tokenService.generateAccessToken({
    userId: user._id.toString(),
    role: user.role,
  });
  const refreshToken = tokenService.generateRefreshToken({
    userId: user._id.toString(),
    tokenVersion: user.refreshTokenVersion,
  });
  return { accessToken, refreshToken };
}

interface AuthResult {
  user: SafeUser;
  accessToken: string;
  refreshToken: string;
}

// 4.1. Register
async function register(input: RegisterInput): Promise<AuthResult> {
  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new AppError(
      409,
      'Email đã được đăng ký',
      'AUTH_EMAIL_ALREADY_EXISTS',
    );
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await userRepository.create({
    fullName: input.fullName,
    email: input.email,
    password: hashedPassword,
    authProvider: 'local',
    role: 'customer',
  });

  const { accessToken, refreshToken } = issueTokens(user);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

// 4.2. Login
async function login(input: LoginInput): Promise<AuthResult> {
  const user = await userRepository.findByEmail(input.email, true);

  if (!user || user.authProvider !== 'local' || !user.password) {
    throw new AppError(
      401,
      'Sai email hoặc mật khẩu',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  const isMatch = await comparePassword(input.password, user.password);
  if (!isMatch) {
    throw new AppError(
      401,
      'Sai email hoặc mật khẩu',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  if (!user.isActive) {
    throw new AppError(403, 'Tài khoản đã bị khoá', 'AUTH_ACCOUNT_BLOCKED');
  }

  const { accessToken, refreshToken } = issueTokens(user);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

// 4.3. Google Login
async function googleLogin(input: GoogleLoginInput): Promise<AuthResult> {
  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: input.idToken,
      audience: env.GOOGLE_CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch {
    throw new AppError(
      401,
      'ID Token Google không hợp lệ',
      'AUTH_GOOGLE_TOKEN_INVALID',
    );
  }

  if (!payload?.email || !payload.sub) {
    throw new AppError(
      401,
      'ID Token Google không hợp lệ',
      'AUTH_GOOGLE_TOKEN_INVALID',
    );
  }

  let user = await userRepository.findByGoogleId(payload.sub);

  if (!user) {
    const existingLocalUser = await userRepository.findByEmail(payload.email);
    if (existingLocalUser) {
      throw new AppError(
        409,
        'Email này đã đăng ký bằng mật khẩu, vui lòng đăng nhập bằng email/password',
        'AUTH_EMAIL_REGISTERED_WITH_LOCAL',
      );
    }

    const createData: Partial<IUser> = {
      authProvider: 'google',
      googleId: payload.sub,
      fullName: payload.name ?? payload.email,
      email: payload.email,
      role: 'customer',
      emailVerified: payload.email_verified ?? false,
      ...(payload.picture !== undefined ? { avatar: payload.picture } : {}),
    };

    user = await userRepository.create(createData);
  }

  const { accessToken, refreshToken } = issueTokens(user);

  return { user: toSafeUser(user), accessToken, refreshToken };
}

// 4.4. Refresh Token
async function refreshToken(
  rawRefreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const payload = tokenService.verifyRefreshToken(rawRefreshToken);

  const user = await userRepository.findById(payload.userId);
  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  if (user.refreshTokenVersion !== payload.tokenVersion) {
    throw new AppError(
      401,
      'Refresh token đã bị thu hồi',
      'AUTH_REFRESH_TOKEN_INVALID',
    );
  }

  return issueTokens(user);
}

// 4.6. Forgot Password
async function forgotPassword(input: ForgotPasswordInput): Promise<void> {
  const user = await userRepository.findByEmail(input.email);

  if (!user) {
    return;
  }

  const rawToken = generateRawResetToken();
  const tokenHash = hashResetToken(rawToken);
  const expiresAt = new Date(
    Date.now() + env.RESET_PASSWORD_TOKEN_EXPIRY_MINUTES * 60 * 1000,
  );

  await userRepository.updateById(user._id, {
    resetPasswordTokenHash: tokenHash,
    resetPasswordExpires: expiresAt,
  });

  await mailService.sendResetPasswordEmail(user.email, rawToken);
}

// 4.7. Reset Password
async function resetPassword(input: ResetPasswordInput): Promise<void> {
  const user = await userRepository.findByEmail(input.email);

  if (!user) {
    throw new AppError(
      400,
      'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      'AUTH_RESET_TOKEN_INVALID',
    );
  }

  const tokenHash = hashResetToken(input.token);
  const isTokenValid =
    user.resetPasswordTokenHash === tokenHash &&
    user.resetPasswordExpires !== undefined &&
    user.resetPasswordExpires.getTime() > Date.now();

  if (!isTokenValid) {
    throw new AppError(
      400,
      'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn',
      'AUTH_RESET_TOKEN_INVALID',
    );
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await userRepository.updateById(user._id, { password: hashedPassword });
  await userRepository.clearResetPasswordToken(user._id);
  await userRepository.incrementRefreshTokenVersion(user._id);
}

// 4.8. Change Password
async function changePassword(
  userId: string,
  input: ChangePasswordInput,
): Promise<void> {
  const user = await userRepository.findById(userId, true);

  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  const isMatch = user.password
    ? await comparePassword(input.oldPassword, user.password)
    : false;
  if (!isMatch) {
    throw new AppError(
      401,
      'Mật khẩu cũ không đúng',
      'AUTH_INVALID_CREDENTIALS',
    );
  }

  const hashedPassword = await hashPassword(input.newPassword);

  await userRepository.updateById(user._id, { password: hashedPassword });
  await userRepository.incrementRefreshTokenVersion(user._id);
}

// 4.9. Update Profile
async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<SafeUser> {
  const update: Partial<IUser> = {
    ...(input.fullName !== undefined ? { fullName: input.fullName } : {}),
    ...(input.phone !== undefined ? { phone: input.phone } : {}),
    ...(input.avatar !== undefined ? { avatar: input.avatar } : {}),
  };

  const user = await userRepository.updateById(userId, update);
  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  return toSafeUser(user);
}

// GET /auth/me
async function getMe(userId: string): Promise<SafeUser> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new AppError(404, 'Không tìm thấy người dùng', 'AUTH_USER_NOT_FOUND');
  }

  return toSafeUser(user);
}

export const authService = {
  register,
  login,
  googleLogin,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
  getMe,
};
