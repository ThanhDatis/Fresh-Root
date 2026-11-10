import type { NextFunction, Request, Response } from 'express';

import { env } from '../config/env.config';
import { AppError } from '../errors/AppError';
import type { ApiErrorResponse } from '../types/apiResponse.types';

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // pino-http khai báo req.id là string | number | object; genReqId của mình luôn trả string
  const requestId =
    typeof req.id === 'string' || typeof req.id === 'number'
      ? String(req.id)
      : undefined;

  if (err instanceof AppError) {
    req.log.warn({ err, code: err.code }, err.message);

    const body: ApiErrorResponse = {
      success: false,
      message: err.message,
      ...(err.errors !== undefined ? { errors: err.errors } : {}),
      ...(requestId !== undefined ? { requestId } : {}),
    };
    res.status(err.statusCode).json(body);
    return;
  }

  req.log.error({ err }, 'Unhandled error');

  const message =
    env.NODE_ENV === 'production'
      ? 'Đã có lỗi xảy ra, vui lòng thử lại'
      : err instanceof Error
        ? err.message
        : 'Unknown error';

  const body: ApiErrorResponse = {
    success: false,
    message,
    ...(requestId !== undefined ? { requestId } : {}),
  };
  res.status(500).json(body);
}
