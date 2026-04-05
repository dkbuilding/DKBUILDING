/**
 * Types pour la configuration LockAccess
 * Doit rester synchronise avec lockAccessConfig.js
 */

export interface LockAccessSecurity {
  readonly IS_LOCKED_BY_DEFAULT: boolean;
  readonly SESSION_TIMEOUT: number;
  readonly MAX_ATTEMPTS: number;
  readonly LOCKOUT_DURATION: number;
  readonly ENABLE_FIREWALL: boolean;
  readonly ENABLE_DEVICE_TRACKING: boolean;
  readonly ENABLE_GEO_BLOCKING: boolean;
  readonly ALLOWED_COUNTRIES: readonly string[];
  readonly BLOCKED_IPS: readonly string[];
  readonly ALLOWED_DEVICES: readonly string[];
}

export interface LockAccessMessages {
  readonly SITE_LOCKED_TITLE: string;
  readonly SITE_LOCKED_SUBTITLE: string;
  readonly LOGIN_BUTTON: string;
  readonly LOGIN_PLACEHOLDER: string;
  readonly SUCCESS_TITLE: string;
  readonly SUCCESS_SUBTITLE: string;
  readonly ERROR_INCORRECT_PASSWORD: string;
  readonly ERROR_TOO_MANY_ATTEMPTS: string;
  readonly ERROR_LOCKOUT_TIME: string;
  readonly DEVICE_INFO_TITLE: string;
  readonly SECURITY_WARNING: string;
  readonly SECURITY_WARNING_DESC: string;
}

export interface LockAccessTheme {
  readonly PRIMARY_COLOR: string;
  readonly SUCCESS_COLOR: string;
  readonly WARNING_COLOR: string;
  readonly ERROR_COLOR: string;
  readonly BACKGROUND_COLOR: string;
  readonly CARD_COLOR: string;
}

export interface LockAccessAnimations {
  readonly ENABLE_GSAP: boolean;
  readonly DURATION_FAST: number;
  readonly DURATION_NORMAL: number;
  readonly EASING_SMOOTH: string;
  readonly EASING_BOUNCE: string;
}

export interface LockAccessConfigType {
  readonly SITE_NAME: string;
  readonly SECURITY: LockAccessSecurity;
  readonly MESSAGES: LockAccessMessages;
  readonly THEME: LockAccessTheme;
  readonly ANIMATIONS: LockAccessAnimations;
}

export interface SecurityStatus {
  isLocked: boolean;
  isAuthenticated: boolean;
  sessionExpires: number | null;
  deviceId: string | null;
  firewallEnabled: boolean;
  deviceTrackingEnabled: boolean;
}

export const LOCKACCESS_CONFIG: LockAccessConfigType;
export const getLockAccessConfig: () => LockAccessConfigType;
export const updateLockAccessConfig: (updates: Partial<LockAccessConfigType>) => LockAccessConfigType;
export const resetLockAccessConfig: () => LockAccessConfigType;
export const isSiteLocked: () => boolean;
export const toggleSiteLock: (locked?: boolean | null) => boolean;
export const getSecurityStatus: () => SecurityStatus;

export default LOCKACCESS_CONFIG;
