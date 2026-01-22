const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001/api";

/**
 * Wrapper fetch sécurisé avec injection automatique de Token
 * et gestion d'erreurs standardisée.
 * Architecture GovTech pour DK BUILDING
 */
async function client(
  endpoint,
  { data, token, headers: customHeaders, ...customConfig } = {},
) {
  const jwt = token || localStorage.getItem("jwt_token");

  const config = {
    method: data ? "POST" : "GET",
    body: data ? JSON.stringify(data) : undefined,
    headers: {
      "Content-Type": data ? "application/json" : undefined,
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
      ...customHeaders,
    },
    ...customConfig,
  };

  return window
    .fetch(`${API_BASE_URL}${endpoint}`, config)
    .then(async (response) => {
      // Gestion du logout automatique si 401 (Token expiré/invalide)
      if (response.status === 401) {
        localStorage.removeItem("jwt_token");
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
    const jwt = localStorage.getItem("jwt_token");
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${jwt}` }, // Pas de Content-Type, le navigateur le mettra (multipart)
      body: formData,
    });
    const data = await response.json();
    if (!response.ok) throw data;
    return data;
  },
};
