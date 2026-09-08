import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import { AppError } from '../errors/AppError';

export const validateObjectId =
  (...paramNames: string[]) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    for (const paramName of paramNames) {
      const value = req.params[paramName];
      if (typeof value !== 'string' || !mongoose.Types.ObjectId.isValid(value)) {
        next(new AppError(400, `${paramName} không hợp lệ`, 'VALIDATION_INVALID_OBJECT_ID'));
        return;
      }
    }
    next();
  };