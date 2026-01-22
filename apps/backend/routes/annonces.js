const express = require('express');
const router = express.Router();
const AnnoncesController = require('../controllers/annoncesController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');
const { uploadFields, handleUploadError } = require('../middleware/upload');

const jwtAuth = new JWTAuthMiddleware();

// Routes publiques (sans authentification)
router.get('/public', AnnoncesController.getPublic);
router.get('/slug/:slug', AnnoncesController.getBySlug);

// Routes protégées (avec authentification JWT)
router.get('/', jwtAuth.authenticateToken.bind(jwtAuth), AnnoncesController.getAll);
router.get('/:id', jwtAuth.authenticateToken.bind(jwtAuth), AnnoncesController.getById);

router.post(
  '/',
  jwtAuth.authenticateToken.bind(jwtAuth),
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
  ]),
  handleUploadError,
  AnnoncesController.create
);

router.put(
  '/:id',
  jwtAuth.authenticateToken.bind(jwtAuth),
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 }
  ]),
  handleUploadError,
  AnnoncesController.update
);

router.delete('/:id', jwtAuth.authenticateToken.bind(jwtAuth), AnnoncesController.delete);

module.exports = router;

