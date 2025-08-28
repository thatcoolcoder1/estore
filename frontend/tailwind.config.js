/** @type {import('tailwindcss').Config} */
module.exports = {
  // Configure the files Tailwind should scan for utility classes
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    require('tailwind-scrollbar')
  ],
};
