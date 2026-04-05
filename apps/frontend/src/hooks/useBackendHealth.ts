/**
 * Hook personnalisé pour vérifier la santé du backend
 * Expose le statut de disponibilité du backend pour utilisation dans d'autres composants
 */

import { useState, useEffect, useCallback } from "react";
import { checkBackendHealth } from "@/utils/backendHealthCheck";
import type { BackendHealthResult } from "@/utils/backendHealthCheck";

interface BackendHealthOptions {
  /** Timeout en millisecondes (défaut: 3000) */
  readonly timeout?: number;
  /** Intervalle de rafraîchissement en ms (défaut: 30000) */
  readonly refreshInterval?: number;
  /** Activer le rafraîchissement automatique (défaut: true) */
  readonly autoRefresh?: boolean;
}

interface BackendHealthStatus {
  readonly checked: boolean;
  readonly available: boolean | null;
  readonly error: string | null;
  readonly service: string | null;
  readonly version: string | null;
  readonly emailConfigured: boolean | null;
}

interface UseBackendHealthReturn extends BackendHealthStatus {
  readonly loading: boolean;
  readonly checkHealth: () => Promise<BackendHealthResult>;
  readonly isAvailable: boolean;
  readonly isUnavailable: boolean;
  readonly isUnknown: boolean;
}

export function useBackendHealth({
  timeout = 3000,
  refreshInterval = 30000,
  autoRefresh = true,
}: BackendHealthOptions = {}): UseBackendHealthReturn {
  const [status, setStatus] = useState<BackendHealthStatus>({
    checked: false,
    available: null,
    error: null,
    service: null,
    version: null,
    emailConfigured: null,
  });
  const [loading, setLoading] = useState(true);

  const checkHealth = useCallback(async (): Promise<BackendHealthResult> => {
    setLoading(true);
    try {
      const result = await checkBackendHealth(null, timeout);
      setStatus({
        checked: true,
        available: result.available,
        error: result.error ?? null,
        service: result.service ?? null,
        version: result.version ?? null,
        emailConfigured: result.emailConfigured ?? null,
      });
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error
        ? err.message
        : "Erreur lors de la vérification du backend";
      setStatus({
        checked: true,
        available: false,
        error: errorMessage,
        service: null,
        version: null,
        emailConfigured: null,
      });
      return {
        available: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [timeout]);

  // Vérification initiale
  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  // Rafraîchissement automatique
  useEffect(() => {
    if (!autoRefresh || !status.checked) return;

    const interval = setInterval(() => {
      checkHealth();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, checkHealth, status.checked]);

  return {
    ...status,
    loading,
    checkHealth,
    isAvailable: status.available === true,
    isUnavailable: status.available === false,
    isUnknown: status.available === null,
  };
}
