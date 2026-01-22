/**
 * Système de logging conditionnel
 * Désactive automatiquement les logs en production pour économiser la mémoire
 * Garde uniquement les erreurs critiques
 */

const isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
const isProduction = import.meta.env.PROD || import.meta.env.MODE === 'production';

/**
 * Logger conditionnel - Log uniquement en développement
 * @param {...any} args - Arguments à logger
 */
export const log = (...args) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * Logger de debug - Log uniquement en développement
 * @param {...any} args - Arguments à logger
 */
export const debug = (...args) => {
  if (isDevelopment) {
    console.debug(...args);
  }
};

/**
 * Logger d'information - Log uniquement en développement
 * @param {...any} args - Arguments à logger
 */
export const info = (...args) => {
  if (isDevelopment) {
    console.info(...args);
  }
};

/**
 * Logger d'avertissement - Toujours loggé (mais peut être filtré en production)
 * @param {...any} args - Arguments à logger
 */
export const warn = (...args) => {
  // En production, on peut choisir de ne logger que les warnings critiques
  if (isDevelopment || import.meta.env.ENABLE_WARNINGS === 'true') {
    console.warn(...args);
  }
};

/**
 * Logger d'erreur - TOUJOURS loggé (critique)
 * @param {...any} args - Arguments à logger
 */
export const error = (...args) => {
  // Les erreurs sont toujours loggées, même en production
  console.error(...args);
};

/**
 * Logger de performance - Log uniquement en développement
 * @param {...any} args - Arguments à logger
 */
export const perf = (...args) => {
  if (isDevelopment) {
    console.log('⏱️ [PERF]', ...args);
  }
};

/**
 * Logger de scroll - DÉSACTIVÉ par défaut (trop verbeux)
 * Peut être activé avec ENABLE_SCROLL_LOGS=true
 * @param {...any} args - Arguments à logger
 */
export const scroll = (...args) => {
  // Les logs de scroll sont désactivés par défaut car trop verbeux
  if (isDevelopment && import.meta.env.ENABLE_SCROLL_LOGS === 'true') {
    console.log('📜 [SCROLL]', ...args);
  }
};

/**
 * Logger de navigation - Log uniquement en développement
 * @param {...any} args - Arguments à logger
 */
export const nav = (...args) => {
  if (isDevelopment) {
    console.log('🧭 [NAV]', ...args);
  }
};

/**
 * Logger de vidéo - DÉSACTIVÉ par défaut (trop verbeux)
 * Peut être activé avec ENABLE_VIDEO_LOGS=true
 * @param {...any} args - Arguments à logger
 */
export const video = (...args) => {
  // Les logs de vidéo sont désactivés par défaut car trop verbeux
  if (isDevelopment && import.meta.env.ENABLE_VIDEO_LOGS === 'true') {
    console.log('🎥 [VIDEO]', ...args);
  }
};

// Export par défaut avec toutes les méthodes
const logger = {
  log,
  debug,
  info,
  warn,
  error,
  perf,
  scroll,
  nav,
  video,
  isDevelopment,
  isProduction
};

export default logger;

