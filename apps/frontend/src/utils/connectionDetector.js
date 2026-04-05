/**
 * Utilitaire de détection de connexion lente
 * Détecte la vitesse de connexion et adapte le comportement
 *
 * @author DK BUILDING
 * @version latest
 */

/**
 * Détecte la vitesse de connexion via l'API Network Information
 *
 * @returns {Object} Informations sur la connexion
 */
export function detectConnectionSpeed() {
  // API Network Information (support limité mais utile)
  const connection =
    navigator.connection ||
    navigator.mozConnection ||
    navigator.webkitConnection;

  if (connection) {
    const effectiveType = connection.effectiveType; // 'slow-2g', '2g', '3g', '4g'
    const downlink = connection.downlink; // Mbit/s
    const rtt = connection.rtt; // Round-trip time en ms
    const saveData = connection.saveData; // Mode économie de données

    return {
      effectiveType,
      downlink,
      rtt,
      saveData,
      isSlow:
        effectiveType === "slow-2g" || effectiveType === "2g" || downlink < 1.5,
      isVerySlow: effectiveType === "slow-2g" || downlink < 0.5,
    };
  }

  // Fallback : estimation basée sur le user agent et les capacités
  return {
    effectiveType: "unknown",
    downlink: null,
    rtt: null,
    saveData: false,
    isSlow: false,
    isVerySlow: false,
  };
}

/**
 * Mesure la vitesse de connexion réelle via un test de téléchargement
 *
 * @param {string} testUrl - URL d'un petit fichier pour tester (défaut: logo)
 * @param {number} timeout - Timeout en millisecondes (défaut: 5000)
 * @returns {Promise<{speed: number, isSlow: boolean, error?: string}>}
 */
export async function measureConnectionSpeed(testUrl = null, timeout = 5000) {
  // Utiliser une petite image du logo comme test
  const defaultTestUrl = "/images/logos/Logo — DK BUILDING — Structure 2.png";
  const url = testUrl || defaultTestUrl;

  try {
    const startTime = performance.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      cache: "no-cache",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        speed: 0,
        isSlow: true,
        error: `HTTP ${response.status}`,
      };
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000; // en secondes
    const contentLength = parseInt(
      response.headers.get("content-length") || "0",
      10,
    );

    // Calculer la vitesse en Kbit/s
    const speed =
      contentLength > 0
        ? (contentLength * 8) / (duration * 1000) // Kbit/s
        : 0;

    // Considérer comme lent si < 1.5 Mbit/s (environ 192 KB/s)
    const isSlow = speed < 1500;

    return {
      speed,
      duration,
      isSlow,
      contentLength,
    };
  } catch (error) {
    if (error.name === "AbortError") {
      return {
        speed: 0,
        isSlow: true,
        error: "Timeout lors du test de connexion",
      };
    }

    return {
      speed: 0,
      isSlow: true,
      error: error.message || "Erreur lors du test de connexion",
    };
  }
}

/**
 * Détermine si la connexion est lente selon la configuration
 *
 * @param {number} threshold - Seuil en millisecondes (défaut: 2000)
 * @returns {Promise<{isSlow: boolean, reason?: string, details?: Object}>}
 */
export async function isSlowConnection(threshold = 2000) {
  // D'abord, vérifier l'API Network Information
  const connectionInfo = detectConnectionSpeed();

  if (connectionInfo.isSlow || connectionInfo.isVerySlow) {
    return {
      isSlow: true,
      reason: "Network Information API",
      details: connectionInfo,
    };
  }

  // Ensuite, faire un test réel si l'API n'est pas disponible
  if (connectionInfo.effectiveType === "unknown") {
    const speedTest = await measureConnectionSpeed(null, threshold);

    if (speedTest.isSlow) {
      return {
        isSlow: true,
        reason: "Speed test",
        details: speedTest,
      };
    }
  }

  return {
    isSlow: false,
    details: connectionInfo,
  };
}
