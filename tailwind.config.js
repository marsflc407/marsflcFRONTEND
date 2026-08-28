/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#335171",
          dark: "#27578d",
          light: "#EAF4FF",
        },

        secondary: {
          DEFAULT: "#00A651",
          dark: "#008A43",
          light: "#EAF9F1",
        },

        dark: {
          DEFAULT: "#123B63",
          light: "#345978",
        },

        white: "#FFFFFF",

        gray: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          500: "#64748B",
          700: "#334155",
          900: "#0F172A",
        },
      },
    },
  },
  plugins: [],
};
