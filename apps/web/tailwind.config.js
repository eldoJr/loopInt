/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'] // sugestão de fonte espiritual
      }
    }
  }
}