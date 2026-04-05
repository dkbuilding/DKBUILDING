/**
 * Utilitaire de détection et vérification du navigateur
 * Vérifie la compatibilité du navigateur selon la configuration
 *
 * @author DK BUILDING
 * @version latest
 */

/**
 * Détecte le navigateur et sa version
 *
 * @returns {Object} Informations sur le navigateur
 */
export function detectBrowser() {
  const userAgent = navigator.userAgent;
  let browser = "unknown";
  let version = 0;

  // Chrome
  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    browser = "chrome";
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }
  // Edge
  else if (userAgent.includes("Edg")) {
    browser = "edge";
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }
  // Firefox
  else if (userAgent.includes("Firefox")) {
    browser = "firefox";
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }
  // Safari
  else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "safari";
    const match = userAgent.match(/Version\/(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }
  // Opera
  else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "opera";
    const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }
  // Internet Explorer
  else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browser = "ie";
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match ? parseInt(match[1], 10) : 0;
  }

  return {
    name: browser,
    version,
    userAgent,
    isMobile: /Mobile|Android|iPhone|iPad/.test(userAgent),
    isTablet: /iPad|Android/.test(userAgent) && !/Mobile/.test(userAgent),
  };
}

/**
 * Vérifie si le navigateur est compatible selon la configuration
 *
 * @param {Object} minVersions - Versions minimales requises par navigateur
 * @returns {Object} Résultat de la vérification
 */
export function checkBrowserCompatibility(minVersions = {}) {
  const browser = detectBrowser();

  if (browser.name === "unknown") {
    return {
      compatible: true, // On assume compatible si on ne peut pas détecter
      browser: browser.name,
      version: browser.version,
      reason: "Navigateur non détecté",
    };
  }

  const minVersion = minVersions[browser.name];

  if (!minVersion) {
    // Si pas de version minimale définie pour ce navigateur, on assume compatible
    return {
      compatible: true,
      browser: browser.name,
      version: browser.version,
      reason: "Aucune version minimale définie",
    };
  }

  const compatible = browser.version >= minVersion;

  return {
    compatible,
    browser: browser.name,
    version: browser.version,
    minVersion,
    reason: compatible
      ? "Navigateur compatible"
      : `Version ${browser.version} inférieure à la version minimale requise (${minVersion})`,
  };
}
