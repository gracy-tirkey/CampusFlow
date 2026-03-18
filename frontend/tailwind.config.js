/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
          // primary: "#D282A6",
          // secondary: "#E8B4BC",
          // light: "#F5E3E0",
          // dark: "#6E4555",
          // text: "#3A3238",

          primary: "#059669",     // emerald primary
          secondary: "#047857",   // deeper emerald secondary
          light: "#0F172A",       // dark background
          dark: "#020617",        // darker background
          text: "#F0FDF4",        // light emerald text
      }
    },
  },
  plugins: [],
}