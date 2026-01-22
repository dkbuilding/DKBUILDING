/** @type {import('tailwindcss').Config} */
export default {
  // Contenu de Tailwind
  //    - index.html
  //    - src/**/*.{js,ts,jsx,tsx}
  //    - tailwind.config.js
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./tailwind.config.js",
  ],
  // Theme de Tailwind
  //     Description des breakpoints sur 5000px (maximum assumé) :
  //      *XXXSM = xxx small, 
  //      *XXS = x small, 
  //      *XS = small, 
  //      *SM = Medium, 
  //      *MD = Large, 
  //      *LG = Extra Large, 
  //      *XL = 2X Large, 
  //      *2XL = 3X Large, 
  //      *3XL = 4X Large, 
  //      *4XL = 5X Large, 
  //      *5XL = 6X Large, 
  //      *6XL = 7X Large, 
  //      *7XL = 8X Large, 
  //      *8XL = 9X Large, 
  //      *9XL = 10X Large, 
  //      *10XL = 11X Large
  theme: {
    // Fondamentalement: 
    // XXXSM = xxx small, 
    // XXS = x small, 
    // XS = small, 
    // SM = Medium, 
    // MD = Large, 
    // LG = Extra Large, 
    // XL = 2X Large, 
    // 2XL = 3X Large, 
    // 3XL = 4X Large, 
    // 4XL = 5X Large, 
    // 5XL = 6X Large, 
    // 6XL = 7X Large, 
    // 7XL = 8X Large, 
    // 8XL = 9X Large, 
    // 9XL = 10X Large, 
    // 10XL = 11X Large
    screens: {
      'xxxsm': '240px', // Montres Fitness, Apple Watch, etc.
      'xxs': '320px',  // iPhone 3G, petits mobiles
      'xs': '375px',   // iPhone SE, petits mobiles
      'sm': '640px',   // Mobiles standards
      'md': '768px',   // Tablettes portrait
      'lg': '1024px',  // Tablettes landscape / petits desktops
      'xl': '1280px',  // Desktops standards
      '2xl': '1536px', // Grands écrans
      '3xl': '1920px', // Grands écrans
      '4xl': '2560px', // Grands écrans
      '5xl': '3840px', // Grands écrans
      '6xl': '5120px', // Grands écrans
      '7xl': '6400px', // Grands écrans
      '8xl': '7680px', // Grands écrans
      '9xl': '8960px', // Grands écrans
      '10xl': '10240px', // Grands écrans
    },
    extend: {
      // Couleurs
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
      // Polices de caractères
      fontFamily: {
        'display': ['Space Grotesk', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'body': ['Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
        'foundation': ['Foundation Sans', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      // Animations
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
      },
      // Keyframes
      keyframes: {
        // Animation de fade-in
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        // Animation de slide-up
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        // Animation de scale-in
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      // Espacements
      spacing: {
        // Espacements de 0.25rem à 100rem
        '0': '0rem',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        '11': '2.75rem',
        '12': '3rem',
        '13': '3.25rem',
        '14': '3.5rem',
        '15': '3.75rem',
        '16': '4rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '19': '4.75rem',
        '20': '5rem',
        '21': '5.25rem',
        '22': '5.5rem',
        '23': '5.75rem',
        '24': '6rem',
        '25': '6.25rem',
        '26': '6.5rem',
        '27': '6.75rem',
        '28': '7rem',
        '29': '7.25rem',
        '30': '7.5rem',
        '31': '7.75rem',
        '32': '8rem',
        '33': '8.25rem',
        '34': '8.5rem',
        '35': '8.75rem',
        '36': '9rem',
        '37': '9.25rem',
        '38': '9.5rem',
        '39': '9.75rem',
        '40': '10rem',
        '41': '10.25rem',
        '42': '10.5rem',
        '43': '10.75rem',
        '44': '11rem',
        '45': '11.25rem',
        '46': '11.5rem',
        '47': '11.75rem',
        '48': '12rem',
        '49': '12.25rem',
        '50': '12.5rem',
        '51': '12.75rem',
        '52': '13rem',
        '53': '13.25rem',
        '54': '13.5rem',
        '55': '13.75rem',
        '56': '14rem',
        '57': '14.25rem',
        '58': '14.5rem',
        '59': '14.75rem',
        '60': '15rem',
        '61': '15.25rem',
        '62': '15.5rem',
        '63': '15.75rem',
        '64': '16rem',
        '65': '16.25rem',
        '66': '16.5rem',
        '67': '16.75rem',
        '68': '17rem',
        '69': '17.25rem',
        '70': '17.5rem',
        '71': '17.75rem',
        '72': '18rem',
        '73': '18.25rem',
        '74': '18.5rem',
        '75': '18.75rem',
        '76': '19rem',
        '77': '19.25rem',
        '78': '19.5rem',
        '79': '19.75rem',
        '80': '20rem',
        '81': '20.25rem',
        '82': '20.5rem',
        '83': '20.75rem',
        '84': '21rem',
        '85': '21.25rem',
        '86': '21.5rem',
        '87': '21.75rem',
        '88': '22rem',
        '89': '22.25rem',
        '90': '22.5rem',
        '91': '22.75rem',
        '92': '23rem',
        '93': '23.25rem',
        '94': '23.5rem',
        '95': '23.75rem',
        '96': '24rem',
        '97': '24.25rem',
        '98': '24.5rem',
        '99': '24.75rem',
        '100': '25rem',
        '128': '32rem',
        '144': '36rem',
        '160': '40rem',
        '176': '44rem',
        '192': '48rem',
        '208': '52rem',
        '224': '56rem',
        '240': '60rem',
        '256': '64rem',
        '272': '68rem',
        '288': '72rem',
        '304': '76rem',
        '320': '80rem',
        '336': '84rem',
        '352': '88rem',
        '368': '92rem',
        '384': '96rem',
        '400': '100rem',
        // Touch targets
        'touch': '44px', // Minimum touch target WCAG
        'touch-lg': '48px', // Minimum touch target WCAG
        'touch-xl': '52px', // Minimum touch target WCAG
        'touch-2xl': '56px', // Minimum touch target WCAG
        'touch-3xl': '60px', // Minimum touch target WCAG
        'touch-4xl': '64px', // Minimum touch target WCAG
        'touch-5xl': '68px', // Minimum touch target WCAG
        'touch-6xl': '72px', // Minimum touch target WCAG
        'touch-7xl': '76px', // Minimum touch target WCAG
        'touch-8xl': '80px', // Minimum touch target WCAG
        'touch-9xl': '84px', // Minimum touch target WCAG
        'touch-10xl': '88px', // Minimum touch target WCAG
        // Safe area
        'safe': 'env(safe-area-inset-bottom)', // iOS safe area
        'safe-lg': 'env(safe-area-inset-bottom) + 48px', // iOS safe area
        'safe-xl': 'env(safe-area-inset-bottom) + 52px', // iOS safe area
        'safe-2xl': 'env(safe-area-inset-bottom) + 56px', // iOS safe area
        'safe-3xl': 'env(safe-area-inset-bottom) + 60px', // iOS safe area
        'safe-4xl': 'env(safe-area-inset-bottom) + 64px', // iOS safe area
        'safe-5xl': 'env(safe-area-inset-bottom) + 68px', // iOS safe area
        'safe-6xl': 'env(safe-area-inset-bottom) + 72px', // iOS safe area
        'safe-7xl': 'env(safe-area-inset-bottom) + 76px', // iOS safe area
        'safe-8xl': 'env(safe-area-inset-bottom) + 80px', // iOS safe area
        'safe-9xl': 'env(safe-area-inset-bottom) + 84px', // iOS safe area
        'safe-10xl': 'env(safe-area-inset-bottom) + 88px', // iOS safe area
      },
      // Effets de flou
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  // Plugins de Tailwind
  plugins: [
    require('tailwindcss-animate'),
    require('tailwindcss-safe-area'),
    require('tailwindcss-touch-targets'),
    require('tailwindcss-aspect-ratio'),
    require('tailwindcss-blur'),
    require('tailwindcss-container-queries'),
    require('tailwindcss-font-weight'),
    require('tailwindcss-gap'),
    require('tailwindcss-grid-template-areas'),
    require('tailwindcss-grid-template-columns'),
    require('tailwindcss-grid-template-rows'),
  ],
}
