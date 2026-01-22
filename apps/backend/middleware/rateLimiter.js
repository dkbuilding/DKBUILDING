const rateLimit = require("express-rate-limit");

/**
 * Rate Limiting - Protection DDoS
 * Architecture GovTech pour DK BUILDING
 */

// Rate limiter pour les routes publiques
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requêtes max
  message: {
    success: false,
    error: "Trop de requêtes depuis cette IP, réessayez dans 15 minutes",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiter strict pour les routes admin
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Plus strict pour l'admin
  message: {
    success: false,
    error: "Trop de tentatives admin, réessayez dans 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Ne compte que les échecs
});

// Rate limiter pour les tentatives de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Très strict pour le login
  message: {
    success: false,
    error: "Trop de tentatives de connexion, réessayez dans 15 minutes",
  },
  skipSuccessfulRequests: true,
});

module.exports = { publicLimiter, adminLimiter, loginLimiter };
