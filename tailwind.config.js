/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./account/**/*.html",
    "./post/**/*.html",
    "./src/**/*.js",
    "./src/**/*.js",
    "./src/**/*.css"
  ],  
  theme: {
    extend: {
      colors: {
      },
      fontFamily: {
        // mono: ['ui-monospace', 'SFMono-Regular'],
        // roboto: ["Roboto", "sans-serif"],
        // bebas: ["Bebas Neue", "sans-serif"],
      },
    },
  },
  plugins: [],
}