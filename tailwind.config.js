/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Playfair Display"', 'Georgia', 'serif'],
        'body': ['"DM Sans"', 'sans-serif'],
        'mono': ['"DM Mono"', 'monospace'],
      },
      colors: {
        'cream':   '#F5F0E8',
        'parchment': '#EDE6D6',
        'navy':    '#1B2A4A',
        'navy-light': '#243660',
        'gold':    '#B8962E',
        'gold-light': '#D4AD47',
        'ink':     '#2C2C2C',
        'muted':   '#7A7060',
        'rule':    '#D6CBAF',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'float': 'float 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
    },
  },
  plugins: [],
}
