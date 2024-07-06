/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "background":"#e9e9e9ff",
        "card":"#efefefff",
        "categories":"#efefefff"
      }
    },
  },
  plugins: [],
}