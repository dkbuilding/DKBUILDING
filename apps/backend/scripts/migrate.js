#!/usr/bin/env node

require("dotenv").config();
const { initDatabase } = require('../utils/dbInit');

async function main() {
  console.log('🔄 Exécution des migrations...');

  try {
    await initDatabase();
    console.log('✅ Migrations exécutées avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors des migrations:', error.message);
    process.exit(1);
  }
}

main();
