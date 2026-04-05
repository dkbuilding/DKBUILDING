/// <reference types="vite/client" />

/**
 * Variables d'environnement Vite
 * 
 * IMPORTANT : toutes les variables d'environnement sont des `string` au runtime.
 * Même si elles representent des nombres ou des booleens dans .env,
 * import.meta.env les expose toujours comme des strings.
 * Utiliser des helpers de parsing si nécessaire.
 */
interface ImportMetaEnv {
  /** Mode Vite (development | production) */
  readonly MODE: string
  /** true en mode dev */
  readonly DEV: boolean
  /** true en mode production */
  readonly PROD: boolean
  /** URL de base (Vite) */
  readonly BASE_URL: string

  // --- Variables applicatives (injectées via define{} dans vite.config) ---

  readonly PORT?: string
  readonly FRONTEND_PORT?: string
  readonly APP_ENV?: string
  readonly NODE_ENV?: string
  readonly API_URL?: string
  readonly API_BASE_URL?: string

  // LockAccess (toutes les env vars sont des strings)
  readonly LOCKACCESS?: string
  readonly LOCKACCESS_LOCKED?: string
  readonly LOCKACCESS_MASTER_PASSWORD?: string
  readonly LOCKACCESS_SESSION_TIMEOUT?: string
  readonly LOCKACCESS_MAX_ATTEMPTS?: string
  readonly LOCKACCESS_LOCKOUT_DURATION?: string

  // Cloudinary (publiques uniquement)
  readonly CLOUDINARY_CLOUD_NAME?: string
  readonly CLOUDINARY_API_KEY?: string
  readonly CLOUDINARY_UPLOAD_PRESET?: string
  readonly CLOUDINARY_FOLDER?: string

  // Variables prefixees VITE_ (accessibles directement)
  readonly VITE_API_URL?: string

  // Flags de debug (logger.js)
  readonly ENABLE_WARNINGS?: string
  readonly ENABLE_SCROLL_LOGS?: string
  readonly ENABLE_VIDEO_LOGS?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
