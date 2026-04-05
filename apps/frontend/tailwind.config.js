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
        // Jaune signature — accent BTP
        'dk-yellow': {
          50:  '#FEFCE8',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#F3E719',
          600: '#D4C916',
          700: '#A89213',
          800: '#7C6C0F',
          900: '#5A4E0B',
          950: '#332D06',
          DEFAULT: '#F3E719',
        },
        // Noir profond
        'dk-black': '#0E0E0E',
        // Blanc
        'dk-white': '#FFFFFF',
        // Gris — surfaces, bordures, textes
        'dk-gray': {
          50:  '#F8F8F8',
          100: '#F0F0F0',
          200: '#E0E0E0',
          300: '#C0C0C0',
          400: '#A0A0A0',
          500: '#808080',
          600: '#606060',
          700: '#404040',
          800: '#202020',
          850: '#1A1A1A',
          900: '#101010',
          950: '#0A0A0A',
        },
        // Sémantiques
        'dk-success': '#22C55E',
        'dk-warning': '#F59E0B',
        'dk-error':   '#EF4444',
        'dk-info':    '#3B82F6',
      },
      fontFamily: {
        'display': ['Foundation Sans', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'heading': ['Space Grotesk', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'body': ['Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        // Aliases pour compatibilité avec l'existant
        'foundation': ['Foundation Sans', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      borderRadius: {
        'sm':  '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)',
        'medium': '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)',
        'heavy':  '0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3)',
        'glow':   '0 0 20px rgba(243, 231, 25, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
        'card':   '0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
        'inner':  'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
      },
      spacing: {
        'touch':    '44px',
        'touch-lg': '48px',
        'touch-xl': '52px',
      },
      zIndex: {
        'above':     '10',
        'dropdown':  '50',
        'sticky':    '100',
        'overlay':   '500',
        'modal':     '1000',
        'toast':     '2000',
        'tooltip':   '3000',
        'lockscreen': '10000',
      },
      animation: {
        'fade-in':  'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%':   { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-safe-area'),
    require('tailwindcss-container-queries'),
    require('tailwindcss-grid-template-areas'),
  ],
}
