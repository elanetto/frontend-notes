/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./account/*.html",
    "./post/*.html",
    "./src/**/*.js",
    "./src/**/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
      },
      fontFamily: {
        roboto: ["Roboto", "sans-serif"],
        bebas: ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
}