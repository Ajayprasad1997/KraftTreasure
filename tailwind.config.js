/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#B85F3D", dark: "#93472C", light: "#F8E9E2" },
        ink: "#252321",
        canvas: "#F7F6F3"
      },
      boxShadow: { soft: "0 4px 24px rgba(38, 32, 27, .05)" }
    },
  },
  plugins: [],
};
