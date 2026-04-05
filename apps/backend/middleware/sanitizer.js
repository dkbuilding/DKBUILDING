/**
 * Request Sanitization — Protection XSS
 *
 * Utilise sanitize-html (bibliothèque éprouvée) au lieu de regex maison.
 * sanitize-html gère correctement les encodages alternatifs, les tags malformés,
 * et les vecteurs XSS que les regex ne peuvent pas couvrir.
 *
 * SÉCURITÉ :
 * - Appliqué globalement sur toutes les requêtes entrantes
 * - Supprime TOUS les tags HTML et attributs par défaut (allowedTags: [])
 * - Les valeurs sont nettoyées récursivement dans body, query et params
 * - Protection contre les objets profonds (DoS) avec limite de profondeur
 */

const sanitizeHtml = require("sanitize-html");

/**
 * Configuration stricte : aucun HTML autorisé.
 * Les données entrantes dans une API REST n'ont pas besoin de HTML.
 */
const SANITIZE_OPTIONS = {
  allowedTags: [],
  allowedAttributes: {},
  disallowedTagsMode: "recursiveEscape",
};

/**
 * Nettoie une chaîne de caractères contre les vecteurs XSS.
 *
 * @param {string} str - Chaîne à nettoyer
 * @returns {string} - Chaîne nettoyée
 */
function sanitizeString(str) {
  if (typeof str !== "string") return str;
  return sanitizeHtml(str, SANITIZE_OPTIONS);
}

/**
 * Nettoie récursivement une valeur (string, array, object).
 *
 * @param {*} value - Valeur à nettoyer
 * @param {number} depth - Profondeur actuelle (protection DoS)
 * @returns {*} - Valeur nettoyée
 */
function sanitizeValue(value, depth = 0) {
  // Protection contre les objets très profonds (DoS)
  if (depth > 10) return value;

  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item, depth + 1));
  }

  if (value && typeof value === "object") {
    const sanitized = {};
    for (const key of Object.keys(value)) {
      const cleanKey = typeof key === "string" ? sanitizeString(key) : key;
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
