const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

/**
 * Upload Middleware - Cloudinary Storage
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * Remplace le stockage local par Cloudinary
 */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "dkbuilding", // Dossier dans Cloudinary
    allowed_formats: [
      "jpg",
      "jpeg",
      "png",
      "webp",
      "pdf",
      "doc",
      "docx",
      "mp4",
      "mov",
    ],
    resource_type: "auto", // Auto-détection (image/video/raw)
    transformation: [
      // Optimisation automatique des images
      { quality: "auto", fetch_format: "auto" },
    ],
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },
});

// Helper pour gérer les erreurs d'upload
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "Fichier trop volumineux",
        message: "La taille maximale autorisée est de 50MB",
      });
    }
    return res.status(400).json({
      success: false,
      error: "Erreur d'upload",
      message: err.message,
    });
  }

  if (err) {
    return res.status(500).json({
      success: false,
      error: "Erreur serveur lors de l'upload",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }

  next();
};

// Helper pour les champs multiples
const uploadFields = (fields) => upload.fields(fields);

// Export du client Cloudinary pour les opérations avancées
module.exports = {
  upload,
  uploadFields,
  handleUploadError,
  cloudinary, // Pour les suppressions et transformations
};
