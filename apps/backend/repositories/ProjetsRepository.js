const BaseRepository = require('./BaseRepository');
const db = require('../database/db');

/**
 * ProjetsRepository - Accès aux données spécifique aux projets
 * Hérite de BaseRepository pour les opérations CRUD de base
 *
 * SÉCURITÉ : Tous les ORDER BY sont validés par whitelist.
 * Les valeurs sont toujours passées via prepared statements.
 */
class ProjetsRepository extends BaseRepository {
  constructor() {
    super('projets');
  }

  /**
   * Récupère les projets publics (statut 'termine')
   */
  async getPublic(options = {}) {
    const limit = Math.min(Math.max(parseInt(options.limit, 10) || 50, 1), 100);
    const offset = Math.max(parseInt(options.offset, 10) || 0, 0);

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
    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 6, 1), 50);

    const result = await db.execute({
      sql: `SELECT * FROM projets WHERE featured = 1 AND statut = 'termine' ORDER BY created_at DESC LIMIT ?`,
      args: [safeLimit],
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

    if (statut && typeof statut === 'string') {
      sql += ' AND statut = ?';
      args.push(statut);
    }

    if (type_projet && typeof type_projet === 'string') {
      sql += ' AND type_projet = ?';
      args.push(type_projet);
    }

    if (featured !== undefined && featured !== null) {
      sql += ' AND featured = ?';
      args.push(featured === 'true' || featured === true ? 1 : 0);
    }

    const safeOrderBy = this._safeOrderBy(orderBy, 'created_at');
    const safeOrder = this._safeOrder(order);

    const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 100);
    const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);

    sql += ` ORDER BY ${safeOrderBy} ${safeOrder} LIMIT ? OFFSET ?`;
    args.push(safeLimit, safeOffset);

    const result = await db.execute({ sql, args });
    return result.rows;
  }

  /**
   * Vérifie si un slug existe déjà
   */
  async slugExists(slug, excludeId = null) {
    if (typeof slug !== 'string' || slug.length === 0) return false;

    let sql = 'SELECT id FROM projets WHERE slug = ?';
    const args = [slug];

    if (excludeId !== null && excludeId !== undefined) {
      const safeId = parseInt(excludeId, 10);
      if (!isNaN(safeId) && safeId >= 1) {
        sql += ' AND id != ?';
        args.push(safeId);
      }
    }

    const result = await db.execute({ sql, args });
    return result.rows.length > 0;
  }

  /**
   * Crée un projet avec RETURNING id
   */
  async createWithReturning(data) {
    const sanitized = this._sanitizeData(data);
    const columns = Object.keys(sanitized);

    if (columns.length === 0) {
      throw new Error('Aucune colonne valide fournie pour l\'insertion');
    }

    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(sanitized).map(v => v === undefined ? null : v);

    const result = await db.execute({
      sql: `INSERT INTO projets (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      args: values,
    });
    return result.rows[0]?.id || Number(result.lastInsertRowid);
  }

  /**
   * Met à jour un projet avec COALESCE pour les champs optionnels
   */
  async updateWithCoalesce(id, data) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) {
      throw new Error('ID invalide pour la mise à jour');
    }

    const {
      titre, description, contenu, type_projet, client, lieu,
      date_debut, date_fin, statut, images, documents, videos,
      meta_keywords, meta_description, slug, featured,
    } = data;

    // Convertir explicitement undefined en null pour COALESCE
    const toNull = (v) => v === undefined ? null : v;

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
        toNull(titre), toNull(description), toNull(contenu),
        toNull(type_projet), toNull(client), toNull(lieu),
        toNull(date_debut), toNull(date_fin), toNull(statut),
        toNull(images), toNull(documents), toNull(videos),
        toNull(meta_keywords), toNull(meta_description),
        toNull(slug), toNull(featured), safeId,
      ],
    });
  }
}

module.exports = ProjetsRepository;
