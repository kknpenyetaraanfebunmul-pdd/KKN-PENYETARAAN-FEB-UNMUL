/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: '#f7f5fb',
        'primary-purple': '#7b5ea7',
        'dark-purple': '#2b1c3d',
        'card-bg': '#ece6f5',
        'bubble-light': 'rgba(123, 94, 167, 0.12)',
        'dark-bg': '#0f0a1a',
        'dark-card': '#1a1129',
        'dark-border': 'rgba(123, 94, 167, 0.25)',
        'dark-text': '#e8e2f2',
        'dark-text-muted': '#a89bbf',
      },
      fontFamily: {
        main: ['Poppins', 'sans-serif'],
      },
      animation: {
        'slide-carousel': 'slideCarousel 12s infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.5s ease forwards',
        heartbeat: 'heartbeat 1.5s ease-in-out infinite',
      },
      keyframes: {
        slideCarousel: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '8.33%': { transform: 'translateX(0)', opacity: '1' },
          '33.33%': { transform: 'translateX(0)', opacity: '1' },
          '41.66%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
};