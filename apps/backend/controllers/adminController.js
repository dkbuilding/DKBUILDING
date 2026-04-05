const db = require("../database/db");
const Logger = require("../utils/logger");
const { cloudinary } = require("../middleware/upload");
const { formatFileSize } = require("../utils/format");

/**
 * Admin Controller - Version Serverless (Turso + Cloudinary)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * OPTIMISATION: Requêtes agrégées pour les statistiques (2 requêtes SQL au lieu de 9)
 */

class AdminController {
  /**
   * Récupérer les statistiques (Async Turso)
   *
   * AVANT: 9 requêtes séquentielles COUNT(*)
   * APRÈS: 2 requêtes avec agrégation conditionnelle
   */
  static async getStats(req, res) {
    try {
      // Une seule requête pour toutes les stats annonces + projets
      const [annoncesStats, projetsStats, logsStats] = await Promise.all([
        db.execute(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN statut = 'publie' THEN 1 ELSE 0 END) as publiees,
            SUM(CASE WHEN statut = 'brouillon' THEN 1 ELSE 0 END) as brouillon
          FROM annonces
        `),
        db.execute(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN statut = 'termine' THEN 1 ELSE 0 END) as termines,
            SUM(CASE WHEN statut = 'en_cours' THEN 1 ELSE 0 END) as en_cours,
            SUM(CASE WHEN featured = 1 THEN 1 ELSE 0 END) as featured
          FROM projets
        `),
        db.execute(`
          SELECT
            COUNT(*) as total,
            SUM(CASE WHEN timestamp > datetime('now', '-7 days') THEN 1 ELSE 0 END) as recent
          FROM logs
        `),
      ]);

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

      const annRow = annoncesStats.rows[0] || {};
      const projRow = projetsStats.rows[0] || {};
      const logsRow = logsStats.rows[0] || {};

      res.json({
        success: true,
        data: {
          annonces: {
            total: annRow.total || 0,
            publiees: annRow.publiees || 0,
            brouillon: annRow.brouillon || 0,
          },
          projets: {
            total: projRow.total || 0,
            termines: projRow.termines || 0,
            en_cours: projRow.en_cours || 0,
            featured: projRow.featured || 0,
          },
          medias: {
            total: mediaCount,
            totalSize: totalSize,
            totalSizeFormatted: formatFileSize(totalSize),
          },
          logs: {
            total: logsRow.total || 0,
            recent: logsRow.recent || 0,
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

module.exports = AdminController;
