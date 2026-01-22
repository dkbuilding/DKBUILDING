/**
 * Utilitaire de chargement et vérification des ressources critiques
 * Gère les images, polices, vidéos avec retry automatique
 *
 * @author DK BUILDING
 * @version latest
 */

/**
 * Vérifie le chargement d'une image avec retry automatique
 *
 * @param {string} src - URL de l'image
 * @param {number} timeout - Timeout en millisecondes (défaut: 5000)
 * @param {number} retries - Nombre de tentatives (défaut: 2)
 * @returns {Promise<{loaded: boolean, error?: string}>}
 */
export async function loadImage(src, timeout = 5000, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await new Promise((resolve, reject) => {
        const img = new Image();
        const timeoutId = setTimeout(() => {
          reject(new Error("Timeout"));
        }, timeout);

        img.onload = () => {
          clearTimeout(timeoutId);
          resolve({ loaded: true });
        };

        img.onerror = () => {
          clearTimeout(timeoutId);
          reject(new Error("Image load failed"));
        };

        img.src = src;
      });

      return result;
    } catch (error) {
      if (attempt === retries) {
        return {
          loaded: false,
          error: error.message || "Erreur lors du chargement de l'image",
        };
      }
      // Attendre avant de réessayer
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

/**
 * Vérifie le chargement de plusieurs images critiques
 *
 * @param {string[]} imageSources - Liste des URLs d'images
 * @param {number} timeout - Timeout par image
 * @param {number} retries - Nombre de tentatives par image
 * @returns {Promise<{loaded: number, failed: number, results: Array}>}
 */
export async function loadCriticalImages(
  imageSources = [],
  timeout = 5000,
  retries = 2,
) {
  if (imageSources.length === 0) {
    return { loaded: 0, failed: 0, results: [] };
  }

  const results = await Promise.allSettled(
    imageSources.map((src) => loadImage(src, timeout, retries)),
  );

  const loaded = results.filter(
    (r) => r.status === "fulfilled" && r.value.loaded,
  ).length;
  const failed = results.length - loaded;

  return {
    loaded,
    failed,
    total: results.length,
    results: results.map((r, i) => ({
      src: imageSources[i],
      loaded: r.status === "fulfilled" && r.value.loaded,
      error: r.status === "rejected" ? r.reason?.message : r.value?.error,
    })),
  };
}

/**
 * Détecte les images critiques dans le DOM (avec attribut data-critical ou dans viewport)
 *
 * @returns {string[]} Liste des URLs d'images critiques
 */
export function detectCriticalImages() {
  const criticalImages = [];

  // Images avec attribut data-critical
  const dataCritical = Array.from(
    document.querySelectorAll("img[data-critical]"),
  );
  dataCritical.forEach((img) => {
    if (img.src) criticalImages.push(img.src);
  });

  // Images dans le viewport initial (above the fold)
  const viewportImages = Array.from(document.querySelectorAll("img"));
  viewportImages.forEach((img) => {
    if (img.src && !criticalImages.includes(img.src)) {
      const rect = img.getBoundingClientRect();
      // Si l'image est dans le viewport initial (première hauteur d'écran)
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        criticalImages.push(img.src);
      }
    }
  });

  return [...new Set(criticalImages)]; // Supprimer les doublons
}

/**
 * Précharge une ressource de manière intelligente
 *
 * @param {string} href - URL de la ressource
 * @param {string} as - Type de ressource (image, font, script, style)
 * @returns {Promise<boolean>}
 */
export async function preloadResource(href, as = "image") {
  return new Promise((resolve) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = as;
    link.crossOrigin = "anonymous";

    link.onload = () => resolve(true);
    link.onerror = () => resolve(false);

    document.head.appendChild(link);
  });
}
