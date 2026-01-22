/**
 * Détecte le sous-domaine depuis l'URL actuelle
 * @returns {string|null} Le sous-domaine détecté ou null
 */
export function detectSubdomain() {
  if (typeof window === 'undefined') return null;
  
  const hostname = window.location.hostname;
  
  // En développement local
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    // Vérifier si on est sur le port admin (optionnel)
    return null;
  }
  
  // Extraire le sous-domaine
  const parts = hostname.split('.');
  
  // Si on a au moins 3 parties (admin.dkbuilding.fr) ou 2 parties en local
  if (parts.length >= 3) {
    const subdomain = parts[0];
    // Vérifier si c'est un sous-domaine admin
    if (subdomain === 'admin' || subdomain === 'administrateur' || subdomain === 'administrator') {
      return 'admin';
    }
  }
  
  return null;
}

/**
 * Vérifie si on est sur le sous-domaine admin
 * @returns {boolean}
 */
export function isAdminSubdomain() {
  return detectSubdomain() === 'admin';
}

/**
 * Obtient le domaine principal (sans sous-domaine)
 * @returns {string}
 */
export function getMainDomain() {
  if (typeof window === 'undefined') return 'dkbuilding.fr';
  
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  
  // Retourner les 2 dernières parties (dkbuilding.fr)
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }
  
  return hostname;
}

