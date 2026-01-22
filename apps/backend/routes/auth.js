/**
 * Route d'Authentification Health Monitoring DK BUILDING
 * Endpoint sécurisé pour l'authentification JWT
 *
 * @author DK BUILDING Security Team
 * @version latest
 * @date 2025-01-25
 */

const express = require("express");
const router = express.Router();
const JWTAuthMiddleware = require("../middleware/jwtAuth");

const jwtAuth = new JWTAuthMiddleware();

/**
 * POST /auth/health
 * Authentification pour l'accès au Health Monitoring
 *
 * Body: { password: string }
 * Response: { success: boolean, token?: string, error?: string }
 */
router.post("/health", async (req, res) => {
  try {
    const { password } = req.body;

    // Validation de l'entrée
    if (!password || typeof password !== "string") {
      return res.status(400).json({
        success: false,
        error: "Mot de passe requis",
        code: "MISSING_PASSWORD",
      });
    }

    // Vérification de la longueur minimale
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: "Mot de passe trop court (minimum 8 caractères)",
        code: "PASSWORD_TOO_SHORT",
      });
    }

    // Génération du token JWT
    const authResult = jwtAuth.generateHealthToken(password);

    if (!authResult.success) {
      return res.status(401).json({
        success: false,
        error: authResult.error,
        code: authResult.code,
      });
    }

    // Réponse de succès
    res.json({
      success: true,
      token: authResult.token,
      expires_in: authResult.expires_in,
      permissions: authResult.permissions,
      security_level: authResult.security_level,
      message: "Authentification réussie",
    });
  } catch (error) {
    console.error("Erreur lors de l'authentification Health:", error);

    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

/**
 * POST /auth/verify
 * Vérification d'un token JWT existant
 *
 * Headers: Authorization: Bearer <token>
 * Response: { valid: boolean, user?: object, error?: string }
 */
router.post("/verify", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  try {
    res.json({
      valid: true,
      user: {
        id: req.user.id,
        issuer: req.user.issuer,
        security_level: req.user.security_level,
        issued_at: req.user.issuedAt,
        expires_at: req.user.expiresAt,
      },
      message: "Token valide",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);

    res.status(500).json({
      valid: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

/**
 * GET /auth/status
 * Statut de la configuration d'authentification
 *
 * Response: { configured: boolean, security_level: string, algorithm: string }
 */
router.get("/status", (req, res) => {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const jwtSalt = process.env.JWT_SALT;
    const jwtVerificationHash = process.env.JWT_VERIFICATION_HASH;
    const healthPassword = process.env.HEALTH_PASSWORD;

    const isConfigured = !!(
      jwtSecret &&
      jwtSalt &&
      jwtVerificationHash &&
      healthPassword
    );

    res.json({
      configured: isConfigured,
      security_level: process.env.JWT_SECURITY_LEVEL || "NSA_128_BITS",
      algorithm: process.env.JWT_ALGORITHM || "sha512",
      key_length: process.env.SECURITY_KEY_LENGTH || "512",
      iterations: process.env.SECURITY_ITERATIONS || "100000",
      generated_at: process.env.SECURITY_GENERATED_AT || null,
      message: isConfigured
        ? "Configuration de sécurité active"
        : "Configuration de sécurité manquante",
    });
  } catch (error) {
    console.error(
      "Erreur lors de la vérification du statut d'authentification:",
      error,
    );

    res.status(500).json({
      configured: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

/**
 * POST /auth/refresh
 * Renouvellement d'un token JWT
 *
 * Headers: Authorization: Bearer <token>
 * Response: { success: boolean, token?: string, error?: string }
 */
router.post("/refresh", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  try {
    // Génération d'un nouveau token avec les mêmes permissions
    const secret = process.env.JWT_SECRET;
    const payload = {
      iss: req.user.issuer,
      sub: req.user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
      security_level: req.user.security_level,
      algorithm: "sha512",
      iterations: parseInt(process.env.SECURITY_ITERATIONS) || 100000,
      permissions: req.user.permissions || ["health:read", "health:monitor"],
    };

    const newToken = jwt.sign(payload, secret, { algorithm: "HS512" });

    // Log du renouvellement
    jwtAuth.logSecurityEvent("TOKEN_REFRESHED", {
      user: req.user.id,
      old_expires_at: req.user.expiresAt,
      new_expires_at: new Date(payload.exp * 1000),
    });

    res.json({
      success: true,
      token: newToken,
      expires_in: "30m",
      permissions: payload.permissions,
      security_level: payload.security_level,
      message: "Token renouvelé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du renouvellement du token:", error);

    res.status(500).json({
      success: false,
      error: "Erreur interne du serveur",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
});

module.exports = router;
