import {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { AUTH_TOKEN_KEY } from '../../utils/auth-utils';

const TENANT_COOKIE_KEY = 'tenant_id';

/**
 * Clear the session cache (call on sign out or 401)
 */
export function clearSessionCache() {
  return;
}

/**
 * Get tenant ID from cookie (browser-safe)
 */
function getTenantId(): string | null {
  if (typeof window === 'undefined') return null;

  // Try cookie first (more reliable)
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === TENANT_COOKIE_KEY) {
      return value;
    }
  }

  // Fallback to localStorage
  return localStorage.getItem(TENANT_COOKIE_KEY);
}

/**
 * Check if error is a 401 Unauthorized
 */
function isUnauthorizedError(error: AxiosError): boolean {
  return error.response?.status === 401;
}

/**
 * Handle 401 errors - clear cache and sign out
 */
async function handleUnauthorized() {
  if (typeof window === 'undefined') return;

  clearSessionCache();

  // Clear tenant from storage
  localStorage.removeItem(TENANT_COOKIE_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);
  document.cookie = `${TENANT_COOKIE_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  window.location.href = '/';
}

export const setupAuthInterceptor = (client: AxiosInstance) => {
  // Request interceptor - add auth headers
  client.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      try {
        const accessToken =
          typeof window !== 'undefined'
            ? localStorage.getItem(AUTH_TOKEN_KEY)
            : null;

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }

        const tenantId = getTenantId();
        if (tenantId) {
          config.headers['X-Tenant'] = tenantId;
        }
      } catch (error) {
        console.error('[auth-interceptor] Failed to append auth headers:', error);
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor - handle 401 errors
  client.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (isUnauthorizedError(error)) {
        // Avoid multiple simultaneous sign-outs
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retried?: boolean };

        if (!originalRequest._retried) {
          originalRequest._retried = true;
          await handleUnauthorized();
        }
      }

      return Promise.reject(error);
    }
  );
};
