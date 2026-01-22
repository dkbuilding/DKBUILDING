const { cloudinary } = require("../middleware/upload");
const Logger = require("../utils/logger");

/**
 * Media Controller - Version Cloudinary
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

class MediaController {
  /**
   * Servir un fichier média (redirect vers Cloudinary)
   */
  static serve(req, res) {
    try {
      const { filename } = req.params;

      // Construire l'URL Cloudinary
      const cloudinaryUrl = cloudinary.url(filename, {
        secure: true,
        resource_type: "auto",
      });

      // Rediriger vers Cloudinary
      res.redirect(cloudinaryUrl);
    } catch (error) {
      console.error("Erreur lors du service du fichier:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors du service du fichier",
        message: error.message,
      });
    }
  }

  /**
   * Lister tous les médias depuis Cloudinary
   */
  static async list(req, res) {
    try {
      // Récupérer les ressources du dossier 'dkbuilding'
      const result = await cloudinary.search
        .expression("folder:dkbuilding/*")
        .sort_by("created_at", "desc")
        .max_results(500)
        .execute();

      const files = result.resources.map((file) => {
        const ext = "." + (file.format || "unknown");
        return {
          filename: file.public_id, // L'ID unique Cloudinary
          url: file.secure_url,
          name: (file.filename || file.public_id.split("/").pop()) + ext,
          size: file.bytes,
          sizeFormatted: formatFileSize(file.bytes),
          type: getFileType(file.resource_type, ext),
          extension: ext,
          created: file.created_at,
          modified: file.created_at,
        };
      });

      res.json({
        success: true,
        data: files,
        count: files.length,
      });
    } catch (error) {
      console.error("Erreur Cloudinary List:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des médias",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Supprimer un fichier de Cloudinary
   */
  static async delete(req, res) {
    try {
      const { filename } = req.params; // C'est le public_id Cloudinary

      // Tenter de supprimer pour tous les types de ressources
      // (on ne sait pas toujours si c'est une image, vidéo ou raw)
      try {
        await cloudinary.uploader.destroy(filename, { resource_type: "image" });
      } catch (e) {
        // Ignorer si pas trouvé
      }

      try {
        await cloudinary.uploader.destroy(filename, { resource_type: "video" });
      } catch (e) {
        // Ignorer si pas trouvé
      }

      try {
        await cloudinary.uploader.destroy(filename, { resource_type: "raw" });
      } catch (e) {
        // Ignorer si pas trouvé
      }

      // Log de l'action
      await Logger.createLog("delete", "media", null, req.user?.id, {
        filename,
      });

      res.json({
        success: true,
        message: "Fichier supprimé de Cloudinary",
      });
    } catch (error) {
      console.error("Erreur Cloudinary Delete:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la suppression",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }
}

/**
 * Formater la taille d'un fichier
 */
function formatFileSize(bytes) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Déterminer le type de fichier
 */
function getFileType(resourceType, ext) {
  if (resourceType === "image") return "image";
  if (resourceType === "video") return "video";

  const documentExts = [".pdf", ".doc", ".docx"];
  if (documentExts.includes(ext)) return "document";

  return "other";
}

module.exports = MediaController;
