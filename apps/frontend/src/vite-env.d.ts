/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PORT: string
  readonly FRONTEND_PORT: string
  readonly APP_ENV: string
  readonly NODE_ENV: string
  readonly API_URL: string
  readonly API_BASE_URL: string
  readonly LOCKACCESS: boolean
  readonly LOCKACCESS_LOCKED: boolean
  readonly LOCKACCESS_MASTER_PASSWORD: string
  readonly LOCKACCESS_SESSION_TIMEOUT: number
  readonly LOCKACCESS_MAX_ATTEMPTS: number
  readonly LOCKACCESS_LOCKOUT_DURATION: number
  // Variables Cloudinary
  readonly CLOUDINARY_CLOUD_NAME: string
  readonly CLOUDINARY_API_KEY: string
  readonly CLOUDINARY_UPLOAD_PRESET: string
  readonly CLOUDINARY_FOLDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
