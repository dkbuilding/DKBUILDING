/**
 * Utilitaire Cloudinary pour upload et gestion de médias
 * Upload direct depuis le frontend vers Cloudinary
 *
 * @author DK BUILDING
 * @version latest
 */

/**
 * Configuration Cloudinary depuis les variables d'environnement
 */
const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.CLOUDINARY_CLOUD_NAME || "dztbdnp3l",
  apiKey: import.meta.env.CLOUDINARY_API_KEY || "",
  uploadPreset:
    import.meta.env.CLOUDINARY_UPLOAD_PRESET || "dkbuilding-unsigned",
  folder: import.meta.env.CLOUDINARY_FOLDER || "dkbuilding",
  apiUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME || "dztbdnp3l"}`,
  uploadUrl: `https://api.cloudinary.com/v1_1/${import.meta.env.CLOUDINARY_CLOUD_NAME || "dztbdnp3l"}/upload`,
};

/**
 * Upload un fichier vers Cloudinary
 *
 * @param {File} file - Fichier à uploader
 * @param {Object} options - Options d'upload
 * @param {string} options.folder - Dossier de destination (ex: 'dkbuilding/media')
 * @param {string} options.resourceType - Type de ressource ('image', 'video', 'raw', 'auto')
 * @param {Object} options.tags - Tags à ajouter au fichier
 * @param {Object} options.context - Métadonnées personnalisées
 * @param {Object} options.transformations - Transformations à appliquer
 * @returns {Promise<Object>} Résultat de l'upload avec URL, public_id, etc.
 */
export async function uploadToCloudinary(file, options = {}) {
  const {
    folder = CLOUDINARY_CONFIG.folder,
    resourceType = "auto",
    tags = [],
    context = {},
    transformations = {},
  } = options;

  // Vérifier que le fichier existe
  if (!file) {
    throw new Error("Aucun fichier fourni");
  }

  // Vérifier la taille du fichier (max 10 MB par défaut, ajustable selon votre plan)
  const maxSize = 10 * 1024 * 1024; // 10 MB
  if (file.size > maxSize) {
    throw new Error(
      `Le fichier est trop volumineux (max ${maxSize / 1024 / 1024} MB)`,
    );
  }

  // Créer FormData pour l'upload
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_CONFIG.uploadPreset);

  // Ajouter le dossier si spécifié
  if (folder) {
    formData.append("folder", folder);
  }

  // Ajouter le type de ressource
  if (resourceType !== "auto") {
    formData.append("resource_type", resourceType);
  }

  // Ajouter les tags
  if (tags.length > 0) {
    formData.append("tags", tags.join(","));
  }

  // Ajouter le contexte (métadonnées)
  if (Object.keys(context).length > 0) {
    formData.append("context", JSON.stringify(context));
  }

  // Ajouter les transformations
  if (Object.keys(transformations).length > 0) {
    const transformationString = Object.entries(transformations)
      .map(([key, value]) => `${key}_${value}`)
      .join(",");
    formData.append("transformation", transformationString);
  }

  try {
    const response = await fetch(CLOUDINARY_CONFIG.uploadUrl, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.error?.message || `Erreur HTTP ${response.status}`,
      );
    }

    const result = await response.json();

    return {
      public_id: result.public_id,
      secure_url: result.secure_url,
      url: result.url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      resource_type: result.resource_type,
      created_at: result.created_at,
      folder: result.folder,
      // Données supplémentaires
      original_filename: result.original_filename,
      etag: result.etag,
      version: result.version,
    };
  } catch (error) {
    console.error("Erreur upload Cloudinary:", error);
    throw new Error(
      `Erreur lors de l'upload vers Cloudinary: ${error.message}`,
    );
  }
}

/**
 * Supprime un fichier de Cloudinary
 *
 * ⚠️ ATTENTION : La suppression nécessite l'API Secret (non disponible en frontend)
 * Pour la suppression, utilisez une fonction serverless (Vercel Functions, Netlify Functions, etc.)
 *
 * @param {string} publicId - Public ID du fichier à supprimer
 * @returns {Promise<Object>} Résultat de la suppression
 */
export async function deleteFromCloudinary(publicId) {
  // ⚠️ Cette fonction nécessite l'API Secret
  // Pour une suppression sécurisée, créez une fonction serverless

  console.warn(
    "⚠️ La suppression directe depuis le frontend nécessite l'API Secret.",
  );
  console.warn(
    "⚠️ Utilisez une fonction serverless pour la suppression sécurisée.",
  );

  throw new Error(
    "La suppression nécessite une fonction serverless avec l'API Secret",
  );
}

/**
 * Génère une URL optimisée avec transformations
 *
 * @param {string} publicId - Public ID de l'image
 * @param {Object} transformations - Transformations à appliquer
 * @param {number} transformations.width - Largeur
 * @param {number} transformations.height - Hauteur
 * @param {string} transformations.crop - Type de crop ('fill', 'fit', 'scale', etc.)
 * @param {string} transformations.quality - Qualité ('auto', '80', etc.)
 * @param {string} transformations.format - Format ('auto', 'webp', 'jpg', etc.)
 * @returns {string} URL optimisée
 */
export function getOptimizedUrl(publicId, transformations = {}) {
  const {
    width,
    height,
    crop = "fill",
    quality = "auto",
    format = "auto",
  } = transformations;

  const baseUrl = `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}`;
  const resourceType = "image"; // ou 'video', 'raw'

  // Construire la chaîne de transformations
  const transforms = [];
  if (width) transforms.push(`w_${width}`);
  if (height) transforms.push(`h_${height}`);
  if (crop) transforms.push(`c_${crop}`);
  if (quality) transforms.push(`q_${quality}`);
  if (format) transforms.push(`f_${format}`);

  const transformString =
    transforms.length > 0 ? `${transforms.join(",")}/` : "";

  return `${baseUrl}/${resourceType}/upload/${transformString}${publicId}`;
}

/**
 * Génère un srcset responsive pour les images
 *
 * @param {string} publicId - Public ID de l'image
 * @param {Array<number>} widths - Largeurs à générer (ex: [400, 800, 1200])
 * @returns {string} Attribut srcset
 */
export function generateSrcSet(publicId, widths = [400, 800, 1200, 1600]) {
  return widths
    .map((width) => {
      const url = getOptimizedUrl(publicId, {
        width,
        crop: "scale",
        quality: "auto",
        format: "auto",
      });
      return `${url} ${width}w`;
    })
    .join(", ");
}

/**
 * Génère une URL de thumbnail
 *
 * @param {string} publicId - Public ID de l'image
 * @param {number} size - Taille du thumbnail (carré)
 * @returns {string} URL du thumbnail
 */
export function getThumbnailUrl(publicId, size = 200) {
  return getOptimizedUrl(publicId, {
    width: size,
    height: size,
    crop: "fill",
    quality: "auto",
    format: "auto",
  });
}

/**
 * Vérifie si Cloudinary est configuré
 *
 * @returns {boolean} True si configuré
 */
export function isCloudinaryConfigured() {
  return !!(CLOUDINARY_CONFIG.cloudName && CLOUDINARY_CONFIG.uploadPreset);
}

/**
 * Obtient la configuration Cloudinary (sans secrets)
 *
 * @returns {Object} Configuration publique
 */
export function getCloudinaryConfig() {
  return {
    cloudName: CLOUDINARY_CONFIG.cloudName,
    uploadPreset: CLOUDINARY_CONFIG.uploadPreset,
    folder: CLOUDINARY_CONFIG.folder,
  };
}
