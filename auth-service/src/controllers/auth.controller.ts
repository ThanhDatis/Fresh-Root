import type { Request, Response } from 'express';

import { authService } from '../services/auth.service';
import { tokenService } from '../services/token.service';
import { sendSuccess } from '../utils/apiResponse';
import type {
  ChangePasswordInput,
  ForgotPasswordInput,
  GoogleLoginInput,
  LoginInput,
  RegisterInput,
  ResetPasswordInput,
  UpdateProfileInput,
} from '../validations/auth.validation';

async function register(req: Request, res: Response): Promise<void> {
  const result = await authService.register(req.body as RegisterInput);
  tokenService.setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, 201, 'Đăng ký thành công', {
    user: result.user,
    accessToken: result.accessToken,
  });
}

async function login(req: Request, res: Response): Promise<void> {
  const result = await authService.login(req.body as LoginInput);
  tokenService.setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, 200, 'Đăng nhập thành công', {
    user: result.user,
    accessToken: result.accessToken,
  });
}

async function googleLogin(req: Request, res: Response): Promise<void> {
  const result = await authService.googleLogin(req.body as GoogleLoginInput);
  tokenService.setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, 200, 'Đăng nhập bằng Google thành công', {
    user: result.user,
    accessToken: result.accessToken,
  });
}

async function refreshToken(req: Request, res: Response): Promise<void> {
  const result = await authService.refreshToken(req.refreshToken as string);
  tokenService.setRefreshTokenCookie(res, result.refreshToken);
  sendSuccess(res, 200, 'Làm mới token thành công', {
    accessToken: result.accessToken,
  });
}

function logout(_req: Request, res: Response): void {
  tokenService.clearRefreshTokenCookie(res);
  sendSuccess(res, 200, 'Đăng xuất thành công', null);
}

async function forgotPassword(req: Request, res: Response): Promise<void> {
  await authService.forgotPassword(req.body as ForgotPasswordInput);
  sendSuccess(
    res,
    200,
    'Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu',
    null,
  );
}

async function resetPassword(req: Request, res: Response): Promise<void> {
  await authService.resetPassword(req.body as ResetPasswordInput);
  sendSuccess(res, 200, 'Đặt lại mật khẩu thành công', null);
}

async function changePassword(req: Request, res: Response): Promise<void> {
  await authService.changePassword(
    req.user!.userId,
    req.body as ChangePasswordInput,
  );
  sendSuccess(res, 200, 'Đổi mật khẩu thành công', null);
}

async function getMe(req: Request, res: Response): Promise<void> {
  const user = await authService.getMe(req.user!.userId);
  sendSuccess(res, 200, 'Lấy thông tin người dùng thành công', { user });
}

async function updateProfile(req: Request, res: Response): Promise<void> {
  const user = await authService.updateProfile(
    req.user!.userId,
    req.body as UpdateProfileInput,
  );
  sendSuccess(res, 200, 'Cập nhật thông tin thành công', { user });
}

export const authController = {
  register,
  login,
  googleLogin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
};
