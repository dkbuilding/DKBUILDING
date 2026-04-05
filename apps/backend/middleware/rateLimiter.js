const rateLimit = require("express-rate-limit");

/**
 * Rate Limiting - Protection DDoS et brute-force
 * Architecture GovTech pour DK BUILDING
 *
 * Niveaux de protection :
 * - publicLimiter  : routes publiques (100 req / 15 min)
 * - adminLimiter   : routes admin (50 req / 15 min, échecs seulement)
 * - loginLimiter   : tentatives de login (5 req / 15 min, échecs seulement)
 * - contactLimiter : formulaire de contact (10 req / 15 min)
 * - uploadLimiter  : uploads de fichiers (20 req / 15 min)
 */

// Rate limiter pour les routes publiques
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Trop de requêtes depuis cette IP, réessayez dans 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter strict pour les routes admin
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Plus strict pour l'admin
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Trop de tentatives admin, réessayez dans 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
});

// Rate limiter pour les tentatives de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Très strict pour le login
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Trop de tentatives de connexion, réessayez dans 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

// Rate limiter pour le formulaire de contact
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 soumissions max
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Trop de soumissions de formulaire, réessayez dans 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les uploads de fichiers
const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 uploads max
  message: {
    success: false,
    error: {
      code: "TOO_MANY_REQUESTS",
      message: "Trop d'uploads, réessayez dans 15 minutes",
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { publicLimiter, adminLimiter, loginLimiter, contactLimiter, uploadLimiter };
