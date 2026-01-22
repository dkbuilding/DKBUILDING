const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/adminController');
const { createBackup, listBackups, deleteBackup, cleanOldBackups } = require('../utils/backup');
const JWTAuthMiddleware = require('../middleware/jwtAuth');

const jwtAuth = new JWTAuthMiddleware();

// Toutes les routes admin nécessitent une authentification
router.use(jwtAuth.authenticateToken.bind(jwtAuth));

router.get('/stats', AdminController.getStats);
router.get('/logs', AdminController.getLogs);

// Routes de sauvegarde
router.post('/backup', async (req, res) => {
  try {
    const backup = await createBackup();
    res.json({
      success: true,
      data: backup,
      message: 'Sauvegarde créée avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la création de la sauvegarde',
      message: error.message
    });
  }
});

router.get('/backup/list', (req, res) => {
  try {
    const backups = listBackups();
    res.json({
      success: true,
      data: backups,
      count: backups.length
    });
  } catch (error) {
    console.error('Erreur lors de la liste des sauvegardes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la liste des sauvegardes',
      message: error.message
    });
  }
});

router.delete('/backup/:filename', (req, res) => {
  try {
    const { filename } = req.params;
    const result = deleteBackup(filename);
    res.json({
      success: true,
      message: result.message
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de la sauvegarde:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors de la suppression de la sauvegarde',
      message: error.message
    });
  }
});

router.post('/backup/clean', (req, res) => {
  try {
    const { keepCount = 10 } = req.body;
    const result = cleanOldBackups(keepCount);
    res.json({
      success: true,
      message: result.message,
      deleted: result.deleted
    });
  } catch (error) {
    console.error('Erreur lors du nettoyage des sauvegardes:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur lors du nettoyage des sauvegardes',
      message: error.message
    });
  }
});

module.exports = router;
