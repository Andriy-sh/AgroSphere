'use client';

import { setTenantId } from '@/api/utils/auth-utils';
import { InvitePageLayout } from '@/components/layout/invite-page-layout';
import { Logo, Avatar, Button } from '@@agrosphere/shared';
import { useUsers, MOCK_USER_ROLES } from '@@agrosphere/shared';
import { Tenant } from '@@agrosphere/shared';
import { setTenant } from '@/utils/tenant-sync';
import { useRouter } from 'next/navigation';
import { clearAuthData } from '@@agrosphere/shared';
import { useOrganisationsStore } from '@/stores/useOrganisationsStore';
import Link from 'next/link';
export default function OrganisationSelection() {
  const { userRoles, loading, error } = useUsers();

  const { setCurrentTenant } = useOrganisationsStore();

  const router = useRouter();
  const currentEmail = 'john.doe@agency.inc';

  // Use mock data if no real data and in development
  const organisations = userRoles.length > 0 ? userRoles : MOCK_USER_ROLES.data;

  console.log('[OrganisationSelection] userRoles:', userRoles);
  console.log('[OrganisationSelection] organisations:', organisations);
  console.log('[OrganisationSelection] loading:', loading);
  console.log('[OrganisationSelection] error:', error);

  const getIntials = (name: string) => {
    const nameParts = name.split(' ');

    return nameParts.reduce(
      (initials, part) => initials + part.charAt(0).toUpperCase(),
      ''
    );
  };

  const selectOrganisation = async (tenant: Tenant) => {
    setCurrentTenant(tenant);
    try {
      // Set tenant in localStorage and sync to cookie
      await setTenant(tenant.id);

      // Legacy support - also set using the old method
      setTenantId(tenant.id);

      // Navigate to home page and refresh to ensure middleware picks up the cookie
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Failed to set tenant:', error);
      // Fallback to window location
    }
  };
  return (
    <InvitePageLayout>
      <div className="flex flex-col items-center justify-center w-full h-full p-4 text-basic-black  overflow-y-auto">
        <div className="w-full max-w-2xl bg-white rounded-xl border border-basic-white p-8">
          <div className="flex flex-col items-center mb-8">
            <Logo width={32} height={32} className="mb-6" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Select an organisation <br />
              to continue
            </h1>
            <p className="text-sm text-gray-900 text-center">
              Your account is linked to these organisations.
            </p>
            <p className="text-sm text-center text-basic-black mt-4">
              Don&apos;t see your organisation?{' '}
              <Link
                href="/business-profile"
                className="text-basic-green font-medium no-underline hover:underline"
              >
                Create a new organisation
              </Link>
            </p>
          </div>
          <div className="flex flex-col w-full space-y-8">
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {organisations.map((org) => (
                <div
                  key={org.tenant.id}
                  className="flex items-center justify-between p-[8.5px] border border-basic-white rounded-xl bg-white hover:border-basic-green hover:shadow-sm cursor-pointer transition-all duration-150"
                  onClick={() => selectOrganisation(org.tenant)}
                >
                  <div className="flex items-center space-x-3">
                    <Avatar
                      row={{
                        original: {
                          client: {
                            name:
                              getIntials(org.tenant.name).length > 1
                                ? getIntials(org.tenant.name)[1]
                                : getIntials(org.tenant.name)[0] || '',
                            surname: getIntials(org.tenant.name)[0] || '',
                          },
                        },
                      }}
                      size="lg"
                      rounded="md"
                      showTooltip={false}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {org.tenant.name}
                      </span>
                      <span className="text-xs text-basic-gray">
                        {org.tenant.email}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-normal bg-basic-white px-2 py-0.5 rounded-[4px]">
                    {org.role.displayName}
                  </span>
                </div>
              ))}
            </div>

            <div className="gap-2 flex flex-col items-center">
              <p className="text-sm ">
                The email you are currently logged into is{' '}
                <span className="font-medium">{currentEmail}</span>
              </p>
              <Button
                variant="ghost"
                className="text-sm text-basic-green font-medium hover:underline p-0 m-0 gap-0 h-auto"
                onClick={() => {
                  clearAuthData();
                  router.replace('/');
                  router.refresh();
                }}
              >
                Use a different email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </InvitePageLayout>
  );
}
