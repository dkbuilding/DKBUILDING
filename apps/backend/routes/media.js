const express = require("express");
const router = express.Router();
const MediaController = require("../controllers/mediaController");
const JWTAuthMiddleware = require("../middleware/jwtAuth");
const { upload, handleUploadError } = require("../middleware/upload");

const jwtAuth = new JWTAuthMiddleware();

/**
 * Routes Media - Version Cloudinary
 * Architecture GovTech Zero-Cost pour DK BUILDING
 */

// Route publique pour servir les fichiers (redirect vers Cloudinary)
router.get("/:filename", MediaController.serve);

// Routes protégées (avec authentification JWT)
router.get("/", jwtAuth.authenticateToken.bind(jwtAuth), MediaController.list);

router.post(
  "/upload",
  jwtAuth.authenticateToken.bind(jwtAuth),
  upload.single("file"), // Cloudinary upload
  handleUploadError,
  (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "Aucun fichier uploadé",
        });
      }

      // Cloudinary met les infos dans req.file
      // path = URL Cloudinary complète
      // filename = public_id
      res.json({
        success: true,
        data: {
          filename: req.file.filename || req.file.public_id, // Public ID Cloudinary
          url: req.file.path, // URL complète Cloudinary
          originalName: req.file.originalname,
          size: req.file.size || req.file.bytes,
          mimetype: req.file.mimetype || req.file.format,
        },
        message: "Fichier uploadé avec succès sur Cloudinary",
      });
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      res.status(500).json({
        success: false,
        error: "Erreur lors de l'upload",
        message: error.message,
      });
    }
  },
);

router.delete(
  "/:filename",
  jwtAuth.authenticateToken.bind(jwtAuth),
  MediaController.delete,
);

module.exports = router;
