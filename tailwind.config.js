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
      fontFamily: {
        gilroy: ['Gilroy', 'sans-serif'],
        'gilroy-light': ['Gilroy-Light', 'sans-serif'],
        'gilroy-regular': ['Gilroy-Regular', 'sans-serif'],
        'gilroy-medium': ['Gilroy-Medium', 'sans-serif'],
        'gilroy-semibold': ['Gilroy-Semibold', 'sans-serif'],
        'gilroy-bold': ['Gilroy-Bold', 'sans-serif'],
        'gilroy-extrabold': ['Gilroy-Extrabold', 'sans-serif'],
        'gilroy-heavy': ['Gilroy-Heavy', 'sans-serif'],
        'gilroy-thin': ['Gilroy-Thin', 'sans-serif'],
        'gilroy-ultralight': ['Gilroy-UltraLight', 'sans-serif'],
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
      },
    },
  },
  plugins: [],
};
