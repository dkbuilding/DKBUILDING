const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

/**
 * Créer une sauvegarde complète (base de données + storage)
 */
function createBackup() {
  return new Promise((resolve, reject) => {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupDir = path.join(__dirname, '../../_backup');
      const backupFileName = `dkbuilding-backup-${timestamp}.zip`;
      const backupPath = path.join(backupDir, backupFileName);

      // Créer le dossier de backup s'il n'existe pas
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      // Créer l'archive ZIP
      const output = fs.createWriteStream(backupPath);
      const archive = archiver('zip', {
        zlib: { level: 9 } // Compression maximale
      });

      output.on('close', () => {
        const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
        console.log(`✅ Sauvegarde créée: ${backupFileName} (${sizeMB} MB)`);
        resolve({
          success: true,
          filename: backupFileName,
          path: backupPath,
          size: archive.pointer(),
          sizeFormatted: `${sizeMB} MB`
        });
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);

      // Ajouter la base de données
      const dbPath = path.join(__dirname, '../../data/dkbuilding.db');
      if (fs.existsSync(dbPath)) {
        archive.file(dbPath, { name: 'dkbuilding.db' });
      }

      // Ajouter le dossier storage
      const storagePath = path.join(__dirname, '../storage');
      if (fs.existsSync(storagePath)) {
        archive.directory(storagePath, 'storage');
      }

      archive.finalize();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Lister les sauvegardes disponibles
 */
function listBackups() {
  try {
    const backupDir = path.join(__dirname, '../../_backup');
    
    if (!fs.existsSync(backupDir)) {
      return [];
    }

    const files = fs.readdirSync(backupDir)
      .filter(file => file.endsWith('.zip') && file.startsWith('dkbuilding-backup-'))
      .map(file => {
        const filePath = path.join(backupDir, file);
        const stat = fs.statSync(filePath);
        return {
          filename: file,
          path: filePath,
          size: stat.size,
          sizeFormatted: formatFileSize(stat.size),
          created: stat.birthtime.toISOString(),
          modified: stat.mtime.toISOString()
        };
      })
      .sort((a, b) => new Date(b.created) - new Date(a.created)); // Plus récent en premier

    return files;
  } catch (error) {
    console.error('Erreur lors de la liste des sauvegardes:', error);
    return [];
  }
}

/**
 * Restaurer depuis une sauvegarde
 */
function restoreBackup(backupFilename) {
  return new Promise((resolve, reject) => {
    try {
      const backupDir = path.join(__dirname, '../../_backup');
      const backupPath = path.join(backupDir, backupFilename);

      if (!fs.existsSync(backupPath)) {
        return reject(new Error('Fichier de sauvegarde non trouvé'));
      }

      // TODO: Implémenter la restauration avec unzip
      // Pour l'instant, on retourne juste le chemin
      resolve({
        success: true,
        message: 'Restauration à implémenter',
        path: backupPath
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Supprimer une sauvegarde
 */
function deleteBackup(backupFilename) {
  try {
    const backupDir = path.join(__dirname, '../../_backup');
    const backupPath = path.join(backupDir, backupFilename);

    if (!fs.existsSync(backupPath)) {
      throw new Error('Fichier de sauvegarde non trouvé');
    }

    fs.unlinkSync(backupPath);
    return {
      success: true,
      message: 'Sauvegarde supprimée avec succès'
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Nettoyer les anciennes sauvegardes (garder les N plus récentes)
 */
function cleanOldBackups(keepCount = 10) {
  try {
    const backups = listBackups();
    
    if (backups.length <= keepCount) {
      return {
        success: true,
        message: 'Aucune sauvegarde à nettoyer',
        deleted: 0
      };
    }

    const toDelete = backups.slice(keepCount);
    let deletedCount = 0;

    toDelete.forEach(backup => {
      try {
        fs.unlinkSync(backup.path);
        deletedCount++;
      } catch (error) {
        console.error(`Erreur lors de la suppression de ${backup.filename}:`, error);
      }
    });

    return {
      success: true,
      message: `${deletedCount} sauvegarde(s) supprimée(s)`,
      deleted: deletedCount
    };
  } catch (error) {
    throw error;
  }
}

/**
 * Formater la taille d'un fichier
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

module.exports = {
  createBackup,
  listBackups,
  restoreBackup,
  deleteBackup,
  cleanOldBackups
};

