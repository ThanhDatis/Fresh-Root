import type { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';

export const requireRole =
  (...roles: Array<'customer' | 'admin'>) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      next(
        new AppError(
          403,
          'Bạn không có quyền thực hiện thao tác này',
          'AUTH_FORBIDDEN',
        ),
      );
      return;
    }
    next();
  };
