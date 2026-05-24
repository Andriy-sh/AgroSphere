/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@agrosphere/shared'],
  experimental: {
    optimizePackageImports: ['@agrosphere/shared'],
    // Exclude certain directories from being treated as pages
  },
  // Removed generateBuildId to prevent caching issues
  // Only treat files with specific patterns as pages
  async rewrites() {
    return [
      {
        source: '/api/:path((?!proxy|auth).)*',
        destination: 'http://api.agrosphere.ie/api/:path*',
      },
    ];
  },
  // Reduce module resolution time
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    },
  },
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 15 * 60 * 1000, // 15 minutes
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 4,
  },
  webpack(config, { dev, isServer }) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    if(dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'async',
          cacheGroups: {
            default: false,
          },
        },
      }
    }
    if (fileLoaderRule) {
      fileLoaderRule.exclude = /\.svg$/i;
    }

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });

    if (dev) {
      // Reduce rebuild time
      config.watchOptions = {
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-Tenant, Authorization, Content-Type',
          },
          // Add cache control headers to prevent caching issues
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate',
          },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      // Add security headers for all routes
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
