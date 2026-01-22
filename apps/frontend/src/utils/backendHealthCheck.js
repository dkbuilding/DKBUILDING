/**
 * Utilitaire de vérification de santé du backend
 * Vérifie la disponibilité de l'API backend de manière non-bloquante
 *
 * @author DK BUILDING
 * @version latest
 */

/**
 * Vérifie la disponibilité du backend via l'endpoint /api/status
 * Utilise le proxy Vite par défaut pour éviter les problèmes de contenu mixte (HTTPS -> HTTP)
 *
 * @param {string} apiBaseUrl - URL de base de l'API (défaut: utilise le proxy Vite '/api')
 * @param {number} timeout - Timeout en millisecondes (défaut: 3000ms)
 * @returns {Promise<{available: boolean, status?: string, error?: string}>}
 */
export async function checkBackendHealth(apiBaseUrl = null, timeout = 3000) {
  // Utiliser le proxy Vite pour éviter les problèmes de contenu mixte (HTTPS -> HTTP)
  // Le proxy Vite route /api vers le backend
  const baseUrl = apiBaseUrl || import.meta.env?.API_BASE_URL || "";

  try {
    // Créer un AbortController pour le timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const apiUrl = baseUrl || "/api";
    const response = await fetch(`${apiUrl}/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
      cache: "no-cache",
      credentials: "include",
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        available: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();

    // Vérifier que la réponse contient un statut OK
    if (data.status === "OK" || data.status === "ok") {
      return {
        available: true,
        status: "OK",
        service: data.service,
        version: data.version,
        emailConfigured: data.emailConfigured,
      };
    }

    return {
      available: false,
      status: data.status,
      error: "Statut backend non OK",
    };
  } catch (error) {
    // Gérer les différents types d'erreurs
    if (error.name === "AbortError") {
      return {
        available: false,
        error: "Timeout - Le backend ne répond pas dans les temps",
      };
    }

    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        available: false,
        error: "Impossible de contacter le backend - Vérifiez votre connexion",
      };
    }

    return {
      available: false,
      error:
        error.message || "Erreur inconnue lors de la vérification du backend",
    };
  }
}

/**
 * Vérifie la disponibilité du backend avec retry automatique
 *
 * @param {string} apiBaseUrl - URL de base de l'API
 * @param {number} timeout - Timeout en millisecondes
 * @param {number} retries - Nombre de tentatives (défaut: 1)
 * @param {number} retryDelay - Délai entre les tentatives en ms (défaut: 500ms)
 * @returns {Promise<{available: boolean, status?: string, error?: string}>}
 */
export async function checkBackendHealthWithRetry(
  apiBaseUrl = null,
  timeout = 3000,
  retries = 1,
  retryDelay = 500,
) {
  let lastError = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    const result = await checkBackendHealth(apiBaseUrl, timeout);

    if (result.available) {
      return result;
    }

    lastError = result;
  }

  return lastError;
}
