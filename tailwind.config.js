/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        'slate-dark': '#2D3436',
        'purple-main': '#6C5CE7',
        'pink-main': '#FD79A8',
        'coral-accent': '#FF7675',
        'violet-soft': '#A29BFE',
        'gray-muted': '#B2BEC3',
        'bg-app': '#F5F7FB',
      },
      boxShadow: {
        'soft-card': '0 10px 25px rgba(112, 100, 150, 0.08)',
        'pill-active': '0 8px 20px rgba(253, 121, 168, 0.35)',
        'purple-glow': '0 10px 22px rgba(108, 92, 231, 0.28)',
      }
    },
  },
  plugins: [],
}
