const db = require('../database/db');
const Logger = require('../utils/logger');

/**
 * BaseRepository - Couche d'accès aux données générique
 * Élimine la duplication SQL entre les controllers
 *
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async getAll(options = {}) {
    const { orderBy = 'created_at DESC', limit, offset } = options;
    let sql = `SELECT * FROM ${this.tableName} ORDER BY ${orderBy}`;
    const args = [];
    if (limit) { sql += ' LIMIT ?'; args.push(limit); }
    if (offset) { sql += ' OFFSET ?'; args.push(offset); }
    const result = await db.execute({ sql, args });
    return result.rows;
  }

  async getById(id) {
    const result = await db.execute({
      sql: `SELECT * FROM ${this.tableName} WHERE id = ?`,
      args: [id],
    });
    return result.rows[0] || null;
  }

  async getBySlug(slug) {
    const result = await db.execute({
      sql: `SELECT * FROM ${this.tableName} WHERE slug = ?`,
      args: [slug],
    });
    return result.rows[0] || null;
  }

  async create(data) {
    const columns = Object.keys(data);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data);
    const result = await db.execute({
      sql: `INSERT INTO ${this.tableName} (${columns.join(', ')}) VALUES (${placeholders})`,
      args: values,
    });
    return { id: Number(result.lastInsertRowid), ...data };
  }

  async update(id, data) {
    const sets = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), id];
    await db.execute({
      sql: `UPDATE ${this.tableName} SET ${sets} WHERE id = ?`,
      args: values,
    });
    return this.getById(id);
  }

  async delete(id) {
    await db.execute({
      sql: `DELETE FROM ${this.tableName} WHERE id = ?`,
      args: [id],
    });
    return true;
  }

  async count(where = {}) {
    let sql = `SELECT COUNT(*) as count FROM ${this.tableName}`;
    const args = [];
    const conditions = Object.entries(where);
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.map(([key]) => `${key} = ?`).join(' AND ');
      args.push(...conditions.map(([, val]) => val));
    }
    const result = await db.execute({ sql, args });
    return result.rows[0]?.count || 0;
  }

  /**
   * Incrémente un compteur de vue (fire & forget)
   */
  async incrementViewCount(id) {
    db.execute({
      sql: `UPDATE ${this.tableName} SET vue_count = vue_count + 1 WHERE id = ?`,
      args: [id],
    }).catch((err) => console.error(`Erreur update vue_count ${this.tableName}`, err));
  }

  /**
   * Récupère tous les slugs existants, optionnellement en excluant un ID
   */
  async getAllSlugs(excludeId = null) {
    let sql = `SELECT slug FROM ${this.tableName}`;
    const args = [];
    if (excludeId) {
      sql += ' WHERE id != ?';
      args.push(excludeId);
    }
    const result = await db.execute({ sql, args });
    return result.rows.map((row) => row.slug);
  }
}

module.exports = BaseRepository;
