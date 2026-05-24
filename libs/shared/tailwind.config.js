const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      colors: {
        'basic-black': '#101010',
        'basic-white': '#EEF0F6',
        'basic-green': '#29B54C',
        'basic-red': '#FF323F',
        'basic-yellow': '#FFC652',
        'basic-gray': '#818D99',
        'basic-gray-light': '#dbdee8',
        'basic-border-gray': '#EEF0F629',
        'basic-blue': '#41B0FF',
        'basic-green-light': '#00AF4D1F',
        'basic-green-dark': '#25A044',
        'basic-green-deep': '#004E3A',
        'basic-blue-opacity': '#41B0FF1F',
        'basic-red-opacity': '#FF323F1F',
        'basic-green-opacity': '#00AF4D1F',
        'basic-white-opacity': '#EEF0F652',
      },
    },
  },
  plugins: [],
};
