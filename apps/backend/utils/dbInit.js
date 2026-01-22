const db = require('../database/db');
const fs = require('fs');
const path = require('path');

/**
 * Initialise la base de données en exécutant toutes les migrations
 */
function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données SQLite...');

    // Lire et exécuter les migrations dans l'ordre
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');
      
      console.log(`  📄 Exécution de ${file}...`);
      db.exec(sql);
    }

    console.log('✅ Base de données initialisée avec succès');
    return true;
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  }
}

/**
 * Vérifie si la base de données est initialisée
 */
function isDatabaseInitialized() {
  try {
    const result = db.prepare(`
      SELECT name FROM sqlite_master 
      WHERE type='table' AND name IN ('annonces', 'projets', 'admin_users', 'logs')
    `).all();
    
    return result.length === 4;
  } catch (error) {
    return false;
  }
}

module.exports = {
  initDatabase,
  isDatabaseInitialized
};

