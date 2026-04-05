/**
 * Client API sécurisé pour DK BUILDING
 * Wrapper fetch avec cookie HttpOnly JWT et gestion d'erreurs standardisée.
 */

// En dev, le proxy Vite redirige /api vers localhost:3001
// En prod, utiliser l'URL du backend Vercel ou le chemin relatif
const API_BASE_URL: string = import.meta.env.VITE_API_URL || "/api";

interface ClientConfig extends Omit<RequestInit, 'body' | 'headers'> {
  readonly data?: Record<string, unknown>;
  readonly headers?: Record<string, string>;
}

interface APIError {
  readonly message: string;
  readonly [key: string]: unknown;
}

async function client<T = unknown>(
  endpoint: string,
  { data, headers: customHeaders, ...customConfig }: ClientConfig = {},
): Promise<T> {
  const config: RequestInit = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  const response = await window.fetch(`${API_BASE_URL}${endpoint}`, config);

  // Gestion du logout automatique si 401 (Token expiré/invalide)
  if (response.status === 401) {
    window.location.assign("/admin/login");
    return Promise.reject({ message: "Session expirée" } satisfies APIError);
  }

  const responseData: T = await response.json();

  if (response.ok) {
    return responseData;
  } else {
    return Promise.reject(responseData);
  }
}

/** Méthodes utilitaires pour le CRUD */
export const api = {
  get: <T = unknown>(endpoint: string): Promise<T> =>
    client<T>(endpoint),

  post: <T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<T> =>
    client<T>(endpoint, { data, method: "POST" }),

  put: <T = unknown>(endpoint: string, data: Record<string, unknown>): Promise<T> =>
    client<T>(endpoint, { data, method: "PUT" }),

  delete: <T = unknown>(endpoint: string): Promise<T> =>
    client<T>(endpoint, { method: "DELETE" }),

  /** Upload de fichiers (multipart, le navigateur gère le Content-Type) */
  upload: async <T = unknown>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    const data: T = await response.json();
    if (!response.ok) throw data;
    return data;
  },
} as const;
