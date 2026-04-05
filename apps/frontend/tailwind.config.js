/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tailwind.config.js",
  ],
  theme: {
    screens: {
      'xxs': '320px',
      'xs': '375px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    },
    extend: {
      colors: {
        'dk-yellow': '#F3E719',
        'dk-black': '#0E0E0E',
        'dk-white': '#FFFFFF',
        'dk-gray': {
          50: '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#A0A0A0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          900: '#101010',
        }
      },
      fontFamily: {
        'display': ['Space Grotesk', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'body': ['Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'foundation': ['Foundation Sans', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        'touch': '44px',
        'touch-lg': '48px',
        'touch-xl': '52px',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-safe-area'),
    require('tailwindcss-container-queries'),
    require('tailwindcss-grid-template-areas'),
  ],
}
