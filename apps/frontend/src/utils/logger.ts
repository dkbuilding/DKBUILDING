/**
 * Système de logging conditionnel
 * Désactive automatiquement les logs en production pour économiser la mémoire
 * Garde uniquement les erreurs critiques
 */

const isDevelopment: boolean = import.meta.env.DEV || import.meta.env.MODE === 'development';
const isProduction: boolean = import.meta.env.PROD || import.meta.env.MODE === 'production';

/** Logger conditionnel - Log uniquement en développement */
export const log = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/** Logger de debug - Log uniquement en développement */
export const debug = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.debug(...args);
  }
};

/** Logger d'information - Log uniquement en développement */
export const info = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.info(...args);
  }
};

/** Logger d'avertissement - Toujours loggé en dev, filtrable en production */
export const warn = (...args: unknown[]): void => {
  if (isDevelopment || import.meta.env.ENABLE_WARNINGS === 'true') {
    console.warn(...args);
  }
};

/** Logger d'erreur - TOUJOURS loggé (critique) */
export const error = (...args: unknown[]): void => {
  console.error(...args);
};

/** Logger de performance - Log uniquement en développement */
export const perf = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.log('⏱️ [PERF]', ...args);
  }
};

/** Logger de scroll - DÉSACTIVÉ par défaut (trop verbeux) */
export const scroll = (...args: unknown[]): void => {
  if (isDevelopment && import.meta.env.ENABLE_SCROLL_LOGS === 'true') {
    console.log('📜 [SCROLL]', ...args);
  }
};

/** Logger de navigation - Log uniquement en développement */
export const nav = (...args: unknown[]): void => {
  if (isDevelopment) {
    console.log('🧭 [NAV]', ...args);
  }
};

/** Logger de vidéo - DÉSACTIVÉ par défaut (trop verbeux) */
export const video = (...args: unknown[]): void => {
  if (isDevelopment && import.meta.env.ENABLE_VIDEO_LOGS === 'true') {
    console.log('🎥 [VIDEO]', ...args);
  }
};

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
} as const;

export default logger;
