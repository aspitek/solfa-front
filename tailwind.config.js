const primeui = require('tailwindcss-primeui')
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,vue,ts}"],
  theme: {
    extend: {
      colors: {
        red: {
          '500': 'red'
        }
      }
    },
  },
  plugins: [
    primeui
  ],
  darkMode: 'class'
};
