import type { Preview } from '@storybook/react';
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import './tailwind.css';

if (typeof window !== 'undefined' && typeof window.process === 'undefined') {
  // @ts-expect-error - Adding process to window for Storybook
  window.process = { env: {} };
}

// Mock router for Storybook
const mockRouter = {
  push: (href: string) => {
    console.log('Router push:', href);
  },
  replace: (href: string) => {
    console.log('Router replace:', href);
  },
  prefetch: (href: string) => {
    console.log('Router prefetch:', href);
  },
  back: () => {
    console.log('Router back');
  },
  forward: () => {
    console.log('Router forward');
  },
  refresh: () => {
    console.log('Router refresh');
  },
  pathname: '/',
  searchParams: new URLSearchParams(),
  asPath: '/',
  route: '/',
  query: {},
  isReady: true,
  isPreview: false,
  isLocaleDomain: false,
  events: {
    on: () => {
      // Mock implementation for Storybook
    },
    off: () => {
      // Mock implementation for Storybook
    },
    emit: () => {
      // Mock implementation for Storybook
    },
  },
};

const withNextRouter = (Story: React.ComponentType) => {
  return (
    <AppRouterContext.Provider value={mockRouter}>
      <Story />
    </AppRouterContext.Provider>
  );
};

const QueryClientWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const withQueryClient = (Story: React.ComponentType) => {
  return (
    <QueryClientWrapper>
      <Story />
    </QueryClientWrapper>
  );
};

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        {
          name: 'dark',
          value: '#000000',
        },
      ],
    },
  },
  decorators: [withQueryClient, withNextRouter],
};

export default preview;
