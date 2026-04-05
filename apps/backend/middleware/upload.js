const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

/**
 * Upload Middleware - Cloudinary Storage
 * Architecture GovTech Zero-Cost pour DK BUILDING
 *
 * SÉCURITÉ :
 * - Validation MIME type via fileFilter (pas seulement l'extension)
 * - Taille maximale 50MB
 * - Formats autorisés explicitement listés
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

/**
 * MIME types autorisés — sécurité supplémentaire par rapport aux extensions seules.
 * Un attaquant peut renommer un fichier .exe en .jpg, mais le MIME type
 * du buffer sera détecté correctement par multer.
 */
const ALLOWED_MIME_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/webp',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Vidéos
  'video/mp4',
  'video/quicktime',
]);

/**
 * Filtre les fichiers par MIME type réel.
 * Rejette tout fichier dont le MIME type n'est pas dans la whitelist.
 */
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new multer.MulterError(
      'LIMIT_UNEXPECTED_FILE',
      `Type de fichier non autorisé: ${file.mimetype}. Types acceptés: images (jpg, png, webp), documents (pdf, doc, docx), vidéos (mp4, mov).`
    ));
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
    files: 15, // Maximum 15 fichiers par requête
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
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Trop de fichiers",
        message: "Maximum 15 fichiers par requête",
      });
    }
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        error: "Type de fichier non autorisé",
        message: err.field || err.message,
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
