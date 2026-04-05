/**
 * Routes d'Authentification — DK BUILDING
 * Endpoints sécurisés pour l'authentification JWT
 */

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtAuth } = require("../middleware/jwtAuth");
const validateZod = require("../middleware/validateZod");
const { authHealthSchema } = require("../validators/schemas");
const {
  sendSuccess,
  sendBadRequest,
  sendUnauthorized,
  sendInternalError,
} = require("../utils/apiResponse");

/**
 * POST /api/auth/health
 * Authentification pour l'accès au Health Monitoring
 *
 * Body: { password: string }
 * Validation: Zod (authHealthSchema)
 */
router.post("/health", validateZod(authHealthSchema), async (req, res) => {
  try {
    const { password } = req.body;

    const authResult = jwtAuth.generateHealthToken(password);

    if (!authResult.success) {
      return sendUnauthorized(res, authResult.error);
    }

    // Cookie HttpOnly sécurisé
    res.cookie("jwt_token", authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    return sendSuccess(res, {
      expires_in: authResult.expires_in,
      permissions: authResult.permissions,
      security_level: authResult.security_level,
    }, { message: "Authentification réussie" });
  } catch (error) {
    console.error("Erreur lors de l'authentification Health:", error);
    return sendInternalError(res);
  }
});

/**
 * POST /api/auth/logout
 * Déconnexion — suppression du cookie JWT
 */
router.post("/logout", (req, res) => {
  res.clearCookie("jwt_token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
  return sendSuccess(res, null, { message: "Déconnexion réussie" });
});

/**
 * POST /api/auth/verify
 * Vérification d'un token JWT existant
 */
router.post("/verify", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  try {
    return sendSuccess(res, {
      valid: true,
      user: {
        id: req.user.id,
        issuer: req.user.issuer,
        security_level: req.user.securityLevel,
        issued_at: req.user.issuedAt,
        expires_at: req.user.expiresAt,
      },
    }, { message: "Token valide" });
  } catch (error) {
    console.error("Erreur lors de la vérification du token:", error);
    return sendInternalError(res);
  }
});

/**
 * GET /api/auth/status
 * Statut de la configuration d'authentification
 */
router.get("/status", (req, res) => {
  return sendSuccess(res, {
    configured: true,
    message: "Système d'authentification actif",
  });
});

/**
 * POST /api/auth/refresh
 * Renouvellement d'un token JWT
 */
router.post("/refresh", jwtAuth.authenticateToken.bind(jwtAuth), (req, res) => {
  try {
    const secret = process.env.JWT_SECRET;

    // Revalider le rôle et les permissions depuis la source de vérité
    // (pas depuis l'ancien token — un admin révoqué ne doit pas pouvoir se rafraîchir)
    const ROLE_PERMISSIONS = {
      admin: ["health:read", "health:monitor"],
    };
    const role = req.user.role || "admin";
    const validPermissions = ROLE_PERMISSIONS[role];
    if (!validPermissions) {
      return sendUnauthorized(res, "Rôle inconnu ou révoqué");
    }

    const payload = {
      iss: req.user.issuer,
      sub: req.user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 30 * 60,
      role,
      security_level: req.user.securityLevel,
      algorithm: "sha512",
      iterations: parseInt(process.env.SECURITY_ITERATIONS) || 100000,
      permissions: validPermissions,
    };

    const newToken = jwt.sign(payload, secret, { algorithm: "HS512" });

    jwtAuth.logSecurityEvent("TOKEN_REFRESHED", {
      user: req.user.id,
      old_expires_at: req.user.expiresAt,
      new_expires_at: new Date(payload.exp * 1000),
    });

    res.cookie("jwt_token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 60 * 1000,
      path: "/",
    });

    return sendSuccess(res, {
      expires_in: "30m",
      permissions: payload.permissions,
      security_level: payload.security_level,
    }, { message: "Token renouvelé avec succès" });
  } catch (error) {
    console.error("Erreur lors du renouvellement du token:", error);
    return sendInternalError(res);
  }
});

module.exports = router;
