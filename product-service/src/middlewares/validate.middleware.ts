import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';

import { AppError } from '../errors/AppError';
import type { ApiError } from '../types/apiResponse.types';

type RequestPart = 'body' | 'query' | 'params';

export const validate =
  (schema: ZodType, part: RequestPart = 'body') =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[part]);

    if (!result.success) {
      const errors: ApiError[] = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: 'VALIDATION_' + issue.code.toUpperCase(),
      }));
      next(new AppError(400, 'Dữ liệu không hợp lệ', 'VALIDATION_FAILED', errors));
      return;
    }

    switch (part) {
      case 'body':
        req.body = result.data;
        break;
      case 'query':
        // Express 5: req.query là getter-only, không gán trực tiếp được — phải defineProperty để ghi đè
        Object.defineProperty(req, 'query', {
          value: result.data,
          writable: true,
          enumerable: true,
          configurable: true,
        });
        break;
      case 'params':
        req.params = result.data as Request['params'];
        break;
    }

    next();
  };