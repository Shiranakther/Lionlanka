/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        deep: '#060414',
        mid: '#0d0b1f',
        surface: '#13112b',
        card: '#1a1635',
        primary: '#8b5cf6',
        accent: '#06b6d4',
        gold: '#f59e0b',
        'text-main': '#e2d9ff',
        muted: '#7c7a9e',
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
