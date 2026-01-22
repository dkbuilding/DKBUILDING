#!/usr/bin/env node

const { initDatabase } = require('../utils/dbInit');

console.log('🔄 Exécution des migrations...');

try {
  initDatabase();
  console.log('✅ Migrations exécutées avec succès');
  process.exit(0);
} catch (error) {
  console.error('❌ Erreur lors des migrations:', error.message);
  process.exit(1);
}

