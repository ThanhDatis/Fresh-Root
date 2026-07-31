import type { Response } from 'express';
import jwt from 'jsonwebtoken';
import type { StringValue } from 'ms';

import { env } from '../config/env.config';
import {
  REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_PATH,
} from '../constants/auth.constants';
import { AppError } from '../errors/AppError';
import type {
  AccessTokenPayload,
  RefreshTokenPayload,
} from '../types/auth.types';

function generateAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as StringValue,
  });
}

function generateRefreshToken(payload: RefreshTokenPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as StringValue,
  });
}

function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new AppError(
      401,
      'Refresh token không hợp lệ hoặc đã hết hạn',
      'AUTH_REFRESH_TOKEN_INVALID',
    );
  }
}

function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: REFRESH_TOKEN_COOKIE_PATH,
    maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE_MS,
  });
}

function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: REFRESH_TOKEN_COOKIE_PATH,
  });
}

export const tokenService = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
