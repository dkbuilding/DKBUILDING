/**
 * Request Sanitization - Protection XSS
 * Remplace DOMPurify+JSDOM (incompatible Node 24 ESM) par un sanitizer léger
 */

/**
 * Échappe les caractères HTML dangereux
 */
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Supprime les tags HTML et les attributs d'événements dangereux
 */
function stripTags(str) {
  return str
    // Supprimer tous les tags HTML
    .replace(/<[^>]*>/g, '')
    // Supprimer les event handlers (onclick, onerror, etc.)
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    // Supprimer les javascript: URLs
    .replace(/javascript\s*:/gi, '')
    // Supprimer les data: URLs potentiellement dangereuses
    .replace(/data\s*:\s*text\/html/gi, '');
}

const sanitizeInput = (req, res, next) => {
  const sanitizeValue = (value) => {
    if (typeof value === "string") {
      return stripTags(value);
    }

    if (Array.isArray(value)) {
      return value.map(sanitizeValue);
    }

    if (value && typeof value === "object") {
      const sanitized = {};
      for (const key in value) {
        sanitized[key] = sanitizeValue(value[key]);
      }
      return sanitized;
    }

    return value;
  };

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
