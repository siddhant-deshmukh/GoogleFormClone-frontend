/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    screens: {
      sm:'697px',
      md:'768px',
      slg:'800px',
      lg:'1024px',
      xl:'1280px',
      '2xl':'1536px',
    },
  },
  plugins: [],
}
