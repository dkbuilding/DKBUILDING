/**
 * Utilitaire de détection et vérification du navigateur
 */

type BrowserName = 'chrome' | 'edge' | 'firefox' | 'safari' | 'opera' | 'ie' | 'unknown';

interface BrowserInfo {
  readonly name: BrowserName;
  readonly version: number;
  readonly userAgent: string;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
}

interface BrowserCompatibilityResult {
  readonly compatible: boolean;
  readonly browser: BrowserName;
  readonly version: number;
  readonly minVersion?: number;
  readonly reason: string;
}

type MinVersions = Partial<Record<BrowserName, number>>;

/**
 * Détecte le navigateur et sa version
 */
export function detectBrowser(): BrowserInfo {
  const userAgent = navigator.userAgent;
  let browser: BrowserName = "unknown";
  let version = 0;

  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    browser = "chrome";
    const match = userAgent.match(/Chrome\/(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
  } else if (userAgent.includes("Edg")) {
    browser = "edge";
    const match = userAgent.match(/Edg\/(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
  } else if (userAgent.includes("Firefox")) {
    browser = "firefox";
    const match = userAgent.match(/Firefox\/(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
  } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    browser = "safari";
    const match = userAgent.match(/Version\/(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
  } else if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    browser = "opera";
    const match = userAgent.match(/(?:OPR|Opera)\/(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    browser = "ie";
    const match = userAgent.match(/(?:MSIE |rv:)(\d+)/);
    version = match?.[1] ? parseInt(match[1], 10) : 0;
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
 */
export function checkBrowserCompatibility(minVersions: MinVersions = {}): BrowserCompatibilityResult {
  const browser = detectBrowser();

  if (browser.name === "unknown") {
    return {
      compatible: true,
      browser: browser.name,
      version: browser.version,
      reason: "Navigateur non détecté",
    };
  }

  const minVersion = minVersions[browser.name];

  if (minVersion === undefined) {
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
