import type { Response } from 'express';

import type {
  ApiPaginatedResponse,
  ApiSuccessResponse,
  Pagination,
} from '../types/apiResponse.types';

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
): void {
  const body: ApiSuccessResponse<T> = { success: true, message, data };
  res.status(statusCode).json(body);
}

export function sendPaginated<T>(
  res: Response,
  message: string,
  data: T[],
  pagination: Pagination,
): void {
  const body: ApiPaginatedResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };
  res.status(200).json(body);
}
