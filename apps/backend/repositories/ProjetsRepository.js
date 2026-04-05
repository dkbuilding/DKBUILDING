const BaseRepository = require('./BaseRepository');
const db = require('../database/db');

/**
 * ProjetsRepository - Accès aux données spécifique aux projets
 * Hérite de BaseRepository pour les opérations CRUD de base
 */
class ProjetsRepository extends BaseRepository {
  constructor() {
    super('projets');
  }

  /**
   * Récupère les projets publics (statut 'termine')
   */
  async getPublic(options = {}) {
    const { limit = 50, offset = 0 } = options;
    const result = await db.execute({
      sql: `SELECT * FROM projets WHERE statut = 'termine' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [limit, offset],
    });
    return result.rows;
  }

  /**
   * Récupère les projets featured
   */
  async getFeatured(limit = 6) {
    const result = await db.execute({
      sql: `SELECT * FROM projets WHERE featured = 1 AND statut = 'termine' ORDER BY created_at DESC LIMIT ?`,
      args: [limit],
    });
    return result.rows;
  }

  /**
   * Récupère les projets avec filtres avancés
   */
  async getFiltered(options = {}) {
    const { statut, type_projet, featured, orderBy, order, limit, offset } = options;

    let sql = 'SELECT * FROM projets WHERE 1=1';
    const args = [];

    if (statut) {
      sql += ' AND statut = ?';
      args.push(statut);
    }

    if (type_projet) {
      sql += ' AND type_projet = ?';
      args.push(type_projet);
    }

    if (featured !== undefined) {
      sql += ' AND featured = ?';
      args.push(featured === 'true' ? 1 : 0);
    }

    const allowedOrderBy = ['date_debut', 'date_fin', 'created_at', 'vue_count', 'titre'];
    const safeOrderBy = allowedOrderBy.includes(orderBy) ? orderBy : 'created_at';
    const safeOrder = (order || 'DESC').toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    sql += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
    args.push(limit, offset);

    const result = await db.execute({ sql, args });
    return result.rows;
  }

  /**
   * Vérifie si un slug existe déjà
   */
  async slugExists(slug, excludeId = null) {
    let sql = 'SELECT id FROM projets WHERE slug = ?';
    const args = [slug];
    if (excludeId) {
      sql += ' AND id != ?';
      args.push(excludeId);
    }
    const result = await db.execute({ sql, args });
    return result.rows.length > 0;
  }

  /**
   * Crée un projet avec RETURNING id
   */
  async createWithReturning(data) {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);
    const result = await db.execute({
      sql: `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      args: values,
    });
    return result.rows[0]?.id || Number(result.lastInsertRowid);
  }

  /**
   * Met à jour un projet avec COALESCE pour les champs optionnels
   */
  async updateWithCoalesce(id, data) {
    const {
      titre, description, contenu, type_projet, client, lieu,
      date_debut, date_fin, statut, images, documents, videos,
      meta_keywords, meta_description, slug, featured,
    } = data;

    await db.execute({
      sql: `
        UPDATE projets SET
          titre = COALESCE(?, titre),
          description = COALESCE(?, description),
          contenu = COALESCE(?, contenu),
          type_projet = COALESCE(?, type_projet),
          client = COALESCE(?, client),
          lieu = COALESCE(?, lieu),
          date_debut = COALESCE(?, date_debut),
          date_fin = COALESCE(?, date_fin),
          statut = COALESCE(?, statut),
          images = COALESCE(?, images),
          documents = COALESCE(?, documents),
          videos = COALESCE(?, videos),
          meta_keywords = COALESCE(?, meta_keywords),
          meta_description = COALESCE(?, meta_description),
          slug = COALESCE(?, slug),
          featured = COALESCE(?, featured),
          updated_at = datetime('now')
        WHERE id = ?
      `,
      args: [
        titre, description, contenu, type_projet, client, lieu,
        date_debut, date_fin, statut, images, documents, videos,
        meta_keywords, meta_description, slug, featured, id,
      ],
    });
  }
}

module.exports = ProjetsRepository;
