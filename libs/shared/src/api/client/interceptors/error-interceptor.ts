import { AxiosInstance, AxiosError } from 'axios';

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * Normalize error response into a consistent format
 */
function normalizeError(error: AxiosError): ApiError {
  const status = error.response?.status || 0;
  const data = error.response?.data as Record<string, unknown> | undefined;

  // Extract message from various response formats
  const message =
    (data?.message as string) ||
    (data?.error as string) ||
    error.message ||
    'An unexpected error occurred';

  return {
    status,
    message,
    code: data?.code as string | undefined,
    details: data?.details,
  };
}

/**
 * Log error for debugging (only in development)
 */
function logError(error: AxiosError, normalized: ApiError): void {
  if (process.env.NODE_ENV !== 'development') return;

  const { method, url } = error.config || {};
  console.error(`[API Error] ${method?.toUpperCase()} ${url}`, {
    status: normalized.status,
    message: normalized.message,
    code: normalized.code,
  });
}

export const setupErrorInterceptor = (client: AxiosInstance) => {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      // Network error or timeout
      if (!error.response) {
        const networkError: ApiError = {
          status: 0,
          message: error.code === 'ECONNABORTED'
            ? 'Request timed out'
            : 'Network error - please check your connection',
          code: error.code,
        };

        if (process.env.NODE_ENV === 'development') {
          console.error('[API Error] Network error:', error.message);
        }

        return Promise.reject(networkError);
      }

      const normalized = normalizeError(error);
      logError(error, normalized);

      // Attach normalized error to the original error for handlers that need both
      (error as AxiosError & { apiError: ApiError }).apiError = normalized;

      return Promise.reject(error);
    }
  );
};
