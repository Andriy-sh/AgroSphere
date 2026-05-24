import { useMemo } from 'react';
import { useSidebar } from '../../hooks/use-sidebar';
import {
  COLLAPSE_THRESHOLD,
  CHEVRON_DOWN_COLLAPSE_THRESHOLD,
  NOTIFICATION_BADGE_COLLAPSE_THRESHOLD,
  USER_INFO_COLLAPSE_THRESHOLD,
} from './sidebar-constants';

export function useSidebarLayout() {
  const { width, isOpen } = useSidebar();

  const layout = useMemo(
    () => ({
      isCollapsed: width <= COLLAPSE_THRESHOLD,
      showChevron: width > CHEVRON_DOWN_COLLAPSE_THRESHOLD,
      showNotificationBadge: width > NOTIFICATION_BADGE_COLLAPSE_THRESHOLD,
      showUserInfo: width > USER_INFO_COLLAPSE_THRESHOLD,
      isOpen,
      width,
    }),
    [width, isOpen]
  );

  return layout;
}

