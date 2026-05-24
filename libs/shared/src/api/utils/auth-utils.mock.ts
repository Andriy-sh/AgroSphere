// Mock auth utilities for Storybook
export const AUTH_TOKEN_KEY = 'auth_token';
export const TENANT_ID_KEY = 'tenant_id';

export async function getAuthToken(): Promise<string | null> {
  console.log('Mock getAuthToken called');
  return 'mock-token';
}

export async function hasValidToken(): Promise<boolean> {
  console.log('Mock hasValidToken called');
  return true;
}

export function setAuthToken(token: string): void {
  console.log('Mock setAuthToken called with:', token);
}

export function removeAuthToken(): void {
  console.log('Mock removeAuthToken called');
}

export function getTenantId(): string | null {
  console.log('Mock getTenantId called');
  return 'mock-tenant-id';
}

export function setTenantId(tenantId: string): void {
  console.log('Mock setTenantId called with:', tenantId);
}

export function setTenant(tenantId: string, clearOldData = true): void {
  if (clearOldData) {
    clearTenantData();
  }
}

export function getTenantFromCookie(): string | null {
  console.log('Mock getTenantFromCookie called');
  return 'mock-tenant-id';
}

export function clearTenantData(): void {
  console.log('Mock clearTenantData called');
}

export function clearAuthData(): void {
  console.log('Mock clearAuthData called');
}
