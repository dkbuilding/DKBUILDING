const createDOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

/**
 * Request Sanitization - Protection XSS
 * Architecture GovTech pour DK BUILDING
 */

const window = new JSDOM("").window;
const DOMPurify = createDOMPurify(window);

const sanitizeInput = (req, res, next) => {
  // Fonction récursive pour sanitizer les objets imbriqués
  const sanitizeValue = (value) => {
    if (typeof value === "string") {
      return DOMPurify.sanitize(value, {
        ALLOWED_TAGS: [], // Retire tous les tags HTML
        KEEP_CONTENT: true, // Garde le contenu texte
      });
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

  // Sanitize body
  if (req.body && typeof req.body === "object") {
    req.body = sanitizeValue(req.body);
  }

  // Sanitize query params
  if (req.query && typeof req.query === "object") {
    req.query = sanitizeValue(req.query);
  }

  // Sanitize params
  if (req.params && typeof req.params === "object") {
    req.params = sanitizeValue(req.params);
  }

  next();
};

module.exports = sanitizeInput;
