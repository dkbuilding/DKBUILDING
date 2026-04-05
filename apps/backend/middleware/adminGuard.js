const { adminLimiter } = require("./rateLimiter");
const ipWhitelist = require("./ipWhitelist");
const JWTAuthMiddleware = require("./jwtAuth");

/**
 * Admin Guard - Middleware de Protection Admin
 * Architecture GovTech pour DK BUILDING
 *
 * Combine tous les niveaux de sécurité pour les routes admin:
 * 1. IP Whitelisting (si configuré)
 * 2. Rate Limiting strict
 * 3. Authentification JWT
 * 4. Vérification du rôle admin
 */

// Instance du middleware JWT
const jwtAuth = new JWTAuthMiddleware();

// Middleware de vérification du rôle admin
const checkAdminRole = (req, res, next) => {
  // Vérifier que l'utilisateur est authentifié
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: "Authentification requise",
    });
  }

  // Vérifier le rôle admin
  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      error: "Accès admin requis",
      message:
        "Vous n'avez pas les permissions nécessaires pour accéder à cette ressource",
    });
  }

  // Utilisateur admin vérifié, continuer
  next();
};

/**
 * Admin Guard complet
 * Applique tous les middlewares de sécurité dans l'ordre
 */
const adminGuard = [
  // 1. Rate limiting strict (50 requêtes / 15 min)
  adminLimiter,

  // 2. IP Whitelisting (si configuré en production)
  // Note: Désactivé par défaut en développement
  process.env.NODE_ENV === "production"
    ? ipWhitelist
    : (req, res, next) => next(),

  // 3. Authentification JWT
  jwtAuth.authenticateToken.bind(jwtAuth),

  // 4. Vérification du rôle admin
  checkAdminRole,
];

/**
 * Admin Guard léger (sans IP whitelisting)
 * Pour les environnements où l'IP whitelisting n'est pas souhaité
 */
const adminGuardLight = [
  adminLimiter,
  jwtAuth.authenticateToken.bind(jwtAuth),
  checkAdminRole,
];

module.exports = {
  adminGuard,
  adminGuardLight,
  checkAdminRole,
};
