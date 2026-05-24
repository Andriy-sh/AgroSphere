import type { StorybookConfig } from '@storybook/react-vite';

import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { mergeConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import { config as dotenvConfig } from 'dotenv';
import path from 'path';

dotenvConfig({ path: '.env.local' });

const config: StorybookConfig = {
  stories: [
    '../src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.story.@(js|jsx|ts|tsx|mdx)',
    '../src/**/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-links',
    '@storybook/react-vite',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
  },
  typescript: {
    reactDocgen: false,
  },
  viteFinal: async (config) =>
    mergeConfig(config, {
      plugins: [svgr(), react(), nxViteTsPaths()],

      resolve: {
        alias: {
          '@': '/src',
          // Mock auth actions for Storybook to prevent __dirname errors
          '../sign-out/sign-out': path.resolve(__dirname, '../src/components/sign-out/sign-out.mock.tsx'),
          '../../utils/auth-utils': path.resolve(__dirname, '../src/api/utils/auth-utils.mock.ts'),
          '../utils/auth-utils': path.resolve(__dirname, '../src/api/utils/auth-utils.mock.ts'),
          '../../../actions/auth': path.resolve(__dirname, '../src/actions/auth.mock.ts'),
          // Mock useTenant hook to avoid React Query dependency
          // Cover different import paths
          '../../hooks/use-tenant': path.resolve(__dirname, '../src/hooks/use-tenant.mock.ts'),
          '../hooks/use-tenant': path.resolve(__dirname, '../src/hooks/use-tenant.mock.ts'),
          '../../../hooks/use-tenant': path.resolve(__dirname, '../src/hooks/use-tenant.mock.ts'),
        },
      },
      define: {
        'process.env': {
          ...process.env,
          STORYBOOK_MAPBOX_ACCESS_TOKEN:
            process.env.STORYBOOK_MAPBOX_ACCESS_TOKEN,
          NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
            process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
        },
        'process.browser': true,
        process: { env: {} },
      },
    }),
};

export default config;
// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
