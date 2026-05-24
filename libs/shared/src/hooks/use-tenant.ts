'use client';
import { useMemo, useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useUsers } from '../api/hooks/use-users';
import { useOrganisationsStore } from '../stores/useOrganisationsStore';
import { TenantService } from '../api/services/tenant/tenant-service';
import type { Company } from '../mock/mock-companies';

export function useTenant() {
  const { userRoles, loading: userRolesLoading } = useUsers();
  const { currentTenant } = useOrganisationsStore();
  const queryClient = useQueryClient();

  const getInitials = (name: string): string => {
    const nameParts = name.split(' ');
    return nameParts.reduce(
      (initials, part) => initials + part.charAt(0).toUpperCase(),
      ''
    );
  };

  const companies: Company[] = useMemo(() => {
    const uniqueUserRoles = userRoles.filter(
      (role, index, self) =>
        index === self.findIndex((r) => r.tenant.id === role.tenant.id)
    );

    return uniqueUserRoles.map((userRole) => ({
      id: userRole.tenant.id,
      name: userRole.tenant.name,
      initials: getInitials(userRole.tenant.name),
      isOwn: false,
      hasCrown: userRole.status === 'active',
      roleDisplayName: userRole.role.displayName,
    }));
  }, [userRoles]);

  const selectedCompany = useMemo(() => {
    if (!currentTenant) return null;
    return companies.find((c) => c.id === currentTenant.id) || null;
  }, [companies, currentTenant]);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      userRoles.length > 0 &&
      !currentTenant
    ) {
      TenantService.syncTenantFromStorage(userRoles);
    }
  }, [userRoles, currentTenant]);

  const handleCompanyChange = useCallback(
    async (company: Company) => {
      const userRole = userRoles.find((ur) => ur.tenant.id === company.id);

      if (!userRole) {
        return;
      }

      const result = await TenantService.switchTenant({
        tenant: userRole.tenant,
        queryClient,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to switch tenant');
      }
    },
    [userRoles, queryClient]
  );

  return {
    companies,
    selectedCompany,
    handleCompanyChange,
    loading: userRolesLoading,
  };
}
