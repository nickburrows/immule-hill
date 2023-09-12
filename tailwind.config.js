/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './dist/*.html',
    './*.html',
    './src/**/*.{html,js,jsx,ts,tsx}',
    './node_modules/flowbite/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [require('flowbite/plugin')],
};
