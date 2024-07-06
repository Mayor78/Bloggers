/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      colors: {
        'primary': '#6f6af8',
        'primary-light': '#000000',
        'primary-dark': '#000000',
        'secondary': '#000000',
        'white-50': 'rgba(255, 255, 255, 0.5)', // Custom semi-transparent color
      },
      spacing: {
        'section-margin-top': '6rem', // Custom margin for sections
      },
      hover:{
        "transition": "ease 300"
      },
      keyframes: {
        drop: {
          '0%': { transform: 'translateY(-100%)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
      },
      animation: {
        drop: 'drop 0.5s ease-out forwards',
      },
      transitionDelay: {
        '0': '0ms',
        '200': '200ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}
