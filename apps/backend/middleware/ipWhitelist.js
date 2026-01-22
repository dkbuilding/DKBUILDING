const Logger = require("../utils/logger");

/**
 * IP Whitelisting - Accès Admin Restreint
 * Architecture GovTech pour DK BUILDING
 */

const ipWhitelist = (req, res, next) => {
  // Liste des IP autorisées (depuis .env)
  const allowedIPs =
    process.env.ADMIN_ALLOWED_IPS?.split(",").map((ip) => ip.trim()) || [];

  // Si pas de whitelist configurée, on autorise en mode développement uniquement
  if (allowedIPs.length === 0) {
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  IP Whitelist non configurée - Mode développement actif",
      );
      return next();
    } else {
      // En production, refuser si pas de whitelist
      Logger.createLog("security", "ip_whitelist", null, null, {
        error: "No whitelist configured in production",
        route: req.path,
      });
      return res.status(403).json({
        success: false,
        error: "Configuration de sécurité manquante",
      });
    }
  }

  // Récupérer l'IP du client (supporte les proxies)
  const clientIP =
    req.ip ||
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection.remoteAddress;

  // Nettoyer l'IP (enlever le préfixe IPv6 si présent)
  const cleanIP = clientIP.replace(/^::ffff:/, "");

  if (!allowedIPs.includes(cleanIP)) {
    Logger.createLog("security", "ip_whitelist", null, null, {
      blocked_ip: cleanIP,
      route: req.path,
      method: req.method,
    });

    return res.status(403).json({
      success: false,
      error: "Accès refusé - IP non autorisée",
    });
  }

  // IP autorisée, continuer
  next();
};

module.exports = ipWhitelist;
