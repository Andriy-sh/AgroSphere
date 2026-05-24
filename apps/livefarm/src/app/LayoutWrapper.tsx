'use client';

import { usePathname } from 'next/navigation';
import {
  Sidebar,
  PageContainer,
  SidebarHydrationController,
} from '@@agrosphere/shared';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { ReactQueryProvider } from './react-query-provider';
import Providers from './Providers';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const PAGES_WITHOUT_SIDEBAR = new Set([
  '/invite',
  '/invite-expired',
  '/organisation-selection',
  '/business-profile',
]);

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const shouldShowSidebar = pathname
    ? !PAGES_WITHOUT_SIDEBAR.has(pathname)
    : true;

  return (
    <ReactQueryProvider>
      <NuqsAdapter>
        <Providers>
          {shouldShowSidebar ? (
            <>
              <SidebarHydrationController />
              <div className="flex h-full max-h-full">
                <Sidebar variant="basic-white" />
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-2 gap-2 bg-basic-white max-h-full min-w-0">
                  <PageContainer>{children}</PageContainer>
                </main>
              </div>
            </>
          ) : (
            <main className="h-full max-h-full overflow-y-auto overflow-x-hidden gap-2 bg-basic-white">
              {children}
            </main>
          )}
        </Providers>
      </NuqsAdapter>
    </ReactQueryProvider>
  );
}
