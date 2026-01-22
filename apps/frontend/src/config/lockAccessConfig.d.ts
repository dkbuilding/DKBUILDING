export interface LockAccessConfig {
  DEFAULT_PASSWORD: string;
  SITE_NAME: string;
  SECURITY: {
    IS_LOCKED_BY_DEFAULT: boolean;
    SESSION_TIMEOUT: number;
    MAX_ATTEMPTS: number;
    LOCKOUT_DURATION: number;
    ENABLE_FIREWALL: boolean;
    ENABLE_DEVICE_TRACKING: boolean;
    ENABLE_GEO_BLOCKING: boolean;
    ALLOWED_COUNTRIES: string[];
    BLOCKED_IPS: string[];
    ALLOWED_DEVICES: string[];
  };
  MESSAGES: Record<string, string>;
  THEME: Record<string, string | number>;
  ANIMATION: Record<string, string | number>;
}

export interface SecurityStatus {
  isLocked: boolean;
  isAuthenticated: boolean;
  sessionExpires: number | null;
  deviceId: string | null;
  firewallEnabled: boolean;
  deviceTrackingEnabled: boolean;
}

export const LOCKACCESS_CONFIG: LockAccessConfig;
export const getLockAccessConfig: () => LockAccessConfig;
export const updateLockAccessConfig: (updates: Partial<LockAccessConfig>) => void;
export const resetLockAccessConfig: () => LockAccessConfig;
export const isSiteLocked: () => boolean;
export const toggleSiteLock: (locked?: boolean) => boolean;
export const getSecurityStatus: () => SecurityStatus;

