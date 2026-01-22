const db = require("../database/db");

/**
 * Logger - Version Serverless (Turso Async)
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

class Logger {
  /**
   * Créer un log d'audit (Async)
   */
  static async createLog(
    action,
    entity_type,
    entity_id,
    user_id,
    details = {},
  ) {
    try {
      await db.execute({
        sql: `
          INSERT INTO logs (action, entity_type, entity_id, user_id, details, timestamp)
          VALUES (?, ?, ?, ?, ?, datetime('now'))
        `,
        args: [
          action,
          entity_type,
          entity_id,
          user_id,
          JSON.stringify(details),
        ],
      });
    } catch (error) {
      console.error("Erreur lors de la création du log:", error);
      // Ne pas throw pour ne pas bloquer l'opération principale
    }
  }

  /**
   * Récupérer les logs (Async)
   */
  static async getLogs({
    limit = 50,
    offset = 0,
    action,
    entity_type,
    user_id,
  } = {}) {
    try {
      let query = "SELECT * FROM logs WHERE 1=1";
      const args = [];

      if (action) {
        query += " AND action = ?";
        args.push(action);
      }

      if (entity_type) {
        query += " AND entity_type = ?";
        args.push(entity_type);
      }

      if (user_id) {
        query += " AND user_id = ?";
        args.push(user_id);
      }

      query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
      args.push(limit, offset);

      const result = await db.execute({ sql: query, args });
      return result.rows;
    } catch (error) {
      console.error("Erreur lors de la récupération des logs:", error);
      return [];
    }
  }

  /**
   * Supprimer les vieux logs (Async)
   */
  static async cleanOldLogs(daysToKeep = 90) {
    try {
      const result = await db.execute({
        sql: `DELETE FROM logs WHERE timestamp < datetime('now', '-' || ? || ' days')`,
        args: [daysToKeep],
      });

      console.log(
        `🧹 Nettoyage des logs: ${result.rowsAffected || 0} entrées supprimées`,
      );
      return result.rowsAffected || 0;
    } catch (error) {
      console.error("Erreur lors du nettoyage des logs:", error);
      return 0;
    }
  }
}

module.exports = Logger;
