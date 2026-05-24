import type { Tenant } from '../../../types/tenant';
import type { QueryClient } from '@tanstack/react-query';

export interface SwitchTenantOptions {
  tenant: Tenant;
  queryClient: QueryClient;
}

export interface TenantServiceResult {
  success: boolean;
  error?: string;
}

