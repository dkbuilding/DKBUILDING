/**
 * Design Tokens centralisés — DK BUILDING
 * 
 * Source unique de vérité pour toutes les valeurs de design.
 * Ces tokens sont consommés par :
 *   - tailwind.config.js (via import)
 *   - Les composants React (via import direct)
 *   - Les animations GSAP (via motionTokens)
 * 
 * Convention BTP : palette sobre, professionnelle, robuste.
 * Noir dominant + jaune accent (signalétique chantier).
 */

// ─────────────────────────────────────────────
// COULEURS
// ─────────────────────────────────────────────

export const colors = {
  /** Jaune signature DK BUILDING — rappel signalétique BTP */
  yellow: {
    50:  '#FEFCE8',
    100: '#FEF9C3',
    200: '#FEF08A',
    300: '#FDE047',
    400: '#FACC15',
    500: '#F3E719', // Couleur principale
    600: '#D4C916',
    700: '#A89213',
    800: '#7C6C0F',
    900: '#5A4E0B',
    950: '#332D06',
  },

  /** Noir profond — fond principal */
  black: '#0E0E0E',

  /** Blanc pur */
  white: '#FFFFFF',

  /** Nuances de gris — surfaces, bordures, textes secondaires */
  gray: {
    50:  '#F8F8F8',
    100: '#F0F0F0',
    200: '#E0E0E0',
    300: '#C0C0C0',
    400: '#A0A0A0',
    500: '#808080',
    600: '#606060',
    700: '#404040',
    800: '#202020',
    850: '#1A1A1A', // Surface élevée (cards admin, sidebar)
    900: '#101010',
    950: '#0A0A0A',
  },

  /** Couleurs sémantiques */
  semantic: {
    success: '#22C55E',
    warning: '#F59E0B',
    error:   '#EF4444',
    info:    '#3B82F6',
  },
} as const;

// ─────────────────────────────────────────────
// TYPOGRAPHIE
// ─────────────────────────────────────────────

export const typography = {
  /** Familles de polices */
  fontFamily: {
    display:    ['Foundation Sans', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    heading:    ['Space Grotesk', 'Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
    body:       ['Montserrat', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
  },

  /** Tailles avec line-height intégrée [fontSize, { lineHeight, letterSpacing? }] */
  fontSize: {
    'xs':   ['0.75rem',   { lineHeight: '1rem' }],
    'sm':   ['0.875rem',  { lineHeight: '1.25rem' }],
    'base': ['1rem',      { lineHeight: '1.5rem' }],
    'lg':   ['1.125rem',  { lineHeight: '1.75rem' }],
    'xl':   ['1.25rem',   { lineHeight: '1.75rem' }],
    '2xl':  ['1.5rem',    { lineHeight: '2rem' }],
    '3xl':  ['1.875rem',  { lineHeight: '2.25rem' }],
    '4xl':  ['2.25rem',   { lineHeight: '2.5rem', letterSpacing: '-0.02em' }],
    '5xl':  ['3rem',      { lineHeight: '1.2', letterSpacing: '-0.02em' }],
    '6xl':  ['3.75rem',   { lineHeight: '1.1', letterSpacing: '-0.02em' }],
    '7xl':  ['4.5rem',    { lineHeight: '1.1', letterSpacing: '-0.03em' }],
    '8xl':  ['6rem',      { lineHeight: '1', letterSpacing: '-0.03em' }],
  },
} as const;

// ─────────────────────────────────────────────
// ESPACEMENT (base 4px)
// ─────────────────────────────────────────────

export const spacing = {
  'touch':    '44px',  // Taille minimale zone tactile (WCAG)
  'touch-lg': '48px',
  'touch-xl': '52px',
} as const;

// ─────────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────────

export const borderRadius = {
  'sm':   '0.375rem',  // 6px — badges, petits éléments
  'md':   '0.5rem',    // 8px — inputs, boutons
  'lg':   '0.75rem',   // 12px — cards, modals
  'xl':   '1rem',      // 16px — sections, grands conteneurs
  '2xl':  '1.5rem',    // 24px — hero cards
  'full': '9999px',    // Cercles, pills
} as const;

// ───────────────────────────────────────��─────
// OMBRES (combinaison claire/foncée pour profondeur)
// ─────────────────────────────────────────────

export const boxShadow = {
  /** Ombre subtile — survol léger, éléments flottants discrets */
  'subtle':  '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.15)',
  /** Ombre moyenne — cards, dropdowns */
  'medium':  '0 4px 6px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.2)',
  /** Ombre forte — modals, popovers */
  'heavy':   '0 10px 25px rgba(0, 0, 0, 0.5), 0 4px 10px rgba(0, 0, 0, 0.3)',
  /** Ombre avec accent jaune — CTA, éléments mis en avant */
  'glow':    '0 0 20px rgba(243, 231, 25, 0.15), 0 4px 12px rgba(0, 0, 0, 0.3)',
  /** Ombre pour les cards au survol */
  'card':    '0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.2)',
  /** Ombre intérieure pour les inputs focus */
  'inner':   'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
  /** Pas d'ombre */
  'none':    'none',
} as const;

// ─────────────────────────────────────────────
// TRANSITIONS
// ─────────────────────────────────────────────

export const transition = {
  'fast':    '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  'normal':  '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  'slow':    '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  'spring':  '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

// ─────────────────────────────────────────────
// BREAKPOINTS (cohérent avec tailwind.config.js)
// ─────────────────────────────────────────────

export const screens = {
  'xxs': '320px',
  'xs':  '375px',
  'sm':  '640px',
  'md':  '768px',
  'lg':  '1024px',
  'xl':  '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
} as const;

// ─────────────────────────────────────────────
// Z-INDEX (échelle structurée)
// ─────────────────────────────────────────────

export const zIndex = {
  'base':      '0',
  'above':     '10',
  'dropdown':  '50',
  'sticky':    '100',
  'overlay':   '500',
  'modal':     '1000',
  'toast':     '2000',
  'tooltip':   '3000',
  'lockscreen': '10000',
} as const;
