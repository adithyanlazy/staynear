/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        ocean: {
          500: '#0369a1',
          600: '#0284c7',
          700: '#0ea5e9',
        },
      },
      fontFamily: {
        sans:    ['Josefin Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Georgia', 'serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out 1.5s infinite',
        'slide-up':   'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'fade-in':    'fadeIn 0.6s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(24px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',    opacity: '1' },
        },
        slideDown: {
          '0%':   { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)',     opacity: '1' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      boxShadow: {
        'premium':      '0 4px 6px -1px rgba(0,0,0,0.05), 0 20px 48px -8px rgba(0,0,0,0.12)',
        'premium-hover':'0 8px 12px -2px rgba(0,0,0,0.08), 0 32px 64px -12px rgba(0,0,0,0.2)',
        'glow-primary': '0 0 0 1px rgba(15,118,110,0.18), 0 4px 24px rgba(15,118,110,0.28)',
        'glow-gold':    '0 0 0 1px rgba(245,158,11,0.15), 0 4px 24px rgba(245,158,11,0.2)',
        'card':         '0 1px 3px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover':   '0 4px 8px rgba(0,0,0,0.06), 0 20px 48px rgba(0,0,0,0.14)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
