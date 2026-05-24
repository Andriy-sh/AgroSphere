export const SIDEBAR_NAVIGATION_ITEMS = [
  {
    icon: 'home',
    label: 'Dashboard',
    href: '/',
    pathMatch: (pathname: string) => pathname === '/dashboard',
  },
  {
    icon: 'file-text',
    label: 'Tasks',
    href: '/tasks',
    pathMatch: (pathname: string) => pathname?.startsWith('/tasks'),
  },
  {
    icon: 'group',
    label: 'Clients',
    href: '/clients',
    pathMatch: (pathname: string) => pathname?.startsWith('/clients'),
  },
  {
    icon: 'experiment',
    label: 'Lab',
    href: '/lab',
    pathMatch: (pathname: string) => pathname?.startsWith('/lab'),
  },
  {
    icon: 'analytics',
    label: 'Soil Dashboard',
    href: '/soil-dashboard',
    pathMatch: (pathname: string) => pathname?.startsWith('/soil-dashboard'),
  },
  {
    icon: 'pie_chart',
    label: 'Reporting',
    href: '/reporting',
    pathMatch: (pathname: string) => pathname?.startsWith('/reporting'),
  },
  {
    icon: 'home_work',
    label: 'My farm',
    href: '/my-farm',
    pathMatch: (pathname: string) => pathname?.startsWith('/my-farm'),
  },
  {
    icon: 'water_drop',
    label: 'Nitrogen Planner',
    href: '/nitrogen-fertilization',
    pathMatch: (pathname: string) =>
      pathname?.startsWith('/nitrogen-fertilization'),
  },
  {
    icon: 'dashboard',
    label: 'Nue Dashboard',
    href: '/nue-dashboard',
    pathMatch: (pathname: string) => pathname?.startsWith('/nue-dashboard'),
  },
  {
    icon: 'science',
    label: 'Fertilizer',
    href: '/fertilizer',
    pathMatch: (pathname: string) => pathname?.startsWith('/fertilizer'),
  },
];

export const SIDEBAR_BOTTOM_ITEMS = [
  {
    icon: 'groups',
    label: 'Team',
    href: '/team',
    pathMatch: (pathname: string) => pathname?.startsWith('/team'),
  },
  {
    icon: 'settings',
    label: 'Settings',
    href: '/settings',
    pathMatch: (pathname: string) => pathname?.startsWith('/settings'),
  },
];
