const express = require("express");
const router = express.Router();
const MediaController = require("../controllers/mediaController");
const { jwtAuth } = require("../middleware/jwtAuth");
const { upload, handleUploadError } = require("../middleware/upload");
const { uploadLimiter } = require("../middleware/rateLimiter");
const {
  sendSuccess,
  sendCreated,
  sendBadRequest,
  sendInternalError,
} = require("../utils/apiResponse");

/**
 * Routes Media — Version Cloudinary
 *
 * IMPORTANT : L'ordre des routes est critique.
 * Les routes statiques (/, /serve/:filename) doivent être déclarées
 * AVANT les routes avec paramètres (/:filename) pour éviter les conflits.
 */

// GET /api/media — Lister tous les médias (protégé)
router.get("/", jwtAuth.authenticateToken.bind(jwtAuth), MediaController.list);

// POST /api/media — Upload d'un fichier (protégé, rate limited)
// Note : était POST /upload, corrigé pour supprimer le verbe de l'URL
router.post(
  "/",
  jwtAuth.authenticateToken.bind(jwtAuth),
  uploadLimiter,
  upload.single("file"),
  handleUploadError,
  (req, res) => {
    try {
      if (!req.file) {
        return sendBadRequest(res, "Aucun fichier uploadé");
      }

      return sendCreated(
        res,
        {
          filename: req.file.filename || req.file.public_id,
          url: req.file.path,
          originalName: req.file.originalname,
          size: req.file.size || req.file.bytes,
          mimetype: req.file.mimetype || req.file.format,
        },
        "Fichier uploadé avec succès sur Cloudinary",
      );
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      return sendInternalError(res, "Erreur lors de l'upload");
    }
  },
);

// GET /api/media/serve/:filename — Servir un fichier (redirect Cloudinary, public)
router.get("/serve/:filename", MediaController.serve);

// DELETE /api/media/:filename — Supprimer un fichier (protégé)
router.delete(
  "/:filename",
  jwtAuth.authenticateToken.bind(jwtAuth),
  MediaController.delete,
);

module.exports = router;
