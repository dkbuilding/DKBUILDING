/**
 * Request Sanitization - Protection XSS
 *
 * SÉCURITÉ :
 * - Appliqué globalement sur toutes les requêtes entrantes
 * - Supprime les scripts, event handlers, et vecteurs XSS connus
 * - Préserve la structure HTML de base pour le contenu éditeur riche
 *   (les tags dangereux sont supprimés, les tags de mise en forme conservés)
 * - Les valeurs sont nettoyées récursivement dans body, query et params
 */

/**
 * Expressions régulières compilées une seule fois (performance)
 */
const PATTERNS = {
  // Tags de script (y compris avec attributs et variantes d'encodage)
  scriptTags: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  // Event handlers inline (onclick, onerror, onload, etc.)
  eventHandlers: /\s*on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi,
  // javascript: protocol dans les URLs
  jsProtocol: /javascript\s*:/gi,
  // vbscript: protocol
  vbProtocol: /vbscript\s*:/gi,
  // data: URLs avec types dangereux (text/html, application/javascript, etc.)
  dataUrls: /data\s*:\s*(?:text\/html|application\/javascript|application\/x-javascript|text\/javascript)/gi,
  // Tags dangereux (iframe, embed, object, form, base, link avec import)
  dangerousTags: /<\s*\/?\s*(script|iframe|embed|object|applet|form|base|link|meta|svg|math)\b[^>]*>/gi,
  // Expression: et expression() CSS (vecteur XSS IE)
  cssExpression: /expression\s*\(/gi,
  // Import CSS
  cssImport: /@import\s/gi,
  // Commentaires HTML qui pourraient masquer du code
  htmlComments: /<!--[\s\S]*?-->/g,
  // Null bytes (utilisés pour contourner les filtres)
  nullBytes: /\0/g,
};

/**
 * Nettoie une chaîne de caractères contre les vecteurs XSS.
 *
 * @param {string} str - Chaîne à nettoyer
 * @returns {string} - Chaîne nettoyée
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;

  let clean = str;

  // 1. Supprimer les null bytes (contournement de filtres)
  clean = clean.replace(PATTERNS.nullBytes, '');

  // 2. Supprimer les commentaires HTML
  clean = clean.replace(PATTERNS.htmlComments, '');

  // 3. Supprimer les tags de script complets
  clean = clean.replace(PATTERNS.scriptTags, '');

  // 4. Supprimer les tags dangereux (iframe, embed, object, etc.)
  clean = clean.replace(PATTERNS.dangerousTags, '');

  // 5. Supprimer les event handlers inline
  clean = clean.replace(PATTERNS.eventHandlers, '');

  // 6. Supprimer les javascript: URLs
  clean = clean.replace(PATTERNS.jsProtocol, '');

  // 7. Supprimer les vbscript: URLs
  clean = clean.replace(PATTERNS.vbProtocol, '');

  // 8. Supprimer les data: URLs dangereuses
  clean = clean.replace(PATTERNS.dataUrls, '');

  // 9. Supprimer les expressions CSS (vecteur XSS IE)
  clean = clean.replace(PATTERNS.cssExpression, '');

  // 10. Supprimer les @import CSS
  clean = clean.replace(PATTERNS.cssImport, '');

  return clean;
}

/**
 * Nettoie récursivement une valeur (string, array, object).
 *
 * @param {*} value - Valeur à nettoyer
 * @param {number} depth - Profondeur actuelle (protection contre les objets circulaires)
 * @returns {*} - Valeur nettoyée
 */
function sanitizeValue(value, depth = 0) {
  // Protection contre les objets très profonds (DoS)
  if (depth > 10) return value;

  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(item => sanitizeValue(item, depth + 1));
  }

  if (value && typeof value === "object") {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      // Nettoyer aussi les clés (un attaquant pourrait mettre du JS dans une clé)
      const cleanKey = typeof key === 'string' ? sanitizeString(key) : key;
      sanitized[cleanKey] = sanitizeValue(value[key], depth + 1);
    }
    return sanitized;
  }

  return value;
}

/**
 * Middleware Express de sanitization.
 * Nettoie body, query et params de chaque requête.
 */
const sanitizeInput = (req, res, next) => {
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  if (req.query && typeof req.query === "object") {
    req.query = sanitizeValue(req.query);
  }

  if (req.params && typeof req.params === "object") {
    req.params = sanitizeValue(req.params);
  }

  next();
};

module.exports = sanitizeInput;
