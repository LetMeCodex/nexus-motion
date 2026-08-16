/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        heading: ['Space Grotesk', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        cyber: {
          bg: '#040407',
          surface: '#0a0a12',
          cyan: '#00f0ff',
          purple: '#9d4edd',
          amber: '#ffaa00',
          emerald: '#00ff88',
        }
      }
    },
  },
  plugins: [],
}
