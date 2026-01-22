import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { gsap } from '../../../utils/gsapConfig';
// motionTokens, gsapUtils, scrollTriggerDefaults non utilisés dans ce composant
import { 
  getSecurityStatus, 
  toggleSiteLock, 
  resetLockAccessConfig,
  LOCKACCESS_CONFIG 
  } from '../../../config/lockAccessConfig';
import { useLockAccessAPI } from '../../../hooks/useLockAccessAPI';
import MaintenanceScreen from './MaintenanceScreen';
import LockedScreen from './LockedScreen';
import IPBlockedScreen from './IPBlockedScreen';
import './LockAccess.css';
import { Lock } from 'lucide-react';

// Types pour la sécurité
interface SecurityConfig {
  isLocked: boolean;
  masterPassword: string;
  sessionTimeout: number; // en minutes
  maxAttempts: number;
  lockoutDuration: number; // en minutes
  enableFirewall: boolean;
  enableDeviceTracking: boolean;
  enableGeoBlocking: boolean;
  allowedCountries: string[];
  blockedIPs: string[];
  allowedDevices: string[];
}

interface SecurityStatus {
  isLocked: boolean;
  isAuthenticated: boolean;
  sessionExpires: number | null;
  deviceId: string | null;
  firewallEnabled: boolean;
  deviceTrackingEnabled: boolean;
}

interface SecuritySession {
  authenticated: boolean;
  timestamp: number;
  expires: number;
  deviceId: string;
  userAgent: string;
  ipAddress?: string;
  country?: string;
  attempts: number;
  lastAttempt: number;
  token: string;
}

interface DeviceInfo {
  id: string;
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  screen: string;
  fingerprint: string;
}

// Middleware de sécurité
class SecurityMiddleware {
  private config: SecurityConfig;
  private attempts: Map<string, number> = new Map();
  private lockouts: Map<string, number> = new Map();

  constructor(config: SecurityConfig) {
    this.config = config;
    this.loadFromStorage();
  }

  // Charger la configuration depuis le localStorage
  private loadFromStorage() {
    const stored = localStorage.getItem('dk_security_config');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.config = { ...this.config, ...parsed };
      } catch (error) {
        console.error('Erreur lors du chargement de la configuration:', error);
      }
    }
  }

  // Sauvegarder la configuration dans le localStorage
  private saveToStorage() {
    localStorage.setItem('dk_security_config', JSON.stringify(this.config));
  }

  // Obtenir les informations de l'appareil
  getDeviceInfo(): DeviceInfo {
    const userAgent = navigator.userAgent;
    const screenSize = `${window.screen.width}x${window.screen.height}`;
    
    // Détecter le type d'appareil
    let type: 'desktop' | 'mobile' | 'tablet' = 'desktop';
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      type = /iPad|Tablet/.test(userAgent) ? 'tablet' : 'mobile';
    }

    // Détecter le navigateur
    let browser = 'Unknown';
    if (userAgent.includes('Chrome')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari')) browser = 'Safari';
    else if (userAgent.includes('Edge')) browser = 'Edge';

    // Détecter l'OS
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';

    // Générer un fingerprint unique
    const fingerprint = btoa(`${userAgent}-${screenSize}-${type}`).substring(0, 16);

    return {
      id: fingerprint,
      type,
      browser,
      os,
      screen: screenSize,
      fingerprint
    };
  }

  // Authentifier l'utilisateur
  authenticate(password: string, deviceInfo: DeviceInfo): SecuritySession | null {
    const now = Date.now();
    const deviceId = deviceInfo.id;

    // Vérifier si l'appareil est bloqué
    if (this.lockouts.has(deviceId) && this.lockouts.get(deviceId)! > now) {
      throw new Error('Appareil temporairement bloqué');
    }

    // Vérifier le mot de passe
    if (password === this.config.masterPassword) {
      // Réinitialiser les tentatives
      this.attempts.delete(deviceId);
      this.lockouts.delete(deviceId);

      // Créer une session
      const session: SecuritySession = {
        authenticated: true,
        timestamp: now,
        expires: now + (this.config.sessionTimeout * 60 * 1000),
        deviceId,
        userAgent: navigator.userAgent,
        attempts: 0,
        lastAttempt: now,
        token: btoa(`${deviceId}-${now}`).substring(0, 32)
      };

      return session;
    } else {
      // Incrémenter les tentatives
      const attempts = (this.attempts.get(deviceId) || 0) + 1;
      this.attempts.set(deviceId, attempts);

      // Bloquer si trop de tentatives
      if (attempts >= this.config.maxAttempts) {
        this.lockouts.set(deviceId, now + (this.config.lockoutDuration * 60 * 1000));
        throw new Error('Trop de tentatives, appareil bloqué');
      }

      return null;
    }
  }

  // Vérifier une session
  verifySession(session: SecuritySession, deviceInfo: DeviceInfo): boolean {
    const now = Date.now();
    
    // Vérifier l'expiration
    if (session.expires <= now) {
      return false;
    }

    // Vérifier l'appareil
    if (session.deviceId !== deviceInfo.id) {
      return false;
    }

    return session.authenticated;
  }

  // Obtenir la configuration
  getConfig(): SecurityConfig {
    return { ...this.config };
  }

  // Mettre à jour la configuration
  updateConfig(newConfig: Partial<SecurityConfig>) {
    this.config = { ...this.config, ...newConfig };
    this.saveToStorage();
  }
}

// Configuration par défaut
const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  isLocked: false,
  masterPassword: LOCKACCESS_CONFIG.DEFAULT_PASSWORD,
  sessionTimeout: LOCKACCESS_CONFIG.SECURITY.SESSION_TIMEOUT,
  maxAttempts: LOCKACCESS_CONFIG.SECURITY.MAX_ATTEMPTS,
  lockoutDuration: LOCKACCESS_CONFIG.SECURITY.LOCKOUT_DURATION,
  enableFirewall: true,
  enableDeviceTracking: true,
  enableGeoBlocking: false,
  allowedCountries: ['FR', 'BE', 'CH', 'LU'],
  blockedIPs: [],
  allowedDevices: []
};

// Composant wrapper pour masquer complètement le contenu quand le site est verrouillé
const LockAccessOverlay = ({ children, isLocked }: { children: React.ReactNode; isLocked: boolean }) => {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!root.current) return;
    
    const ctx = gsap.context(() => {
      if (isLocked) {
        // Masquer tous les éléments du site
        const mainContent = document.querySelector('main');
        const preloader = document.querySelector('.preloader');
        const navigation = document.querySelector('nav');
        const footer = document.querySelector('footer');
        
        const elementsToHide = [mainContent, preloader, navigation, footer].filter(Boolean);
        
        elementsToHide.forEach(el => {
          if (el) (el as HTMLElement).style.display = 'none';
        });

        return () => {
          if (mainContent) (mainContent as HTMLElement).style.display = '';
          if (preloader) (preloader as HTMLElement).style.display = '';
          if (navigation) (navigation as HTMLElement).style.display = '';
          if (footer) (footer as HTMLElement).style.display = '';
          
          elementsToHide.forEach(el => {
            (el as HTMLElement).style.display = '';
          });
        };
      }
    }, root);
    
    return () => ctx.revert();
  }, [isLocked]);

  return <div ref={root}>{children}</div>;
};

// Composant principal LockAccess unifié
const LockAccess = () => {
    const [_isAuthenticated, setIsAuthenticated] = useState(false);
    const [securityMiddleware] = useState(() => new SecurityMiddleware(DEFAULT_SECURITY_CONFIG));
    // config et setConfig réservés pour utilisation future
    const [_config, _setConfig] = useState<SecurityConfig>(securityMiddleware.getConfig());

    // Hook pour l'API LockAccess backend
    const { 
        status: lockAccessStatus, 
        config: lockAccessConfig, 
        loading: apiLoading, 
        error: _apiError,
        refresh: _refreshLockAccessStatus 
    } = useLockAccessAPI();

    // État calculé basé sur l'API backend
    const screenType = lockAccessStatus?.security.screenType || 'none';
    const isLockAccessEnabled = lockAccessConfig?.enabled || false;

    // Vérifier l'authentification au chargement
    useEffect(() => {
        const checkAuth = () => {
        const sessionData = localStorage.getItem('dk_security_session');
        if (sessionData) {
            try {
            const session: SecuritySession = JSON.parse(sessionData);
            const deviceInfo = securityMiddleware.getDeviceInfo();
            
            if (securityMiddleware.verifySession(session, deviceInfo)) {
                setIsAuthenticated(true);
                return;
            } else {
                localStorage.removeItem('dk_security_session');
            }
            } catch (error) {
            console.error('Erreur lors de la vérification de la session:', error);
            localStorage.removeItem('dk_security_session');
            }
        }
        setIsAuthenticated(false);
        };

        // Ne vérifier l'authentification que si LockAccess est activé côté backend
        if (isLockAccessEnabled && !apiLoading) {
            checkAuth();
        } else if (!isLockAccessEnabled) {
            // Si LockAccess est désactivé côté backend, considérer comme authentifié
            setIsAuthenticated(true);
        }
    }, [securityMiddleware, isLockAccessEnabled, apiLoading]);

    // Désactiver le scroll du body quand un écran est affiché
    useEffect(() => {
        if (screenType !== 'none') {
        // Sauvegarder la position de scroll actuelle
        const scrollY = window.scrollY;
        
        // Désactiver le scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.overflow = 'hidden';
        
        // Nettoyer au démontage
        return () => {
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.width = '';
            document.body.style.overflow = '';
            window.scrollTo(0, scrollY);
        };
        }
    }, [screenType]);

    // Fonction pour gérer la connexion
    const handleLogin = async (password: string): Promise<boolean> => {
        try {
            const deviceInfo = securityMiddleware.getDeviceInfo();
            const session = securityMiddleware.authenticate(password, deviceInfo);
            
            if (session) {
                localStorage.setItem('dk_security_session', JSON.stringify(session));
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Erreur lors de l\'authentification:', error);
            return false;
        }
    };

    // Fonction pour gérer la déconnexion (réservée pour utilisation future)
    const _handleLogout = () => {
        localStorage.removeItem('dk_security_session');
        setIsAuthenticated(false);
    };

    // Affichage conditionnel basé sur le type d'écran
    if (apiLoading) {
        return (
            <div className="fixed inset-0 z-[10000] bg-dk-black flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-dk-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-dk-gray-400">Vérification de l'accès...</p>
                </div>
            </div>
        );
    }

    if (screenType === 'maintenance') {
        return <MaintenanceScreen />;
    }

    if (screenType === 'locked') {
        return <LockedScreen onLogin={handleLogin} />;
    }

    if (screenType === 'ip-blocked') {
        return <IPBlockedScreen clientIP={lockAccessStatus?.access.clientIP || 'Unknown'} />;
    }

    // Si LockAccess est désactivé côté backend ou si l'utilisateur est authentifié, ne rien afficher
    return null;
};

// Composant de contrôle rapide du système LockAccess (désactivé pour production)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const LockAccessController = ({ className = "" }: { className?: string }) => {
    // Ne plus afficher le bouton de basculement - contrôlé par le backend
    return null;
};

// Composant d'indicateur de statut compact
const LockAccessStatus = ({ className = "" }: { className?: string }) => {
    const [securityStatus, setSecurityStatus] = useState(getSecurityStatus());

    useEffect(() => {
        const interval = setInterval(() => {
        setSecurityStatus(getSecurityStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!securityStatus.isLocked) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 ${className}`}>
        <div className="flex items-center space-x-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-2">
            <Lock className="w-4 h-4 text-red-400" />
            <span className="text-red-400 text-sm font-medium">Site Verrouillé</span>
        </div>
        </div>
    );
};

// Hook personnalisé pour utiliser le système LockAccess
const useLockAccess = () => {
    const [securityStatus, setSecurityStatus] = useState(getSecurityStatus());

    useEffect(() => {
        const interval = setInterval(() => {
        setSecurityStatus(getSecurityStatus());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const toggleLock = () => {
        const newState = toggleSiteLock();
        setSecurityStatus((prev: SecurityStatus) => ({ ...prev, isLocked: newState }));
        return newState;
    };

    const resetSecurity = () => {
        resetLockAccessConfig();
        setSecurityStatus(getSecurityStatus());
    };

    return {
        securityStatus,
        toggleLock,
        resetSecurity,
        isLocked: securityStatus.isLocked,
        isAuthenticated: securityStatus.isAuthenticated
    };
};

export { 
    LockAccess,
    LockAccessOverlay, 
    SecurityMiddleware, 
    DEFAULT_SECURITY_CONFIG, 
    LockAccessController, 
    LockAccessStatus, 
    useLockAccess 
};