import { useState, useEffect, useCallback } from 'react';

interface LockAccessStatus {
  system: {
    enabled: boolean;
    locked: boolean;
    maintenanceMode: boolean;
    environment: string;
  };
  access: {
    clientIP: string;
    isAllowed: boolean;
    isBlocked: boolean;
    isLocked: boolean;
    isMaintenance: boolean;
    allowedIPs: string[];
    blockedIPs: string[];
  };
  security: {
    shouldShowLockScreen: boolean;
    shouldShowMaintenance: boolean;
    screenType: 'none' | 'maintenance' | 'locked' | 'ip-blocked';
  };
  timestamp: string;
}

interface LockAccessConfig {
  enabled: boolean;
  locked: boolean;
  maintenanceMode: boolean;
  allowedIPs: string[];
  blockedIPs: string[];
  timestamp: string;
  environment: string;
}

interface LockAccessAPIResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}

interface ImportMetaEnv {
  API_BASE_URL?: string;
  [key: string]: unknown;
}

/**
 * Hook personnalisé pour gérer l'état LockAccess via l'API backend
 */
export const useLockAccessAPI = () => {
  const [status, setStatus] = useState<LockAccessStatus | null>(null);
  const [config, setConfig] = useState<LockAccessConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Utiliser le proxy Vite pour éviter les problèmes de contenu mixte (HTTPS -> HTTP)
  // Le proxy Vite route /api vers le backend
  const API_BASE_URL = (import.meta.env as ImportMetaEnv).API_BASE_URL || '';
  /**
   * Récupère le statut complet du système LockAccess
   */
  const fetchStatus = useCallback(async (): Promise<LockAccessStatus | null> => {
    try {
      const apiUrl = API_BASE_URL || '/api';
      const response = await fetch(`${apiUrl}/lockaccess/status`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LockAccessAPIResponse<LockAccessStatus> = await response.json();
      
      if (result.success) {
        setStatus(result.data);
        setError(null);
        return result.data;
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération du statut');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération du statut LockAccess:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [API_BASE_URL]);
  /**
   * Récupère la configuration LockAccess
   */
  const fetchConfig = useCallback(async (): Promise<LockAccessConfig | null> => {
    try {
      const apiUrl = API_BASE_URL || '/api';
      const response = await fetch(`${apiUrl}/lockaccess/config`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LockAccessAPIResponse<LockAccessConfig> = await response.json();
      
      if (result.success) {
        setConfig(result.data);
        setError(null);
        return result.data;
      } else {
        throw new Error(result.message || 'Erreur lors de la récupération de la configuration');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur lors de la récupération de la config LockAccess:', errorMessage);
      setError(errorMessage);
      return null;
    }
  }, [API_BASE_URL]);
  /**
   * Vérifie l'accès du client
   */
  const checkAccess = useCallback(async (): Promise<boolean> => {
    try {
      const apiUrl = API_BASE_URL || '/api';
      const response = await fetch(`${apiUrl}/lockaccess/check-access`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: LockAccessAPIResponse<{
        clientIP: string;
        isAllowed: boolean;
        isBlocked: boolean;
        lockaccessEnabled: boolean;
        maintenanceMode: boolean;
        timestamp: string;
      }> = await response.json();
      
      if (result.success) {
        setError(null);
        return result.data.isAllowed;
      } else {
        throw new Error(result.message || 'Erreur lors de la vérification d\'accès');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur lors de la vérification d\'accès:', errorMessage);
      setError(errorMessage);
      return false;
    }
  }, [API_BASE_URL]);
  /**
   * Initialise les données LockAccess
   */
  const initialize = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Récupérer le statut et la config en parallèle
      await Promise.all([
        fetchStatus(),
        fetchConfig()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de l\'initialisation';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchStatus, fetchConfig]);
  /**
   * Rafraîchit les données
   */
  const refresh = useCallback(async () => {
    await initialize();
  }, [initialize]);

  // Initialisation au montage du composant
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Rafraîchissement périodique (toutes les 30 secondes)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchStatus]);

  return {
    status,
    config,
    loading,
    error,
    fetchStatus,
    fetchConfig,
    checkAccess,
    refresh,
    initialize
  };
};

export default useLockAccessAPI;
