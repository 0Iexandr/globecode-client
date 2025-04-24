/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1320px',
      xxl: '1600px',
    },
    extend: {
      container: {
        center: true,
        padding: {
          DEFAULT: '1.25rem',
          sm: '1.25rem',
          md: '2rem',
          lg: '5rem',
        },
      },
      colors: {
        main: '#1F252E',
        additionalText: '#2f353d',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        myshine: {
          '0%': { top: '-150%', left: '-150%' },
          '100%': { top: '150%', left: '150%' },
        },
      },
      animation: {
        myshine: 'myshine 3s linear infinite',
      },
    },
  },
  plugins: [],
};
