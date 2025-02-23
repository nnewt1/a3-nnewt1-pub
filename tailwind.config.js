/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"], // Make sure this includes all your HTML files
  theme: {
    extend: {
      colors: {
        darkslategray: "#2F4F4F",
        slategray: "#708090",
      },
      fontFamily: {
        roboto: ["Roboto", "serif"],
      },
    },
  },
  plugins: [],
};
