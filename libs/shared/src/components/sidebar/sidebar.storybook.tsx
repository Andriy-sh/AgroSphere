'use client';
import React, { useState, useRef } from 'react';
import { cn } from '../../utils/cn';
import { Notifications } from '../notifications/notifications';
import {
  mockNotificationGroups,
  getUnreadCount,
  markAllAsRead,
  markAsRead,
} from '../../mock/mock-notifications';
import { usePathname } from 'next/navigation';
import { CompanySelector, CompanySelectSkeleton } from '../company-selector';
import { useSidebarStore } from '../../stores/useSidebarStore';
import { useSidebarHydration } from '../../hooks/use-sidebar-hydration';
import { useNotificationStore } from '../../stores/use-notification-store';
import { Logo } from '../icons/logo';
import {
  SIDEBAR_NAVIGATION_ITEMS,
  SIDEBAR_BOTTOM_ITEMS,
} from '../../constants/sidebar-navigation';
import { Icon } from '../icon';
import { useTenant } from '../../hooks/use-tenant.mock'; // Use mock hook
import { useSidebarLayout } from './use-sidebar-layout';
import {
  sidebarVariants,
  sidebarButtonVariants,
  iconVariants,
  borderVariants,
} from './sidebar-variants';
import { SidebarItem } from './sidebar-item';
import { SidebarFooter } from './sidebar-footer';
import { SidebarThemeSwitcher } from './sidebar-theme-switcher';
import { SidebarNotifications } from './sidebar-notifications';
import type { SidebarVariant } from './sidebar-variants';
import type { VariantProps } from 'class-variance-authority';

export interface SidebarProps extends VariantProps<typeof sidebarVariants> {
  variant?: SidebarVariant;
}

export function Sidebar({ variant: initialVariant = 'dark' }: SidebarProps) {
  const layout = useSidebarLayout();
  const { toggleSidebar } = useSidebarStore();
  useSidebarHydration();
  const { isOpen: isNotificationsOpen, close: closeNotifications } =
    useNotificationStore();
  const {
    companies,
    selectedCompany,
    handleCompanyChange,
    loading: tenantLoading,
  } = useTenant(); // This now uses the mock hook
  const [variant, setVariant] = useState<SidebarVariant>(initialVariant);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // TODO: Replace mock notifications with real API integration
  const unreadCount = getUnreadCount();

  const handleMarkAllAsRead = () => {
    markAllAsRead();
    // Force re-render by updating state if needed
    // In future, this should come from store/API
  };

  const handleMarkAsRead = (notificationId: string) => {
    markAsRead(notificationId);
    // Force re-render by updating state if needed
    // In future, this should come from store/API
  };

  return (
    <div
      ref={sidebarRef}
      style={{ width: layout.width }}
      className={sidebarVariants({ variant })}
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="p-4">
          <div className="flex flex-col items-center justify-between relative w-full overflow-hidden">
            <div
              className={cn(
                'flex items-center gap-2 min-w-0 w-full overflow-hidden',
                layout.isOpen ? 'justify-between' : 'justify-center'
              )}
            >
              <div
                className={cn(
                  'flex items-center gap-2 min-w-0',
                  layout.isOpen ? 'flex-1' : 'flex-none justify-center w-full'
                )}
              >
                <Logo width={24} height={24} />
                <h1
                  className={cn(
                    'text-base font-semibold overflow-hidden whitespace-nowrap flex-1 min-w-0 text-ellipsis',
                    (!layout.isOpen || layout.isCollapsed) && 'hidden'
                  )}
                >
                  AgroSphere
                </h1>
              </div>
              <Icon
                onClick={toggleSidebar}
                className={cn(
                  sidebarButtonVariants({ variant }),
                  iconVariants({ variant }),
                  'cursor-pointer',
                  (!layout.isOpen || layout.isCollapsed) && 'hidden'
                )}
                title="Collapse Sidebar"
                icon="menu_open"
              />
            </div>
            <Icon
              onClick={toggleSidebar}
              className={cn(
                sidebarButtonVariants({ variant }),
                iconVariants({ variant }),
                'mt-2 cursor-pointer rotate-180',
                layout.isOpen && !layout.isCollapsed && 'hidden'
              )}
              title={layout.isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
              icon="menu_open"
            />
          </div>
        </div>

        <div className={cn('border-t w-full', borderVariants({ variant }))} />

        {/* Company Selector */}
        {tenantLoading || (companies.length === 0 && !selectedCompany) ? (
          <CompanySelectSkeleton collapsed={layout.isCollapsed} />
        ) : (
          <CompanySelector
            companies={companies}
            value={selectedCompany}
            onChange={handleCompanyChange}
            collapsed={layout.isCollapsed}
            showChevron={layout.showChevron}
            variant={variant}
          />
        )}

        <div className={cn('border-t w-full', borderVariants({ variant }))} />

        {/* Navigation */}
        <div className="p-4">
          <nav
            className={cn(
              'flex flex-col gap-1 text-sm w-full',
              !layout.isOpen ? 'items-center' : 'items-stretch'
            )}
          >
            {SIDEBAR_NAVIGATION_ITEMS.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                isOpen={layout.isOpen}
                active={item.pathMatch(pathname || '')}
                href={item.href}
                variant={variant}
              />
            ))}
          </nav>
        </div>
      </div>

      {/* Footer Section */}
      <div className="flex flex-col">
        <div className="p-4">
          <div
            className={cn(
              'flex flex-col gap-1 text-sm w-full',
              !layout.isOpen ? 'items-center' : 'items-stretch'
            )}
          >
            <SidebarThemeSwitcher
              variant={variant}
              onVariantChange={setVariant}
              isOpen={layout.isOpen}
              showNotificationBadge={layout.showNotificationBadge}
            />

            <SidebarNotifications
              variant={variant}
              isOpen={layout.isOpen}
              showNotificationBadge={layout.showNotificationBadge}
            />

            {SIDEBAR_BOTTOM_ITEMS.map((item) => (
              <SidebarItem
                key={item.href}
                icon={item.icon}
                label={item.label}
                isOpen={layout.isOpen}
                active={item.pathMatch(pathname || '')}
                href={item.href}
                variant={variant}
              />
            ))}
          </div>
        </div>

        <div className={cn('border-t w-full', borderVariants({ variant }))} />

        <SidebarFooter variant={variant} isOpen={layout.isOpen} />
      </div>

      {/* Notifications Modal */}
      <Notifications
        isOpen={isNotificationsOpen}
        onClose={closeNotifications}
        notificationGroups={mockNotificationGroups}
        unreadCount={unreadCount}
        onMarkAllAsRead={handleMarkAllAsRead}
        onMarkAsRead={handleMarkAsRead}
        sidebarWidth={layout.width}
      />
    </div>
  );
}

