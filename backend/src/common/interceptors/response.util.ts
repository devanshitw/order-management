export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T | null;
  message?: string;
  errors?: unknown;
  meta?: unknown;
  status_code: number;
}

export function successResponse<T = unknown>(
  data: T,
  message?: string,
  meta?: unknown,
  status_code?: number,
): ApiResponse<T> {
  return {
    success: true,
    data,
    message: message ?? 'OK',
    meta: meta ?? null,
    status_code: status_code ?? 200,
  };
}

export function errorResponse(
  message?: string,
  errors?: unknown,
  status_code?: number,
): ApiResponse<null> {
  return {
    success: false,
    data: null,
    message: message ?? 'An error occurred',
    errors: errors ?? null,
    status_code: status_code ?? 400,
  };
}
