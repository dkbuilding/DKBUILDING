const express = require('express');
const router = express.Router();
const ProjetsController = require('../controllers/projetsController');
const JWTAuthMiddleware = require('../middleware/jwtAuth');
const { uploadFields, handleUploadError } = require('../middleware/upload');

const jwtAuth = new JWTAuthMiddleware();

// Routes publiques (sans authentification)
router.get('/public', ProjetsController.getPublic);
router.get('/featured', ProjetsController.getFeatured);
router.get('/slug/:slug', ProjetsController.getBySlug);

// Routes protégées (avec authentification JWT)
router.get('/', jwtAuth.authenticateToken.bind(jwtAuth), ProjetsController.getAll);
router.get('/:id', jwtAuth.authenticateToken.bind(jwtAuth), ProjetsController.getById);

router.post(
  '/',
  jwtAuth.authenticateToken.bind(jwtAuth),
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]),
  handleUploadError,
  ProjetsController.create
);

router.put(
  '/:id',
  jwtAuth.authenticateToken.bind(jwtAuth),
  uploadFields([
    { name: 'images', maxCount: 10 },
    { name: 'documents', maxCount: 10 },
    { name: 'videos', maxCount: 5 }
  ]),
  handleUploadError,
  ProjetsController.update
);

router.delete('/:id', jwtAuth.authenticateToken.bind(jwtAuth), ProjetsController.delete);

module.exports = router;

