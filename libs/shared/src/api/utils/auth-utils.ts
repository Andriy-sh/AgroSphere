import {
  getTenantId as getTenantIdFromUtil,
  setTenantId as setTenantIdFromUtil,
  clearTenantId,
  TENANT_ID_KEY,
} from '../../utils/tenant';

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

// Re-export from centralized tenant utility for backwards compatibility
export const getTenantId = getTenantIdFromUtil;
export const setTenantId = setTenantIdFromUtil;
export { clearTenantId };

/**
 * Set tenant with optional data clearing
 * @deprecated Use setTenantId from '@@agrosphere/shared' instead
 */
export function setTenant(tenantId: string, clearOldData = true): void {
  if (typeof window === 'undefined') return;

  if (clearOldData) {
    clearTenantData();
  }

  setTenantIdFromUtil(tenantId);
}

/**
 * Get tenant from cookie
 * @deprecated Use getTenantId from '@@agrosphere/shared' instead (checks both cookie and localStorage)
 */
export function getTenantFromCookie(): string | null {
  if (typeof window === 'undefined') return null;
  const cookies = document.cookie.split(';');
  const tenantCookie = cookies.find((c) =>
    c.trim().startsWith(`${TENANT_ID_KEY}=`)
  );
  if (tenantCookie) {
    return tenantCookie.split('=')[1]?.trim() || null;
  }
  return null;
}

/**
 * Clear tenant data from storage and cookies
 */
export function clearTenantData(): void {
  clearTenantId();
}

export function clearAuthData(): void {
  removeAuthToken();
  clearTenantId();
}
