import path from 'node:path'
import { fileURLToPath } from 'node:url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cormorant Garamond', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        rose: {
          50: '#fff5f7',
          100: '#ffe4e8',
          200: '#ffd6e0',
          300: '#ffb3c6',
          400: '#ff8fa8',
          500: '#e91e63',
          600: '#c0184a',
          700: '#9b1239',
          800: '#7d0a2a',
          900: '#540420',
        },
      },
      boxShadow: {
        heart: '0 6px 24px rgba(192, 24, 74, 0.35)',
        soft: '0 2px 12px rgba(192, 24, 74, 0.18)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.8)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        floatUp: {
          '0%': { transform: 'translateY(0) rotate(0deg)', opacity: 0.6 },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)', opacity: 0 },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite',
        popIn: 'popIn 0.4s ease-out',
        floatUp: 'floatUp linear infinite',
      },
    },
  },
  plugins: [],
}
