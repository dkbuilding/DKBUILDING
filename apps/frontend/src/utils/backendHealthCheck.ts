/**
 * Utilitaire de vérification de santé du backend
 * Vérifie la disponibilité de l'API backend de manière non-bloquante
 */

export interface BackendHealthResult {
  readonly available: boolean;
  readonly status?: string | number;
  readonly error?: string;
  readonly service?: string;
  readonly version?: string;
  readonly emailConfigured?: boolean;
}

interface HealthAPIResponse {
  readonly status: string;
  readonly service?: string;
  readonly version?: string;
  readonly emailConfigured?: boolean;
}

/**
 * Vérifie la disponibilité du backend via l'endpoint /api/status
 *
 * @param apiBaseUrl - URL de base de l'API (défaut: utilise le proxy Vite '/api')
 * @param timeout - Timeout en millisecondes (défaut: 3000ms)
 */
export async function checkBackendHealth(
  apiBaseUrl: string | null = null,
  timeout = 3000,
): Promise<BackendHealthResult> {
  const baseUrl = apiBaseUrl ?? import.meta.env.API_BASE_URL ?? "";

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const apiUrl = baseUrl || "/api";
    const response = await fetch(`${apiUrl}/status`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
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

    const data: HealthAPIResponse = await response.json();

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
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {
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

    const errorMessage = error instanceof Error
      ? error.message
      : "Erreur inconnue lors de la vérification du backend";

    return {
      available: false,
      error: errorMessage,
    };
  }
}

/**
 * Vérifie la disponibilité du backend avec retry automatique
 */
export async function checkBackendHealthWithRetry(
  apiBaseUrl: string | null = null,
  timeout = 3000,
  retries = 1,
  retryDelay = 500,
): Promise<BackendHealthResult> {
  let lastResult: BackendHealthResult = { available: false, error: "Aucune tentative effectuée" };

  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    const result = await checkBackendHealth(apiBaseUrl, timeout);

    if (result.available) {
      return result;
    }

    lastResult = result;
  }

  return lastResult;
}
