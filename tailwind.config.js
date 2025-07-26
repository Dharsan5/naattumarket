/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olive': {
          50: '#e5eadb',
          100: '#d4dcc4',
          200: '#c3ceac',
          300: '#b2c095',
          400: '#a1b27d',
          500: '#90a466',
          600: '#718355',
          700: '#596544',
          800: '#404732',
          900: '#282921',
        }
      },
      fontFamily: {
        'inter': ['Inter', 'system-ui', 'sans-serif'],
        'noto-tamil': ['Noto Sans Tamil', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}