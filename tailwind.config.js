/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./account/*/*.html",
    "./post/*/*.html",
    "./src/**/*.js",
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