import { clearTenantData, setTenant } from '../../utils/auth-utils';
import { useOrganisationsStore } from '../../../stores/useOrganisationsStore';
import type { Tenant } from '../../../types/tenant';
import { SwitchTenantOptions, TenantServiceResult } from './tenant-types';

export class TenantService {
  static async switchTenant({
    tenant,
    queryClient,
  }: SwitchTenantOptions): Promise<TenantServiceResult> {
    try {
      clearTenantData();

      const oldStoreTenant = useOrganisationsStore.getState().currentTenant;
      if (oldStoreTenant) {
        useOrganisationsStore.setState({ currentTenant: null });
      }

      useOrganisationsStore.getState().setCurrentTenant(tenant);

      await new Promise((resolve) => setTimeout(resolve, 10));

      setTenant(tenant.id, false);

      if (typeof window !== 'undefined') {
        await new Promise((resolve) => setTimeout(resolve, 10));
        const cookieValue = document.cookie
          .split(';')
          .find((c) => c.trim().startsWith('tenant_id='));

        if (!cookieValue || !cookieValue.includes(tenant.id)) {
          setTenant(tenant.id, false);
        }
      }

      if (queryClient) {
        queryClient.invalidateQueries();
      }

      if (typeof window !== 'undefined') {
        window.location.reload();
      }

      return { success: true };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to switch tenant';
      return { success: false, error: errorMessage };
    }
  }

  static syncTenantFromStorage(
    availableTenants: Array<{ tenant: Tenant }>
  ): void {
    if (typeof window === 'undefined') return;

    const tenantIdFromStorage = localStorage.getItem('tenant_id');
    if (!tenantIdFromStorage) return;

    const tenantFromStorage = availableTenants.find(
      (ur) => ur.tenant.id === tenantIdFromStorage
    );

    if (tenantFromStorage) {
      useOrganisationsStore
        .getState()
        .setCurrentTenant(tenantFromStorage.tenant);
    }
  }
}
