const express = require("express");
const router = express.Router();
const { getConfig, updateConfig } = require("../utils/lockAccessConfig");
const validateZod = require("../middleware/validateZod");
const { lockAccessConfigSchema } = require("../validators/schemas");
const {
  sendSuccess,
  sendInternalError,
} = require("../utils/apiResponse");

/**
 * GET /api/lockaccess/config
 * Récupérer la configuration LockAccess
 */
router.get("/config", (req, res) => {
  try {
    const config = getConfig();
    config.timestamp = new Date().toISOString();
    config.environment = process.env.NODE_ENV || "development";

    return sendSuccess(res, config, {
      message: "Configuration LockAccess récupérée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de la config LockAccess:", error);
    return sendInternalError(res, "Impossible de récupérer la configuration LockAccess");
  }
});

/**
 * GET /api/lockaccess/access
 * Vérifier si l'IP du client est autorisée
 * (anciennement /check-access — verbe supprimé)
 */
router.get("/access", (req, res) => {
  try {
    const config = getConfig();
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const blockedIPs = config.blockedIPs || [];

    const isLocked = config.locked;
    const isMaintenance = config.maintenanceMode;
    const isIPBlocked =
      blockedIPs.includes(clientIP) ||
      blockedIPs.some((blockedIP) => clientIP.startsWith(blockedIP));

    let screenType = "none";
    if (isMaintenance) screenType = "maintenance";
    else if (isLocked) screenType = "locked";
    else if (isIPBlocked) screenType = "ip-blocked";

    const shouldShowAnyScreen = screenType !== "none";

    return sendSuccess(res, {
      clientIP,
      isAllowed: !shouldShowAnyScreen,
      isBlocked: isIPBlocked,
      isLocked,
      isMaintenance,
      screenType,
      lockaccessEnabled: config.enabled,
      timestamp: new Date().toISOString(),
    }, { message: "Vérification d'accès effectuée" });
  } catch (error) {
    console.error("Erreur lors de la vérification d'accès:", error);
    return sendInternalError(res, "Impossible de vérifier l'accès");
  }
});

/**
 * GET /api/lockaccess/status
 * Statut complet du système LockAccess
 */
router.get("/status", (req, res) => {
  try {
    const config = getConfig();
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    const blockedIPs = config.blockedIPs || [];

    const isLocked = config.locked;
    const isMaintenance = config.maintenanceMode;
    const isIPBlocked =
      blockedIPs.includes(clientIP) ||
      blockedIPs.some((blockedIP) => clientIP.startsWith(blockedIP));

    let screenType = "none";
    if (isMaintenance) screenType = "maintenance";
    else if (isLocked) screenType = "locked";
    else if (isIPBlocked) screenType = "ip-blocked";

    const shouldShowAnyScreen = screenType !== "none";

    return sendSuccess(res, {
      system: {
        enabled: config.enabled,
        locked: isLocked,
        maintenanceMode: isMaintenance,
        environment: process.env.NODE_ENV || "development",
      },
      access: {
        clientIP,
        isAllowed: !shouldShowAnyScreen,
        isBlocked: isIPBlocked,
        isLocked,
        isMaintenance,
      },
      security: {
        shouldShowLockScreen: shouldShowAnyScreen,
        shouldShowMaintenance: isMaintenance,
        screenType,
      },
      timestamp: new Date().toISOString(),
    }, { message: "Statut LockAccess récupéré avec succès" });
  } catch (error) {
    console.error("Erreur lors de la récupération du statut LockAccess:", error);
    return sendInternalError(res, "Impossible de récupérer le statut LockAccess");
  }
});

/**
 * PATCH /api/lockaccess/config
 * Mettre à jour la configuration LockAccess (protégé JWT)
 * PATCH car mise à jour partielle (seuls les champs fournis sont modifiés)
 *
 * Validation : Zod (lockAccessConfigSchema)
 */
const JWTAuthMiddleware = require("../middleware/jwtAuth");
const jwtAuth = new JWTAuthMiddleware();

router.patch(
  "/config",
  jwtAuth.authenticateToken.bind(jwtAuth),
  validateZod(lockAccessConfigSchema),
  (req, res) => {
    try {
      const updates = req.body;

      const success = updateConfig(updates);

      if (!success) {
        return sendInternalError(res, "Impossible de sauvegarder la configuration");
      }

      const updatedConfig = getConfig();
      updatedConfig.timestamp = new Date().toISOString();

      return sendSuccess(res, updatedConfig, {
        message: "Configuration LockAccess mise à jour avec succès",
      });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la config LockAccess:", error);
      return sendInternalError(res, "Impossible de mettre à jour la configuration LockAccess");
    }
  },
);

module.exports = router;
