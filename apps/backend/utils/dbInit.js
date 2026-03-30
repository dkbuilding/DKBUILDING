const db = require('../database/db');
const fs = require('fs');
const path = require('path');

/**
 * Initialise la base de données en exécutant toutes les migrations (Turso async)
 */
async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données...');

    const migrationsDir = path.join(__dirname, '../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      console.log(`  📄 Exécution de ${file}...`);
      // Turso/libsql execute() ne supporte qu'une requête à la fois
      // Découper le SQL en statements individuels
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

      for (const statement of statements) {
        await db.execute(statement);
      }
    }

    console.log('✅ Base de données initialisée avec succès');
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
