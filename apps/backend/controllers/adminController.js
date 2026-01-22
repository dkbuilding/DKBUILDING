const db = require("../database/db");
const Logger = require("../utils/logger");
const { cloudinary } = require("../middleware/upload");

/**
 * Admin Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

class AdminController {
  /**
   * Récupérer les statistiques (Async Turso)
   */
  static async getStats(req, res) {
    try {
      // Statistiques annonces
      const annoncesTotal = await db.execute(
        "SELECT COUNT(*) as count FROM annonces",
      );
      const annoncesPubliees = await db.execute(
        "SELECT COUNT(*) as count FROM annonces WHERE statut = 'publie'",
      );
      const annoncesBrouillon = await db.execute(
        "SELECT COUNT(*) as count FROM annonces WHERE statut = 'brouillon'",
      );

      // Statistiques projets
      const projetsTotal = await db.execute(
        "SELECT COUNT(*) as count FROM projets",
      );
      const projetsTermines = await db.execute(
        "SELECT COUNT(*) as count FROM projets WHERE statut = 'termine'",
      );
      const projetsEnCours = await db.execute(
        "SELECT COUNT(*) as count FROM projets WHERE statut = 'en_cours'",
      );
      const projetsFeatured = await db.execute(
        "SELECT COUNT(*) as count FROM projets WHERE featured = 1",
      );

      // Statistiques médias (Cloudinary API)
      let mediaCount = 0;
      let totalSize = 0;

      try {
        const cloudinaryStats = await cloudinary.api.resources({
          type: "upload",
          prefix: "dkbuilding/",
          max_results: 500,
        });

        mediaCount = cloudinaryStats.resources.length;
        totalSize = cloudinaryStats.resources.reduce(
          (sum, resource) => sum + (resource.bytes || 0),
          0,
        );
      } catch (cloudinaryError) {
        console.warn(
          "Cloudinary stats non disponibles:",
          cloudinaryError.message,
        );
      }

      // Statistiques logs
      const logsTotal = await db.execute("SELECT COUNT(*) as count FROM logs");
      const logsRecent = await db.execute(`
        SELECT COUNT(*) as count FROM logs 
        WHERE timestamp > datetime('now', '-7 days')
      `);

      res.json({
        success: true,
        data: {
          annonces: {
            total: annoncesTotal.rows[0]?.count || 0,
            publiees: annoncesPubliees.rows[0]?.count || 0,
            brouillon: annoncesBrouillon.rows[0]?.count || 0,
          },
          projets: {
            total: projetsTotal.rows[0]?.count || 0,
            termines: projetsTermines.rows[0]?.count || 0,
            en_cours: projetsEnCours.rows[0]?.count || 0,
            featured: projetsFeatured.rows[0]?.count || 0,
          },
          medias: {
            total: mediaCount,
            totalSize: totalSize,
            totalSizeFormatted: formatFileSize(totalSize),
          },
          logs: {
            total: logsTotal.rows[0]?.count || 0,
            recent: logsRecent.rows[0]?.count || 0,
          },
        },
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des statistiques",
        message:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  }

  /**
   * Récupérer les logs récents (Async Turso)
   */
  static async getLogs(req, res) {
    try {
      const limit = Math.min(Math.max(parseInt(req.query.limit) || 50, 1), 200);
      const offset = Math.max(parseInt(req.query.offset) || 0, 0);

      const result = await db.execute({
        sql: "SELECT * FROM logs ORDER BY timestamp DESC LIMIT ? OFFSET ?",
        args: [limit, offset],
      });

      // Parser les détails JSON
      const logsParsed = result.rows.map((log) => ({
        ...log,
        details: log.details ? JSON.parse(log.details) : null,
      }));

      res.json({
        success: true,
        data: logsParsed,
        count: logsParsed.length,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des logs:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de la récupération des logs",
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
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

module.exports = AdminController;
