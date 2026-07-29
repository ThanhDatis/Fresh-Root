import type { Request, Response } from 'express';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { authController } from '../controllers/auth.controller';
import { parseRefreshCookie } from '../middlewares/parseRefreshCookie.middleware';
import { validate } from '../middlewares/validate.middleware';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import type { ApiErrorResponse } from '../types/apiResponse.types';
import {
  changePasswordSchema,
  forgotPasswordSchema,
  googleLoginSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from '../validations/auth.validation';

function rateLimitHandler(_req: Request, res: Response): void {
  const body: ApiErrorResponse = {
    success: false,
    message: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
  };
  res.status(429).json(body);
}

function createRateLimiter(windowMs: number, limit: number) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: rateLimitHandler,
  });
}

// Rate limiting theo mục 10 auth-service.md
const loginLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 lần / 15 phút / IP
const forgotPasswordLimiter = createRateLimiter(60 * 60 * 1000, 3); // 3 lần / giờ / IP
const resetPasswordLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 lần / 15 phút / IP

const router = Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng ký tài khoản mới (local)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *       400:
 *         description: Dữ liệu không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Email đã tồn tại
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập email + password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *       401:
 *         description: Sai email hoặc mật khẩu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       403:
 *         description: Tài khoản đã bị khoá
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       429:
 *         description: Quá nhiều lần thử (rate limit 5 lần / 15 phút / IP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/login',
  loginLimiter,
  validate(loginSchema),
  authController.login,
);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng nhập/Đăng ký qua Google ID Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/GoogleLoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập bằng Google thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthSuccessResponse'
 *       401:
 *         description: ID Token Google không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       409:
 *         description: Email đã đăng ký bằng local
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/google', validate(googleLoginSchema), authController.googleLogin);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     tags: [Auth]
 *     summary: Cấp lại Access Token mới từ Refresh Token cookie
 *     description: Đọc refreshToken từ HttpOnly cookie (browser tự gửi kèm khi test qua Swagger UI, không cần nhập gì thêm).
 *     responses:
 *       200:
 *         description: Làm mới token thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefreshSuccessResponse'
 *       401:
 *         description: Refresh token thiếu/sai/hết hạn/đã bị thu hồi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/refresh-token', parseRefreshCookie, authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     tags: [Auth]
 *     summary: Đăng xuất (thu hồi refresh token hiện tại, xoá cookie)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Đăng xuất thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnlyResponse'
 *       401:
 *         description: Chưa đăng nhập / access token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     tags: [Auth]
 *     summary: Gửi email chứa link reset mật khẩu
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForgotPasswordRequest'
 *     responses:
 *       200:
 *         description: Luôn trả về thành công dù email có tồn tại hay không (tránh lộ thông tin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnlyResponse'
 *       429:
 *         description: Quá nhiều lần thử (rate limit 3 lần / giờ / IP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/forgot-password',
  forgotPasswordLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     tags: [Auth]
 *     summary: Đặt lại mật khẩu bằng token trong link email
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPasswordRequest'
 *     responses:
 *       200:
 *         description: Đặt lại mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnlyResponse'
 *       400:
 *         description: Token reset password sai hoặc hết hạn
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       429:
 *         description: Quá nhiều lần thử (rate limit 5 lần / 15 phút / IP)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.post(
  '/reset-password',
  resetPasswordLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

/**
 * @swagger
 * /auth/change-password:
 *   patch:
 *     tags: [Auth]
 *     summary: Đổi mật khẩu (yêu cầu nhập mật khẩu cũ)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequest'
 *     responses:
 *       200:
 *         description: Đổi mật khẩu thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageOnlyResponse'
 *       401:
 *         description: Chưa đăng nhập / mật khẩu cũ không đúng
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/change-password',
  verifyToken,
  validate(changePasswordSchema),
  authController.changePassword,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Lấy thông tin người dùng đang đăng nhập
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Chưa đăng nhập / access token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.get('/me', verifyToken, authController.getMe);

/**
 * @swagger
 * /auth/profile:
 *   patch:
 *     tags: [Auth]
 *     summary: Cập nhật thông tin cơ bản (fullName, phone, avatar)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Chưa đăng nhập / access token không hợp lệ
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
router.patch(
  '/profile',
  verifyToken,
  validate(updateProfileSchema),
  authController.updateProfile,
);

export default router;
