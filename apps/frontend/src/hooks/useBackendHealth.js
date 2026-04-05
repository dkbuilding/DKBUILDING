/**
 * Hook personnalisé pour vérifier la santé du backend
 * Expose le statut de disponibilité du backend pour utilisation dans d'autres composants
 *
 * @author DK BUILDING
 * @version latest
 */

import { useState, useEffect, useCallback } from "react";
import { checkBackendHealth } from "../utils/backendHealthCheck";

/**
 * Hook pour vérifier et suivre la santé du backend
 *
 * @param {Object} options - Options de configuration
 * @param {number} options.timeout - Timeout en millisecondes (défaut: 3000)
 * @param {number} options.refreshInterval - Intervalle de rafraîchissement en ms (défaut: 30000)
 * @param {boolean} options.autoRefresh - Activer le rafraîchissement automatique (défaut: true)
 * @returns {Object} Statut et méthodes de contrôle
 */
export function useBackendHealth({
  timeout = 3000,
  refreshInterval = 30000,
  autoRefresh = true,
} = {}) {
  const [status, setStatus] = useState({
    checked: false,
    available: null,
    error: null,
    service: null,
    version: null,
    emailConfigured: null,
  });
  const [loading, setLoading] = useState(true);

  /**
   * Vérifie la santé du backend
   */
  const checkHealth = useCallback(async () => {
    setLoading(true);
    try {
      const result = await checkBackendHealth(null, timeout);
      setStatus({
        checked: true,
        available: result.available,
        error: result.error || null,
        service: result.service || null,
        version: result.version || null,
        emailConfigured: result.emailConfigured || null,
      });
      return result;
    } catch (error) {
      setStatus({
        checked: true,
        available: false,
        error: error.message || "Erreur lors de la vérification du backend",
        service: null,
        version: null,
        emailConfigured: null,
      });
      return {
        available: false,
        error: error.message,
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
