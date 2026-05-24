'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  PageContainer,
  SidebarHydrationController,
} from '@@agrosphere/shared';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { Providers } from './Providers';

const INVITE_ROUTES = [
  '/invite',
  '/organisation-selection',
  '/sign-in',
  '/sign-up',
  '/business-profile',
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <NuqsAdapter>
    <SidebarHydrationController />
    <div className="flex h-full">
      <Sidebar variant="basic-white" />
      <main className="flex-1 overflow-auto bg-basic-white p-4">
        <PageContainer>{children}</PageContainer>
      </main>
    </div>
  </NuqsAdapter>
);

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInvitePage = INVITE_ROUTES.some((route) =>
    pathname?.startsWith(route)
  );

  return (
    <Providers>
      {isInvitePage ? children : <MainLayout>{children}</MainLayout>}
    </Providers>
  );
}
