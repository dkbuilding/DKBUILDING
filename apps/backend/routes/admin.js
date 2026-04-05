const express = require("express");
const router = express.Router();
const AdminController = require("../controllers/adminController");
const { createBackup, listBackups, deleteBackup, cleanOldBackups } = require("../utils/backup");
const {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendInternalError,
} = require("../utils/apiResponse");

// Note: L'authentification JWT et la vérification du rôle admin
// sont déjà gérées par adminGuard dans server.js

// GET /api/admin/stats
router.get("/stats", AdminController.getStats);

// GET /api/admin/logs
router.get("/logs", AdminController.getLogs);

// ─── Sauvegardes ────────────────────────────────

// POST /api/admin/backups — Créer une sauvegarde
router.post("/backups", async (req, res) => {
  try {
    const backup = await createBackup();
    return sendCreated(res, backup, "Sauvegarde créée avec succès");
  } catch (error) {
    console.error("Erreur lors de la création de la sauvegarde:", error);
    return sendInternalError(res, "Erreur lors de la création de la sauvegarde");
  }
});

// GET /api/admin/backups — Lister les sauvegardes
router.get("/backups", (req, res) => {
  try {
    const backups = listBackups();
    return sendSuccess(res, backups, {
      meta: { count: backups.length },
    });
  } catch (error) {
    console.error("Erreur lors de la liste des sauvegardes:", error);
    return sendInternalError(res, "Erreur lors de la liste des sauvegardes");
  }
});

// DELETE /api/admin/backups/:filename — Supprimer une sauvegarde
router.delete("/backups/:filename", (req, res) => {
  try {
    const { filename } = req.params;
    deleteBackup(filename);
    return sendNoContent(res);
  } catch (error) {
    console.error("Erreur lors de la suppression de la sauvegarde:", error);
    return sendInternalError(res, "Erreur lors de la suppression de la sauvegarde");
  }
});

// DELETE /api/admin/backups/old — Nettoyage des anciennes sauvegardes
// Note : doit être déclaré AVANT /:filename pour éviter le conflit
// On le met en POST car c'est une action avec side effects et un body
router.post("/backups/cleanup", (req, res) => {
  try {
    const { keepCount = 10 } = req.body;
    const result = cleanOldBackups(keepCount);
    return sendSuccess(res, {
      deleted: result.deleted,
    }, { message: result.message });
  } catch (error) {
    console.error("Erreur lors du nettoyage des sauvegardes:", error);
    return sendInternalError(res, "Erreur lors du nettoyage des sauvegardes");
  }
});

module.exports = router;
