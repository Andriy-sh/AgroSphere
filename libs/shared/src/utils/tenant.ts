/**
 * Centralized tenant management utility
 *
 * Handles tenant ID storage in both localStorage (client state) and
 * cookies (for server/middleware access).
 */

export const TENANT_ID_KEY = 'tenant_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

/**
 * Get tenant ID from cookie
 */
function getTenantFromCookie(): string | null {
  if (!isBrowser()) return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === TENANT_ID_KEY) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

/**
 * Set tenant ID in cookie
 */
function setTenantCookie(tenantId: string): void {
  if (!isBrowser()) return;

  document.cookie = `${TENANT_ID_KEY}=${encodeURIComponent(tenantId)}; path=/; secure; samesite=lax; max-age=${COOKIE_MAX_AGE}`;
}

/**
 * Clear tenant ID cookie
 */
function clearTenantCookie(): void {
  if (!isBrowser()) return;

  document.cookie = `${TENANT_ID_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
}

/**
 * Get tenant ID (checks cookie first, then localStorage)
 */
export function getTenantId(): string | null {
  if (!isBrowser()) return null;

  // Cookie is the source of truth (accessible by middleware)
  const fromCookie = getTenantFromCookie();
  if (fromCookie) return fromCookie;

  // Fallback to localStorage
  return localStorage.getItem(TENANT_ID_KEY);
}

/**
 * Set tenant ID in both cookie and localStorage
 */
export function setTenantId(tenantId: string): void {
  if (!isBrowser()) return;

  // Set in cookie (for middleware/server access)
  setTenantCookie(tenantId);

  // Set in localStorage (for client-side access)
  localStorage.setItem(TENANT_ID_KEY, tenantId);
}

/**
 * Clear tenant ID from both cookie and localStorage
 */
export function clearTenantId(): void {
  if (!isBrowser()) return;

  clearTenantCookie();
  localStorage.removeItem(TENANT_ID_KEY);
}

/**
 * Check if tenant ID is set
 */
export function hasTenantId(): boolean {
  return getTenantId() !== null;
}

/**
 * Sync localStorage tenant to cookie
 * Call this on app initialization to ensure consistency
 */
export function syncTenantToCookie(): void {
  if (!isBrowser()) return;

  const fromStorage = localStorage.getItem(TENANT_ID_KEY);
  const fromCookie = getTenantFromCookie();

  // If localStorage has a value but cookie doesn't, sync to cookie
  if (fromStorage && !fromCookie) {
    setTenantCookie(fromStorage);
  }
}
