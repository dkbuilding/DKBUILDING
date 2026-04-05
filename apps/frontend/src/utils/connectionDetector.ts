/**
 * Utilitaire de détection de connexion lente
 * Détecte la vitesse de connexion et adapte le comportement
 */

/** API Network Information (non standard) */
interface NetworkInformation {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
}

/** Extension du Navigator pour l'API Network Information */
interface NavigatorWithNetwork extends Navigator {
  readonly connection?: NetworkInformation;
  readonly mozConnection?: NetworkInformation;
  readonly webkitConnection?: NetworkInformation;
}

interface ConnectionInfo {
  readonly effectiveType: string;
  readonly downlink: number | null;
  readonly rtt: number | null;
  readonly saveData: boolean;
  readonly isSlow: boolean;
  readonly isVerySlow: boolean;
}

interface SpeedTestResult {
  readonly speed: number;
  readonly isSlow: boolean;
  readonly error?: string;
  readonly duration?: number;
  readonly contentLength?: number;
}

interface SlowConnectionResult {
  readonly isSlow: boolean;
  readonly reason?: string;
  readonly details: ConnectionInfo | SpeedTestResult;
}

/**
 * Détecte la vitesse de connexion via l'API Network Information
 */
export function detectConnectionSpeed(): ConnectionInfo {
  const nav = navigator as NavigatorWithNetwork;
  const connection = nav.connection ?? nav.mozConnection ?? nav.webkitConnection;

  if (connection) {
    return {
      effectiveType: connection.effectiveType,
      downlink: connection.downlink,
      rtt: connection.rtt,
      saveData: connection.saveData,
      isSlow:
        connection.effectiveType === "slow-2g" ||
        connection.effectiveType === "2g" ||
        connection.downlink < 1.5,
      isVerySlow: connection.effectiveType === "slow-2g" || connection.downlink < 0.5,
    };
  }

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
 */
export async function measureConnectionSpeed(
  testUrl: string | null = null,
  timeout = 5000,
): Promise<SpeedTestResult> {
  const defaultTestUrl = "/images/logos/Logo — DK BUILDING — Structure 2.png";
  const url = testUrl ?? defaultTestUrl;

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
      return { speed: 0, isSlow: true, error: `HTTP ${response.status}` };
    }

    const endTime = performance.now();
    const duration = (endTime - startTime) / 1000;
    const contentLength = parseInt(
      response.headers.get("content-length") ?? "0",
      10,
    );

    const speed =
      contentLength > 0 ? (contentLength * 8) / (duration * 1000) : 0;

    return {
      speed,
      duration,
      isSlow: speed < 1500,
      contentLength,
    };
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === "AbortError") {
      return { speed: 0, isSlow: true, error: "Timeout lors du test de connexion" };
    }

    const errorMessage = err instanceof Error ? err.message : "Erreur lors du test de connexion";
    return { speed: 0, isSlow: true, error: errorMessage };
  }
}

/**
 * Détermine si la connexion est lente selon la configuration
 */
export async function isSlowConnection(threshold = 2000): Promise<SlowConnectionResult> {
  const connectionInfo = detectConnectionSpeed();

  if (connectionInfo.isSlow || connectionInfo.isVerySlow) {
    return {
      isSlow: true,
      reason: "Network Information API",
      details: connectionInfo,
    };
  }

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

  return { isSlow: false, details: connectionInfo };
}
