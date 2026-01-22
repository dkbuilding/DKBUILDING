/**
 * Utilitaire pour naviguer vers les pages d'erreur
 * @param {string} errorCode - Le code d'erreur HTTP (ex: '404', '500')
 * @param {Function} navigate - La fonction navigate de React Router
 */
export const navigateToError = (errorCode, navigate) => {
  navigate(`/error/${errorCode}`);
};

/**
 * Utilitaire pour rediriger vers une page d'erreur depuis le code d'erreur HTTP
 * @param {number} statusCode - Le code de statut HTTP
 * @param {Function} navigate - La fonction navigate de React Router
 */
export const handleHttpError = (statusCode, navigate) => {
  const errorCode = statusCode.toString();
  navigateToError(errorCode, navigate);
};

/**
 * Utilitaire pour obtenir les informations d'erreur depuis le code
 * @param {string} errorCode - Le code d'erreur
 * @returns {Object|null} Les informations d'erreur ou null si non trouvé
 */
import errorMessagesData from '../data/errorMessages.json';

export const getErrorInfo = (errorCode) => {
  try {
    return errorMessagesData[errorCode] || null;
  } catch {
    console.error('Erreur lors du chargement des messages d\'erreur');
    return null;
  }
};

/**
 * Utilitaire pour déterminer le type d'erreur
 * @param {string} errorCode - Le code d'erreur
 * @returns {string} Le type d'erreur ('info', 'client', 'server', 'redirect')
 */
export const getErrorType = (errorCode) => {
  if (errorCode.startsWith('1')) return 'info';
  if (errorCode.startsWith('2')) return 'success';
  if (errorCode.startsWith('3')) return 'redirect';
  if (errorCode.startsWith('4')) return 'client';
  if (errorCode.startsWith('5')) return 'server';
  return 'unknown';
};
