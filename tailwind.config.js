/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/src/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/components/**/*.{js,ts,jsx,tsx,mdx}',
    './frontend/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          amber: '#f59e0b',
          blue: '#3b82f6',
          pink: '#ec4899',
          rose: '#f43f5e',
          emerald: '#10b981',
          black: '#18181b',
        },
      },
    },
  },
  plugins: [],
};
