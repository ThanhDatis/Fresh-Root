import type { Response } from 'express';

import type { ApiSuccessResponse } from '../types/apiResponse.types';

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): void {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}
