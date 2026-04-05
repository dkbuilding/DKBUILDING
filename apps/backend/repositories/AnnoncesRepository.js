const BaseRepository = require('./BaseRepository');
const db = require('../database/db');

/**
 * AnnoncesRepository - Accès aux données spécifique aux annonces
 * Hérite de BaseRepository pour les opérations CRUD de base
 *
 * SÉCURITÉ : Tous les ORDER BY sont validés par whitelist.
 * Les valeurs sont toujours passées via prepared statements.
 */
class AnnoncesRepository extends BaseRepository {
  constructor() {
    super('annonces');
  }

  /**
   * Récupère les annonces publiques (statut 'publie')
   */
  async getPublic(options = {}) {
    const limit = Math.min(Math.max(parseInt(options.limit, 10) || 10, 1), 100);
    const offset = Math.max(parseInt(options.offset, 10) || 0, 0);

    const result = await db.execute({
      sql: `SELECT * FROM annonces WHERE statut = 'publie' ORDER BY date_publication DESC LIMIT ? OFFSET ?`,
      args: [limit, offset],
    });
    return result.rows;
  }

  /**
   * Récupère les annonces avec filtres avancés
   */
  async getFiltered(options = {}) {
    const { statut, categorie, auteur_id, orderBy, order, limit, offset } = options;

    let sql = 'SELECT * FROM annonces WHERE 1=1';
    const args = [];

    if (statut && typeof statut === 'string') {
      sql += ' AND statut = ?';
      args.push(statut);
    }

    if (categorie && typeof categorie === 'string') {
      sql += ' AND categorie = ?';
      args.push(categorie);
    }

    if (auteur_id !== undefined && auteur_id !== null) {
      const safeAuteurId = parseInt(auteur_id, 10);
      if (!isNaN(safeAuteurId) && safeAuteurId >= 1) {
        sql += ' AND auteur_id = ?';
        args.push(safeAuteurId);
      }
    }

    const safeOrderBy = this._safeOrderBy(orderBy, 'date_publication');
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

    let sql = 'SELECT id FROM annonces WHERE slug = ?';
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
   * Crée une annonce avec RETURNING id
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
      sql: `INSERT INTO annonces (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      args: values,
    });
    return result.rows[0]?.id || Number(result.lastInsertRowid);
  }

  /**
   * Met à jour une annonce avec COALESCE pour les champs optionnels
   */
  async updateWithCoalesce(id, data) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) {
      throw new Error('ID invalide pour la mise à jour');
    }

    const {
      titre, description, contenu, categorie, statut,
      images, documents, meta_keywords, meta_description, slug,
    } = data;

    // Convertir explicitement undefined en null pour COALESCE
    const toNull = (v) => v === undefined ? null : v;

    await db.execute({
      sql: `
        UPDATE annonces SET
          titre = COALESCE(?, titre),
          description = COALESCE(?, description),
          contenu = COALESCE(?, contenu),
          categorie = COALESCE(?, categorie),
          statut = COALESCE(?, statut),
          images = COALESCE(?, images),
          documents = COALESCE(?, documents),
          meta_keywords = COALESCE(?, meta_keywords),
          meta_description = COALESCE(?, meta_description),
          slug = COALESCE(?, slug),
          date_modification = datetime('now')
        WHERE id = ?
      `,
      args: [
        toNull(titre), toNull(description), toNull(contenu),
        toNull(categorie), toNull(statut), toNull(images),
        toNull(documents), toNull(meta_keywords), toNull(meta_description),
        toNull(slug), safeId,
      ],
    });
  }
}

module.exports = AnnoncesRepository;
