// En dev, le proxy Vite redirige /api vers localhost:3001
// En prod, utiliser l'URL du backend Vercel ou le chemin relatif
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Wrapper fetch sécurisé avec cookie HttpOnly JWT
 * et gestion d'erreurs standardisée.
 * Architecture GovTech pour DK BUILDING
 *
 * Le token JWT est stocké dans un cookie HttpOnly géré par le navigateur.
 * Il est envoyé automatiquement via credentials: 'include'.
 */
async function client(
  endpoint,
  { data, headers: customHeaders, ...customConfig } = {},
) {
  const config = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
    headers: {
      ...(data ? { "Content-Type": "application/json" } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  return window
    .fetch(`${API_BASE_URL}${endpoint}`, config)
    .then(async (response) => {
      // Gestion du logout automatique si 401 (Token expiré/invalide)
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return Promise.reject({ message: "Session expirée" });
      }

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
}

// Méthodes utilitaires pour le CRUD
export const api = {
  get: (endpoint) => client(endpoint),
  post: (endpoint, data) => client(endpoint, { data, method: "POST" }),
  put: (endpoint, data) => client(endpoint, { data, method: "PUT" }),
  delete: (endpoint) => client(endpoint, { method: "DELETE" }),

  // Pour l'upload de fichiers (nécessite un traitement spécial des headers)
  upload: async (endpoint, formData) => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      credentials: "include",
      // Pas de Content-Type, le navigateur le mettra (multipart)
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};
