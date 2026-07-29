import type { NextFunction, Request, Response } from 'express';

import { REFRESH_TOKEN_COOKIE_NAME } from '../constants/auth.constants';
import { AppError } from '../errors/AppError';

export function parseRefreshCookie(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE_NAME] as
    string | undefined;

  if (!refreshToken) {
    next(
      new AppError(
        401,
        'Refresh token không tồn tại',
        'AUTH_REFRESH_TOKEN_INVALID',
      ),
    );
    return;
  }

  req.refreshToken = refreshToken;
  next();
}
