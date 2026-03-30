const BaseRepository = require('./BaseRepository');
const db = require('../database/db');

/**
 * AnnoncesRepository - Accès aux données spécifique aux annonces
 * Hérite de BaseRepository pour les opérations CRUD de base
 */
class AnnoncesRepository extends BaseRepository {
  constructor() {
    super('annonces');
  }

  /**
   * Récupère les annonces publiques (statut 'publie')
   */
  async getPublic(options = {}) {
    const { limit = 10, offset = 0 } = options;
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

    if (statut) {
      sql += ' AND statut = ?';
      args.push(statut);
    }

    if (categorie) {
      sql += ' AND categorie = ?';
      args.push(categorie);
    }

    if (auteur_id) {
      sql += ' AND auteur_id = ?';
      args.push(auteur_id);
    }

    const allowedOrderBy = ['date_publication', 'created_at', 'vue_count', 'titre'];
    const safeOrderBy = allowedOrderBy.includes(orderBy) ? orderBy : 'date_publication';
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
    let sql = 'SELECT id FROM annonces WHERE slug = ?';
    const args = [slug];
    if (excludeId) {
      sql += ' AND id != ?';
      args.push(excludeId);
    }
    const result = await db.execute({ sql, args });
    return result.rows.length > 0;
  }

  /**
   * Crée une annonce avec RETURNING id
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
   * Met à jour une annonce avec COALESCE pour les champs optionnels
   */
  async updateWithCoalesce(id, data) {
    const {
      titre, description, contenu, categorie, statut,
      images, documents, meta_keywords, meta_description, slug,
    } = data;

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
        titre, description, contenu, categorie, statut,
        images, documents, meta_keywords, meta_description, slug, id,
      ],
    });
  }
}

module.exports = AnnoncesRepository;
