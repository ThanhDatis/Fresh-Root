import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { env } from '../config/env.config';
import { AppError } from '../errors/AppError';
import type { AccessTokenPayload } from '../types/auth.types';

export function verifyToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Chưa đăng nhập', 'AUTH_TOKEN_INVALID'));
    return;
  }

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = jwt.verify(
      token,
      env.JWT_ACCESS_SECRET,
    ) as AccessTokenPayload;
    req.user = { userId: payload.userId, role: payload.role };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError(401, 'Access token đã hết hạn', 'AUTH_TOKEN_EXPIRED'));
      return;
    }
    next(new AppError(401, 'Access token không hợp lệ', 'AUTH_TOKEN_INVALID'));
  }
}
