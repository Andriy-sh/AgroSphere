import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Format request duration
 */
function formatDuration(startTime: number): string {
  const duration = Date.now() - startTime;
  return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
}

/**
 * Get color for status code (for console styling)
 */
function getStatusColor(status: number): string {
  if (status >= 500) return '\x1b[31m'; // Red
  if (status >= 400) return '\x1b[33m'; // Yellow
  if (status >= 300) return '\x1b[36m'; // Cyan
  return '\x1b[32m'; // Green
}

const RESET_COLOR = '\x1b[0m';

export const setupLoggingInterceptor = (client: AxiosInstance) => {
  if (!isDevelopment) return;

  // Track request start times
  const requestTimings = new Map<string, number>();

  client.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const requestId = `${config.method}-${config.url}-${Date.now()}`;
      (config as InternalAxiosRequestConfig & { _requestId: string })._requestId = requestId;
      requestTimings.set(requestId, Date.now());

      console.log(
        `[API] → ${config.method?.toUpperCase()} ${config.url}`,
        config.params ? { params: config.params } : ''
      );

      return config;
    },
    (error) => {
      console.error('[API] Request error:', error.message);
      return Promise.reject(error);
    }
  );

  client.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as InternalAxiosRequestConfig & { _requestId?: string };
      const requestId = config._requestId;
      const startTime = requestId ? requestTimings.get(requestId) : undefined;

      const duration = startTime ? formatDuration(startTime) : '?';
      const statusColor = getStatusColor(response.status);

      console.log(
        `[API] ← ${statusColor}${response.status}${RESET_COLOR} ${config.method?.toUpperCase()} ${config.url} (${duration})`
      );

      if (requestId) requestTimings.delete(requestId);
      return response;
    },
    (error) => {
      const config = error.config as InternalAxiosRequestConfig & { _requestId?: string } | undefined;
      const requestId = config?._requestId;
      const startTime = requestId ? requestTimings.get(requestId) : undefined;

      const duration = startTime ? formatDuration(startTime) : '?';
      const status = error.response?.status || 'ERR';
      const statusColor = getStatusColor(typeof status === 'number' ? status : 500);

      console.log(
        `[API] ← ${statusColor}${status}${RESET_COLOR} ${config?.method?.toUpperCase()} ${config?.url} (${duration})`,
        error.response?.data?.message || error.message
      );

      if (requestId) requestTimings.delete(requestId);
      return Promise.reject(error);
    }
  );
};
