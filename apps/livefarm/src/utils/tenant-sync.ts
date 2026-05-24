/**
 * Tenant sync utilities
 *
 * Re-exports from @@agrosphere/shared for backwards compatibility.
 * New code should import directly from '@@agrosphere/shared'.
 */

export {
  TENANT_ID_KEY as TENANT_STORAGE_KEY,
  TENANT_ID_KEY as TENANT_COOKIE_NAME,
  setTenantId as setTenant,
  getTenantId as getTenant,
  clearTenantId as removeTenant,
  hasTenantId as hasTenant,
  syncTenantToCookie,
} from '@@agrosphere/shared';
