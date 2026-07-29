// ---------- Success ----------
export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  message: string;
  data: T[];
  pagination: Pagination;
}

// ---------- Error ----------
export interface ApiError {
  field?: string;
  message: string;
  code?: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ApiError[];
  requestId?: string;
}

// ---------- Union ----------
export type ApiResponse<T> =
  ApiSuccessResponse<T> | ApiPaginatedResponse<T> | ApiErrorResponse;
