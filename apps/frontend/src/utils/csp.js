/**
 * Utilitaire pour générer des Content Security Policy (CSP) dynamiques
 * selon l'environnement (développement ou production)
 * 
 * @author DK BUILDING
 * @version latest
 */

/**
 * Génère une CSP selon le mode (development ou production)
 * 
 * @param {string} mode - Mode de l'application ('development' ou 'production')
 * @returns {string} Directive CSP complète
 */
export function generateCSP(mode = 'production') {
  const isDev = mode === 'development';

  if (isDev) {
    // CSP permissif pour le développement
    // Autorise HMR, WebSocket, et les tunnels Cloudflare
    return [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com", // Vite HMR nécessite unsafe-eval
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Tailwind et styles inline
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com",
      "media-src 'self' https://static.vecteezy.com",
      "connect-src 'self' ws: wss: http://localhost:* http://127.0.0.1:* http://192.168.1.124:* *.trycloudflare.com", // HMR WebSocket + Cloudflare Tunnel (pas d'upgrade HTTPS en dev)
      "worker-src 'self' blob:",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
      // Pas de upgrade-insecure-requests en dev pour permettre HTTP localhost
    ].join('; ');
  } else {
    // CSP strict pour la production
    return [
      "default-src 'self'",
      "script-src 'self' https://www.googletagmanager.com", // Pas d'unsafe-inline/eval en production
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com", // Nécessaire pour Tailwind CSS
      "font-src 'self' data: https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://images.unsplash.com",
      "media-src 'self' https://static.vecteezy.com",
      "connect-src 'self'", // API backend uniquement
      "worker-src 'self' blob:",
      "frame-src 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
      "block-all-mixed-content"
    ].join('; ');
  }
}

/**
 * Génère la balise meta CSP pour injection dans le HTML
 * 
 * @param {string} mode - Mode de l'application
 * @returns {string} Balise meta complète
 */
export function generateCSPMetaTag(mode = 'production') {
  const csp = generateCSP(mode);
  return `<meta http-equiv="Content-Security-Policy" content="${csp.replace(/"/g, '&quot;')}" />`;
}

/**
 * Détecte automatiquement le mode depuis les variables d'environnement
 * 
 * @returns {string} Mode détecté ('development' ou 'production')
 */
export function detectMode() {
  // Vérifier import.meta.env.MODE (Vite)
  if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env.MODE || 'production';
  }
  
  // Vérifier process.env.NODE_ENV (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    return process.env.NODE_ENV === 'development' ? 'development' : 'production';
  }
  
  // Par défaut, production
  return 'production';
}

/**
 * Génère le CSP pour le mode actuel (détection automatique)
 * 
 * @returns {string} Directive CSP complète
 */
export function generateCSPForCurrentMode() {
  const mode = detectMode();
  return generateCSP(mode);
}

