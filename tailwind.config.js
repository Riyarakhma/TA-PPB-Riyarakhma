/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'; // Impor tema default

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Tambahkan fontFamily untuk menimpa font 'sans' default
      fontFamily: {
        sans: ['Onest', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};