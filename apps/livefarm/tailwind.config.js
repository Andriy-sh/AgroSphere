//const { createGlobPatternsForDependencies } = require('@nx/next/tailwind');

// The above utility import will not work if you are using Next.js' --turbo.
// Instead you will have to manually add the dependent paths to be included.
// For example
// ../libs/buttons/**/*.{ts,tsx,js,jsx,html}',                 <--- Adding a shared lib
// !../libs/buttons/**/*.{stories,spec}.{ts,tsx,js,jsx,html}', <--- Skip adding spec/stories files from shared lib

// If you are **not** using `--turbo` you can uncomment both lines 1 & 19.
// A discussion of the issue can be found: https://github.com/nrwl/nx/issues/26510

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // App-level files
    './{src,app,pages,components}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,app,pages,components}/**/*.{spec,test}.{ts,tsx,js,jsx}',

    // Shared libs (adjust path depth as needed)
    '../../libs/shared/**/*.{ts,tsx,js,jsx,html,mdx}',
    '../../libs/shared/src/**/*.{ts,tsx,js,jsx,html,mdx}',
    '../../libs/shared/src/**/*.stories.{ts,tsx,js,jsx,html,mdx}',

    // Storybook config files (optional but useful for themes/docs addons)
    '../../libs/shared/.storybook/**/*.{ts,tsx,js,jsx,mdx}',
    '../../libs/shared/.storybook/main.ts',
    '../../libs/shared/.storybook/preview.ts',
    '../../libs/shared/.storybook/main.js',
    '../../libs/shared/.storybook/preview.js',
  ],
  theme: {
    extend: {
      fontSize: {
        14: '14px',
        28: '28px',
        32: '32px',
      },
      spacing: {
        11: '11px',
      },
      colors: {
        'basic-black': '#101010',
        'basic-white': '#EEF0F6',
        'basic-green': '#29B54C',
        'basic-red': '#FF323F',
        'basic-yellow': '#FFC652',
        'basic-gray': '#818D99',
        'basic-gray-light': '#dbdee8',
        'basic-blue': '#41B0FF',
        'basic-green-light': '#00AF4D1F',
        'basic-green-dark': '#25A044',
        'basic-green-deep': '#004E3A',
        'basic-border-gray': '#EEF0F629',
        'basic-blue-opacity': '#41B0FF1F',
        'basic-red-opacity': '#FF323F1F',
        'basic-green-opacity': '#00AF4D1F',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-up-delayed': 'slideUp 0.4s ease-out 0.1s both',
        'bounce-slow': 'bounceSlow 2s infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
