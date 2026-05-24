import {
  getTenantId as getSharedTenantId,
  setTenantId as setSharedTenantId,
  clearTenantId,
  TENANT_ID_KEY,
} from '@@agrosphere/shared';

export const AUTH_TOKEN_KEY = 'auth_token';
export { TENANT_ID_KEY };

export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setAuthToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
}

export function removeAuthToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

// Re-export tenant functions from shared for backwards compatibility
export const getTenantId = getSharedTenantId;
export const setTenantId = setSharedTenantId;

export async function hasValidToken(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp > currentTime;
  } catch {
    return false;
  }
}

export function clearAuthData(): void {
  removeAuthToken();
  clearTenantId();
}
