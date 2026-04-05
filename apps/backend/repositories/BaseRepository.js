const db = require('../database/db');

/**
 * BaseRepository - Couche d'acces aux donnees generique
 * Elimine la duplication SQL entre les controllers
 *
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * SECURITE : Toutes les colonnes sont validees contre une whitelist
 * pour prevenir les injections SQL via les noms de colonnes.
 */

// Colonnes autorisees par table (whitelist stricte)
const ALLOWED_COLUMNS = {
  annonces: new Set([
    'id', 'titre', 'description', 'contenu', 'categorie',
    'date_publication', 'date_modification', 'auteur_id', 'statut',
    'images', 'documents', 'meta_keywords', 'meta_description',
    'slug', 'vue_count', 'created_at', 'updated_at',
  ]),
  projets: new Set([
    'id', 'titre', 'description', 'contenu', 'type_projet',
    'client', 'lieu', 'date_debut', 'date_fin', 'statut',
    'images', 'documents', 'videos', 'meta_keywords', 'meta_description',
    'slug', 'featured', 'vue_count', 'created_at', 'updated_at',
  ]),
  admin_users: new Set([
    'id', 'username', 'password_hash', 'email', 'role',
    'created_at', 'last_login',
  ]),
  logs: new Set([
    'id', 'action', 'entity_type', 'entity_id', 'user_id',
    'details', 'timestamp',
  ]),
};

// Colonnes ORDER BY autorisees par table
const ALLOWED_ORDER_COLUMNS = {
  annonces: new Set(['id', 'titre', 'date_publication', 'created_at', 'updated_at', 'vue_count', 'statut']),
  projets: new Set(['id', 'titre', 'date_debut', 'date_fin', 'created_at', 'updated_at', 'vue_count', 'statut']),
  admin_users: new Set(['id', 'username', 'created_at', 'last_login']),
  logs: new Set(['id', 'timestamp', 'action']),
};

class BaseRepository {
  constructor(tableName) {
    // Validation stricte du nom de table
    if (!ALLOWED_COLUMNS[tableName]) {
      throw new Error(`Table non autorisee: ${tableName}`);
    }
    this.tableName = tableName;
    this.allowedColumns = ALLOWED_COLUMNS[tableName];
    this.allowedOrderColumns = ALLOWED_ORDER_COLUMNS[tableName] || new Set(['id', 'created_at']);
  }

  /**
   * Valide qu'un nom de colonne est autorise pour cette table.
   * Previent l'injection SQL via les noms de colonnes.
   */
  _isValidColumn(column) {
    return typeof column === 'string' && this.allowedColumns.has(column);
  }

  /**
   * Filtre un objet pour ne garder que les colonnes autorisees.
   * Les cles inconnues sont silencieusement ignorees.
   */
  _sanitizeData(data) {
    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      if (this._isValidColumn(key)) {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  /**
   * Valide et retourne une colonne ORDER BY sure.
   */
  _safeOrderBy(orderBy, defaultColumn = 'created_at') {
    if (typeof orderBy === 'string' && this.allowedOrderColumns.has(orderBy)) {
      return orderBy;
    }
    return defaultColumn;
  }

  /**
   * Valide et retourne une direction ORDER sure.
   */
  _safeOrder(order) {
    return (typeof order === 'string' && order.toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
  }

  async getAll(options = {}) {
    const { orderBy, order, limit, offset } = options;
    const safeOrderBy = this._safeOrderBy(orderBy);
    const safeOrder = this._safeOrder(order);

    let sql = `SELECT * FROM ${this.tableName} ORDER BY ${safeOrderBy} ${safeOrder}`;
    const args = [];

    if (limit !== undefined && limit !== null) {
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 200);
      sql += ' LIMIT ?';
      args.push(safeLimit);
    }

    if (offset !== undefined && offset !== null) {
      const safeOffset = Math.max(parseInt(offset, 10) || 0, 0);
      sql += ' OFFSET ?';
      args.push(safeOffset);
    }

    const result = await db.execute({ sql, args });
    return result.rows;
  }

  async getById(id) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) {
      return null;
    }

    const result = await db.execute({
      sql: `SELECT * FROM ${this.tableName} WHERE id = ?`,
      args: [safeId],
    });
    return result.rows[0] || null;
  }

  async getBySlug(slug) {
    if (typeof slug !== 'string' || slug.length === 0 || slug.length > 500) {
      return null;
    }

    const result = await db.execute({
      sql: `SELECT * FROM ${this.tableName} WHERE slug = ?`,
      args: [slug],
    });
    return result.rows[0] || null;
  }

  async create(data) {
    const sanitized = this._sanitizeData(data);
    const columns = Object.keys(sanitized);

    if (columns.length === 0) {
      throw new Error('Aucune colonne valide fournie pour l\'insertion');
    }

    const placeholders = columns.map(() => '?').join(', ');
    // Convertir undefined en null pour eviter les problemes libsql
    const values = Object.values(sanitized).map(v => v === undefined ? null : v);

    const result = await db.execute({
      sql: `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
      args: values,
    });

    return { id: Number(result.lastInsertRowid), ...sanitized };
  }

  /**
   * Cree un enregistrement et retourne son ID via RETURNING.
   * Methode generique utilisee par ProjetsRepository et AnnoncesRepository.
   */
  async createWithReturning(data) {
    const columns = Object.keys(data);

    if (columns.length === 0) {
      throw new Error('Aucune colonne fournie pour l\'insertion');
    }

    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data).map(v => v === undefined ? null : v);

    const result = await db.execute({
      sql: `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders}) RETURNING id`,
      args: values,
    });

    return result.rows[0]?.id || Number(result.lastInsertRowid);
  }

  async update(id, data) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) {
      throw new Error('ID invalide pour la mise a jour');
    }

    const sanitized = this._sanitizeData(data);
    const columns = Object.keys(sanitized);

    if (columns.length === 0) {
      throw new Error('Aucune colonne valide fournie pour la mise a jour');
    }

    const sets = columns.map(key => `${key} = ?`).join(', ');
    // Convertir undefined en null
    const values = [...Object.values(sanitized).map(v => v === undefined ? null : v), safeId];

    await db.execute({
      sql: `UPDATE ${this.tableName} SET ${sets} WHERE id = ?`,
      args: values,
    });

    return this.getById(safeId);
  }

  async delete(id) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) {
      throw new Error('ID invalide pour la suppression');
    }

    await db.execute({
      sql: `DELETE FROM ${this.tableName} WHERE id = ?`,
      args: [safeId],
    });
    return true;
  }

  async count(where = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const args = [];

    const sanitizedWhere = this._sanitizeData(where);
    const conditions = Object.entries(sanitizedWhere);

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.map(([key]) => `${key} = ?`).join(' AND ');
      args.push(...conditions.map(([, val]) => val === undefined ? null : val));
    }

    const result = await db.execute({ sql, args });
    return result.rows[0]?.count || 0;
  }

  /**
   * Incremente un compteur de vue (fire & forget)
   */
  async incrementViewCount(id) {
    const safeId = parseInt(id, 10);
    if (isNaN(safeId) || safeId < 1) return;

    db.execute({
      sql: `UPDATE ${this.tableName} SET vue_count = vue_count + 1 WHERE id = ?`,
      args: [safeId],
    }).catch((err) => console.error(`Erreur update vue_count ${this.tableName}`, err));
  }

  /**
   * Recupere tous les slugs existants, optionnellement en excluant un ID
   */
  async getAllSlugs(excludeId = null) {
    let sql = `SELECT slug FROM ${this.tableName}`;
    const args = [];

    if (excludeId !== null && excludeId !== undefined) {
      const safeId = parseInt(excludeId, 10);
      if (!isNaN(safeId) && safeId >= 1) {
        sql += ' WHERE id != ?';
        args.push(safeId);
      }
    }

    const result = await db.execute({ sql, args });
    return result.rows.map((row) => row.slug);
  }

  /**
   * Verifie si un slug existe deja, optionnellement en excluant un ID.
   * Methode generique pour eviter la duplication entre repositories.
   */
  async slugExists(slug, excludeId = null) {
    let sql = `SELECT id FROM ${this.tableName} WHERE slug = ?`;
    const args = [slug];
    if (excludeId) {
      sql += ' AND id != ?';
      args.push(excludeId);
    }
    const result = await db.execute({ sql, args });
    return result.rows.length > 0;
  }

  /**
   * Recupere les enregistrements avec filtres dynamiques.
   * Les sous-classes peuvent surcharger pour ajouter des filtres specifiques.
   *
   * @param {Object} filters - Paires colonne/valeur pour le WHERE
   * @param {Object} options - orderBy, order, limit, offset
   */
  async getFiltered(filters = {}, options = {}) {
    const { orderBy, order, limit, offset } = options;

    let sql = `SELECT * FROM ${this.tableName} WHERE 1=1`;
    const args = [];

    // Appliquer les filtres dynamiques (uniquement les colonnes autorisees)
    for (const [column, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null && this._isValidColumn(column)) {
        sql += ` AND ${column} = ?`;
        args.push(value);
      }
    }

    const safeOrderBy = this._safeOrderBy(orderBy);
    const safeOrder = this._safeOrder(order);
    sql += ` ORDER BY ${safeOrderBy} ${safeOrder}`;

    if (limit !== undefined) {
      sql += ' LIMIT ?';
      args.push(limit);
    }

    if (offset !== undefined) {
      sql += ' OFFSET ?';
      args.push(offset);
    }

    const result = await db.execute({ sql, args });
    return result.rows;
  }
}

module.exports = BaseRepository;
