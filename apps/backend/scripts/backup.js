#!/usr/bin/env node

const { createBackup, listBackups, cleanOldBackups } = require('../utils/backup');

async function main() {
  const command = process.argv[2];

  try {
    switch (command) {
      case 'create':
        console.log('🔄 Création de la sauvegarde...');
        const backup = await createBackup();
        console.log(`✅ Sauvegarde créée: ${backup.filename} (${backup.sizeFormatted})`);
        break;

      case 'list':
        console.log('📋 Liste des sauvegardes:');
        const backups = listBackups();
        if (backups.length === 0) {
          console.log('  Aucune sauvegarde trouvée');
        } else {
          backups.forEach((backup, index) => {
            console.log(`  ${index + 1}. ${backup.filename}`);
            console.log(`     Taille: ${backup.sizeFormatted}`);
            console.log(`     Créée: ${new Date(backup.created).toLocaleString('fr-FR')}`);
          });
        }
        break;

      case 'clean':
        console.log('🧹 Nettoyage des anciennes sauvegardes...');
        const keepCount = parseInt(process.argv[3]) || 10;
        const result = cleanOldBackups(keepCount);
        console.log(`✅ ${result.message}`);
        break;

      default:
        console.log('Usage: node backup.js [create|list|clean]');
        console.log('');
        console.log('Commandes:');
        console.log('  create        Créer une nouvelle sauvegarde');
        console.log('  list          Lister toutes les sauvegardes');
        console.log('  clean [N]    Nettoyer les anciennes sauvegardes (garder les N plus récentes, défaut: 10)');
        process.exit(1);
    }
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

main();

