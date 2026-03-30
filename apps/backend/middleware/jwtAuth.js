/**
 * Middleware d'Authentification JWT DK BUILDING
 * Sécurité niveau NSA - 128 bits minimum
 *
 * @author DK BUILDING Security Team
 * @version latest
 * @date 2025-01-25
 */

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

class JWTAuthMiddleware {
  constructor() {
    this.algorithm = "HS512";
    this.issuer = "dk-building-security";
    this.securityLevel = "NSA_128_BITS";
  }

  /**
   * Middleware d'authentification JWT
   * Vérifie la validité du token et les métadonnées de sécurité
   */
  authenticateToken(req, res, next) {
    try {
      // Chercher le token dans le cookie HttpOnly OU dans le header Authorization
      const cookieToken = req.cookies?.jwt_token;
      const headerToken = req.headers["authorization"]?.split(" ")[1];
      const token = cookieToken || headerToken;

      if (!token) {
        return res.status(401).json({
          error: "Token d'accès requis",
          code: "MISSING_TOKEN",
          security_level: this.securityLevel,
        });
      }

      // Récupération de la clé secrète depuis les variables d'environnement
      const secret = process.env.JWT_SECRET;
      const salt = process.env.JWT_SALT;
      const verificationHash = process.env.JWT_VERIFICATION_HASH;

      if (!secret || !salt || !verificationHash) {
        console.error(
          "Configuration JWT manquante dans les variables d'environnement",
        );
        return res.status(500).json({
          error: "Configuration de sécurité manquante",
          code: "SECURITY_CONFIG_ERROR",
        });
      }

      // Vérification de l'intégrité de la configuration
      if (!this.verifySecurityIntegrity(secret, salt, verificationHash)) {
        console.error("Intégrité de la configuration de sécurité compromise");
        return res.status(500).json({
          error: "Configuration de sécurité compromise",
          code: "SECURITY_INTEGRITY_ERROR",
        });
      }

      // Vérification du token JWT
      const decoded = jwt.verify(token, secret, {
        algorithms: [this.algorithm],
        issuer: this.issuer,
      });

      // Vérifications de sécurité supplémentaires
      if (!this.validateSecurityMetadata(decoded)) {
        return res.status(403).json({
          error: "Token de sécurité invalide",
          code: "INVALID_SECURITY_TOKEN",
          security_level: this.securityLevel,
        });
      }

      // Ajout des informations utilisateur à la requête
      req.user = {
        id: decoded.sub,
        role: decoded.role || null,
        permissions: decoded.permissions || [],
        issuer: decoded.iss,
        securityLevel: decoded.security_level,
        issuedAt: new Date(decoded.iat * 1000),
        expiresAt: new Date(decoded.exp * 1000),
      };

      // Log de sécurité
      this.logSecurityEvent("AUTH_SUCCESS", req.user, req.ip);

      next();
    } catch (error) {
      // Log de l'erreur de sécurité
      this.logSecurityEvent("AUTH_FAILED", { error: error.message }, req.ip);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({
          error: "Token expiré",
          code: "TOKEN_EXPIRED",
          security_level: this.securityLevel,
        });
      }

      if (error.name === "JsonWebTokenError") {
        return res.status(403).json({
          error: "Token invalide",
          code: "INVALID_TOKEN",
          security_level: this.securityLevel,
        });
      }

      return res.status(500).json({
        error: "Erreur de vérification du token",
        code: "TOKEN_VERIFICATION_ERROR",
      });
    }
  }

  /**
   * Vérifie l'intégrité de la configuration de sécurité
   *
   * @param {string} secret - Clé secrète JWT
   * @param {string} salt - Sel utilisé
   * @param {string} expectedHash - Hash de vérification attendu
   * @returns {boolean} - True si l'intégrité est vérifiée
   */
  verifySecurityIntegrity(secret, salt, expectedHash) {
    try {
      const verificationData = secret + salt;
      const calculatedHash = crypto
        .createHash("sha512")
        .update(verificationData)
        .digest("hex");

      return calculatedHash === expectedHash;
    } catch (error) {
      console.error("Erreur lors de la vérification d'intégrité:", error);
      return false;
    }
  }

  /**
   * Valide les métadonnées de sécurité du token
   *
   * @param {Object} decoded - Token décodé
   * @returns {boolean} - True si les métadonnées sont valides
   */
  validateSecurityMetadata(decoded) {
    // Vérification de l'émetteur
    if (decoded.iss !== this.issuer) {
      return false;
    }

    // Vérification du niveau de sécurité
    if (decoded.security_level !== this.securityLevel) {
      return false;
    }

    // Vérification de l'algorithme
    if (decoded.algorithm !== "sha512") {
      return false;
    }

    // Vérification de l'expiration
    const now = Math.floor(Date.now() / 1000);
    if (decoded.exp < now) {
      return false;
    }

    // Vérification des itérations PBKDF2
    if (!decoded.iterations || decoded.iterations < 100000) {
      return false;
    }

    return true;
  }

  /**
   * Génère un token JWT pour l'authentification Health Monitoring
   *
   * @param {string} password - Mot de passe fourni
   * @returns {Object} - Résultat de l'authentification
   */
  generateHealthToken(password) {
    try {
      const healthPassword = process.env.HEALTH_PASSWORD;

      if (!healthPassword) {
        throw new Error("Configuration du mot de passe Health manquante");
      }

      // Vérification du mot de passe avec comparaison sécurisée
      if (!this.securePasswordCompare(password, healthPassword)) {
        return {
          success: false,
          error: "Mot de passe incorrect",
          code: "INVALID_PASSWORD",
        };
      }

      // Génération du token
      const secret = process.env.JWT_SECRET;
      const payload = {
        iss: this.issuer,
        sub: "health-monitoring",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
        role: 'admin',
        security_level: this.securityLevel,
        algorithm: "sha512",
        iterations: parseInt(process.env.SECURITY_ITERATIONS) || 100000,
        permissions: ["health:read", "health:monitor"],
      };

      const token = jwt.sign(payload, secret, { algorithm: this.algorithm });

      // Log de l'authentification réussie
      this.logSecurityEvent("HEALTH_AUTH_SUCCESS", {
        user: "health-monitoring",
        permissions: payload.permissions,
      });

      return {
        success: true,
        token,
        expires_in: "30m",
        permissions: payload.permissions,
        security_level: this.securityLevel,
      };
    } catch (error) {
      this.logSecurityEvent("HEALTH_AUTH_FAILED", { error: error.message });
      return {
        success: false,
        error: "Erreur lors de la génération du token",
        code: "TOKEN_GENERATION_ERROR",
      };
    }
  }

  /**
   * Comparaison sécurisée des mots de passe
   * Utilise crypto.timingSafeEqual pour éviter les attaques par timing
   *
   * @param {string} provided - Mot de passe fourni
   * @param {string} stored - Mot de passe stocké
   * @returns {boolean} - True si les mots de passe correspondent
   */
  securePasswordCompare(provided, stored) {
    try {
      const providedHash = crypto.createHash('sha256').update(String(provided)).digest();
      const storedHash = crypto.createHash('sha256').update(String(stored)).digest();
      return crypto.timingSafeEqual(providedHash, storedHash);
    } catch (error) {
      console.error("Erreur lors de la comparaison des mots de passe:", error);
      return false;
    }
  }

  /**
   * Log des événements de sécurité
   *
   * @param {string} event - Type d'événement
   * @param {Object} data - Données de l'événement
   * @param {string} ip - Adresse IP (optionnel)
   */
  logSecurityEvent(event, data, ip = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      data,
      ip: ip || "unknown",
      security_level: this.securityLevel,
    };

    // Log dans la console en développement
    if (process.env.NODE_ENV === "development") {
      console.log(`🔒 [SECURITY] ${event}:`, logEntry);
    }

    // TODO: Implémenter un système de logging sécurisé en production
    // (fichier chiffré, base de données sécurisée, etc.)
  }

  /**
   * Middleware de vérification du rôle admin
   * Vérifie que l'utilisateur authentifié possède le rôle admin ou superadmin
   */
  checkAdminRole(req, res, next) {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentification requise",
      });
    }

    if (req.user.role !== "admin" && req.user.role !== "superadmin") {
      this.logSecurityEvent("ADMIN_ACCESS_DENIED", {
        user: req.user.id,
        role: req.user.role,
      }, req.ip);

      return res.status(403).json({
        success: false,
        error: "Accès admin requis",
        message: "Vous n'avez pas les permissions nécessaires pour cette action",
      });
    }

    next();
  }

  /**
   * Middleware pour vérifier les permissions spécifiques
   *
   * @param {Array} requiredPermissions - Permissions requises
   * @returns {Function} - Middleware Express
   */
  requirePermissions(requiredPermissions) {
    return (req, res, next) => {
      if (!req.user || !req.user.permissions) {
        return res.status(403).json({
          error: "Permissions manquantes",
          code: "MISSING_PERMISSIONS",
        });
      }

      const hasPermission = requiredPermissions.every((permission) =>
        req.user.permissions.includes(permission),
      );

      if (!hasPermission) {
        this.logSecurityEvent(
          "PERMISSION_DENIED",
          {
            user: req.user.id,
            required: requiredPermissions,
            actual: req.user.permissions,
          },
          req.ip,
        );

        return res.status(403).json({
          error: "Permissions insuffisantes",
          code: "INSUFFICIENT_PERMISSIONS",
          required: requiredPermissions,
        });
      }

      next();
    };
  }
}

module.exports = JWTAuthMiddleware;
