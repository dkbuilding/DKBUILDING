// Configuration du système LockAccess pour DK BUILDING
// Ce fichier permet de configurer facilement les paramètres de sécurité

export const LOCKACCESS_CONFIG = {
  // Configuration de base
  DEFAULT_PASSWORD: 'dkbuilding2025',
  SITE_NAME: 'DK BUILDING',
  
  // Paramètres de sécurité
  SECURITY: {
    // Verrouillage par défaut (false = site accessible, true = site verrouillé)
    IS_LOCKED_BY_DEFAULT: false,
    
    // Durée de session en minutes
    SESSION_TIMEOUT: 30,
    
    // Nombre maximum de tentatives avant blocage
    MAX_ATTEMPTS: 3,
    
    // Durée de blocage en minutes après trop de tentatives
    LOCKOUT_DURATION: 15,
    
    // Activation des fonctionnalités de sécurité
    ENABLE_FIREWALL: true,
    ENABLE_DEVICE_TRACKING: true,
    ENABLE_GEO_BLOCKING: false,
    
    // Pays autorisés (codes ISO 2 lettres)
    ALLOWED_COUNTRIES: ['FR', 'BE', 'CH', 'CA', 'US'],
    
    // IPs bloquées (optionnel)
    BLOCKED_IPS: [],
    
    // Appareils autorisés (optionnel - laisser vide pour autoriser tous)
    ALLOWED_DEVICES: []
  },
  
  // Messages personnalisés
  MESSAGES: {
    SITE_LOCKED_TITLE: 'Site Verrouillé',
    SITE_LOCKED_SUBTITLE: 'Accès restreint',
    LOGIN_BUTTON: 'Déverrouiller le site',
    LOGIN_PLACEHOLDER: 'Entrez le mot de passe',
    SUCCESS_TITLE: 'Site Déverrouillé',
    SUCCESS_SUBTITLE: 'Accès autorisé',
    ERROR_INCORRECT_PASSWORD: 'Mot de passe incorrect',
    ERROR_TOO_MANY_ATTEMPTS: 'Trop de tentatives. Votre appareil est temporairement bloqué.',
    ERROR_LOCKOUT_TIME: 'Trop de tentatives. Réessayez dans {minutes} minutes.',
    DEVICE_INFO_TITLE: 'Appareil détecté',
    SECURITY_WARNING: 'Site temporairement verrouillé',
    SECURITY_WARNING_DESC: 'L\'accès au site est restreint pour des raisons de sécurité. Contactez l\'administrateur si nécessaire.'
  },
  
  // Couleurs du thème
  THEME: {
    PRIMARY_COLOR: 'red-500',
    SUCCESS_COLOR: 'green-500',
    WARNING_COLOR: 'yellow-500',
    ERROR_COLOR: 'red-500',
    BACKGROUND_COLOR: 'dk-black',
    CARD_COLOR: 'dk-gray/30'
  },
  
  // Configuration des animations
  ANIMATIONS: {
    ENABLE_GSAP: true,
    DURATION_FAST: 0.3,
    DURATION_NORMAL: 0.8,
    EASING_SMOOTH: 'power3.out',
    EASING_BOUNCE: 'back.out(1.7)'
  }
};

// Fonction utilitaire pour obtenir la configuration
export const getLockAccessConfig = () => {
  return LOCKACCESS_CONFIG;
};

// Fonction pour mettre à jour la configuration
export const updateLockAccessConfig = (updates) => {
  return { ...LOCKACCESS_CONFIG, ...updates };
};

// Fonction pour réinitialiser la configuration
export const resetLockAccessConfig = () => {
  localStorage.removeItem('dk_security_config');
  localStorage.removeItem('dk_security_session');
  return LOCKACCESS_CONFIG;
};

// Fonction pour vérifier si le site est verrouillé
export const isSiteLocked = () => {
  const config = localStorage.getItem('dk_security_config');
  if (config) {
    try {
      const parsedConfig = JSON.parse(config);
      return parsedConfig.isLocked || false;
    } catch (error) {
      console.error('Erreur lors de la lecture de la configuration:', error);
      return false;
    }
  }
  return LOCKACCESS_CONFIG.SECURITY.IS_LOCKED_BY_DEFAULT;
};

// Fonction pour verrouiller/déverrouiller le site
export const toggleSiteLock = (locked = null) => {
  const currentConfig = localStorage.getItem('dk_security_config');
  let config = {};
  
  if (currentConfig) {
    try {
      config = JSON.parse(currentConfig);
    } catch (error) {
      console.error('Erreur lors de la lecture de la configuration:', error);
    }
  }
  
  const newLockState = locked !== null ? locked : !config.isLocked;
  config.isLocked = newLockState;
  
  localStorage.setItem('dk_security_config', JSON.stringify(config));
  
  // Recharger la page pour appliquer les changements
  window.location.reload();
  
  return newLockState;
};

// Fonction pour obtenir le statut de sécurité
export const getSecurityStatus = () => {
  const config = localStorage.getItem('dk_security_config');
  const session = localStorage.getItem('dk_security_session');
  
  let parsedConfig = {};
  let parsedSession = {};
  
  try {
    parsedConfig = config ? JSON.parse(config) : {};
  } catch (error) {
    console.error('Erreur lors de la lecture de la configuration:', error);
  }
  
  try {
    parsedSession = session ? JSON.parse(session) : {};
  } catch (error) {
    console.error('Erreur lors de la lecture de la session:', error);
  }
  
  return {
    isLocked: parsedConfig.isLocked || false,
    isAuthenticated: parsedSession.authenticated || false,
    sessionExpires: parsedSession.expires || null,
    deviceId: parsedSession.deviceId || null,
    firewallEnabled: parsedConfig.enableFirewall !== false,
    deviceTrackingEnabled: parsedConfig.enableDeviceTracking !== false
  };
};

export default LOCKACCESS_CONFIG;
