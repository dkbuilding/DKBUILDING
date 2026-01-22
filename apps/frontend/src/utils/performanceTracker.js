/**
 * Utilitaire de tracking des performances du preloader
 * Mesure et enregistre les métriques de chargement
 *
 * @author DK BUILDING
 * @version latest
 */

import { perf } from "./logger";

/**
 * Mesure les performances de chargement
 *
 * @param {string} startTime - Timestamp de début (performance.now())
 * @returns {Object} Métriques de performance
 */
export function measurePerformance(startTime) {
  const endTime = performance.now();
  const duration = endTime - startTime;

  // Récupérer les métriques Navigation Timing API si disponibles
  const navigation = performance.getEntriesByType("navigation")[0];
  const timing = navigation
    ? {
        domContentLoaded:
          navigation.domContentLoadedEventEnd -
          navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        domInteractive: navigation.domInteractive - navigation.navigationStart,
        firstPaint: null,
        firstContentfulPaint: null,
      }
    : null;

  // Récupérer les métriques Paint Timing API si disponibles
  const paintEntries = performance.getEntriesByType("paint");
  if (paintEntries.length > 0) {
    paintEntries.forEach((entry) => {
      if (entry.name === "first-paint" && timing) {
        timing.firstPaint = entry.startTime;
      }
      if (entry.name === "first-contentful-paint" && timing) {
        timing.firstContentfulPaint = entry.startTime;
      }
    });
  }

  // Compter les ressources chargées
  const resources = performance.getEntriesByType("resource");
  const resourceCount = {
    total: resources.length,
    images: resources.filter((r) => r.initiatorType === "img").length,
    scripts: resources.filter((r) => r.initiatorType === "script").length,
    stylesheets: resources.filter(
      (r) => r.initiatorType === "css" || r.initiatorType === "link",
    ).length,
    fonts: resources.filter(
      (r) => r.initiatorType === "css" && r.name.includes("font"),
    ).length,
    videos: resources.filter((r) => r.initiatorType === "video").length,
  };

  return {
    duration,
    timing,
    resources: resourceCount,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Enregistre les métriques de performance (console ou API)
 *
 * @param {Object} metrics - Métriques à enregistrer
 * @param {boolean} logToConsole - Logger dans la console (défaut: true)
 */
export function logPerformanceMetrics(metrics, logToConsole = true) {
  if (logToConsole) {
    perf("Preloader Performance Metrics");
    perf("Durée totale:", `${metrics.duration.toFixed(2)}ms`);

    if (metrics.timing) {
      perf("Navigation Timing:", metrics.timing);
    }

    perf("Ressources chargées:", metrics.resources);
    perf("Timestamp:", metrics.timestamp);
  }

  // Stocker dans sessionStorage pour analyse ultérieure
  try {
    const existingMetrics = JSON.parse(
      sessionStorage.getItem("preloader_metrics") || "[]",
    );
    existingMetrics.push(metrics);
    // Garder seulement les 10 dernières métriques
    const recentMetrics = existingMetrics.slice(-10);
    sessionStorage.setItem("preloader_metrics", JSON.stringify(recentMetrics));
  } catch {
    // Ignorer les erreurs de sessionStorage
  }
}

/**
 * Récupère les métriques stockées
 *
 * @returns {Array} Liste des métriques
 */
export function getStoredMetrics() {
  try {
    return JSON.parse(sessionStorage.getItem("preloader_metrics") || "[]");
  } catch {
    return [];
  }
}

/**
 * Calcule les statistiques moyennes
 *
 * @returns {Object} Statistiques moyennes
 */
export function getAverageMetrics() {
  const metrics = getStoredMetrics();

  if (metrics.length === 0) {
    return null;
  }

  const avgDuration =
    metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length;
  const avgResources = {
    total:
      metrics.reduce((sum, m) => sum + (m.resources?.total || 0), 0) /
      metrics.length,
    images:
      metrics.reduce((sum, m) => sum + (m.resources?.images || 0), 0) /
      metrics.length,
    scripts:
      metrics.reduce((sum, m) => sum + (m.resources?.scripts || 0), 0) /
      metrics.length,
  };

  return {
    averageDuration: avgDuration,
    averageResources: avgResources,
    sampleSize: metrics.length,
  };
}
