/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'] },
      boxShadow: { soft: '0 12px 40px rgba(2, 8, 23, 0.08)', glow: '0 0 0 1px rgba(52, 211, 153, 0.08), 0 24px 80px rgba(16, 185, 129, 0.08)' }
    }
  },
  plugins: []
}
