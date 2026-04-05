const db = require('../database/db');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

/**
 * Initialise la base de données en exécutant les migrations non appliquées (Turso async)
 *
 * Améliorations :
 * - Table _migrations pour tracker les migrations appliquées
 * - Calcul de checksum pour détecter les modifications
 * - Exécution uniquement des migrations non encore appliquées
 */

/**
 * Crée la table de suivi des migrations si elle n'existe pas
 */
async function ensureMigrationsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      checksum TEXT
    )
  `);
}

/**
 * Récupère les migrations déjà appliquées
 */
async function getAppliedMigrations() {
  try {
    const result = await db.execute("SELECT filename, checksum FROM _migrations");
    return new Map(result.rows.map(row => [row.filename, row.checksum]));
  } catch {
    return new Map();
  }
}

/**
 * Calcule le SHA-256 d'un contenu
 */
function checksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex').substring(0, 16);
}

/**
 * Découpe un fichier SQL en statements individuels
 * Gère correctement les commentaires et les lignes vides
 */
function splitStatements(sql) {
  return sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'));
}

/**
 * Initialise la base de données en exécutant toutes les migrations non appliquées
 */
async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');

    // Créer la table de suivi si nécessaire
    await ensureMigrationsTable();
    const applied = await getAppliedMigrations();

    const migrationsDir = path.join(__dirname, '../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    let appliedCount = 0;
    let skippedCount = 0;

    for (const file of migrationFiles) {
      if (applied.has(file)) {
        skippedCount++;
        continue;
      }

      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      const hash = checksum(sql);

      console.log(`  📄 Exécution de ${file}...`);

      const statements = splitStatements(sql);

      for (const statement of statements) {
        try {
          await db.execute(statement);
        } catch (error) {
          // Ignorer les erreurs "already exists" pour les CREATE IF NOT EXISTS
          if (!error.message.includes('already exists')) {
            console.error(`    ⚠️ Erreur dans ${file}: ${error.message}`);
          }
        }
      }

      // Enregistrer la migration comme appliquée
      await db.execute({
        sql: "INSERT OR IGNORE INTO _migrations (filename, checksum) VALUES (?, ?)",
        args: [file, hash],
      });

      appliedCount++;
      console.log(`  ✅ ${file} appliquée`);
    }

    console.log(`✅ Migrations: ${appliedCount} appliquée(s), ${skippedCount} déjà en place`);
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

/**
 * Vérifie si la base de données est initialisée (Turso async)
 */
async function isDatabaseInitialized() {
  try {
    const result = await db.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('annonces', 'projets', 'admin_users', 'logs')"
    );
    return result.rows.length === 4;
  } catch (error) {
    return false;
  }
}

module.exports = {
  initDatabase,
  isDatabaseInitialized
};
