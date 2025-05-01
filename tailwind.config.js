/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Noto Sans Jp", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/forms")]
};
