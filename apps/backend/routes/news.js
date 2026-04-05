const express = require('express');
const router = express.Router();
const AnnoncesRepository = require('../repositories/AnnoncesRepository');
const parseJSON = require('../utils/parseJSON');

const annoncesRepo = new AnnoncesRepository();

/**
 * Formater une annonce Turso en article de news pour le frontend
 */
function formatAnnonceAsNews(annonce) {
  const images = parseJSON(annonce.images);

  const excerpt = annonce.description
    || (annonce.contenu ? annonce.contenu.substring(0, 150) + '...' : '');

  return {
    id: annonce.id,
    title: annonce.titre,
    excerpt,
    content: annonce.contenu || annonce.description || '',
    date: annonce.date_publication || annonce.created_at,
    category: annonce.categorie || 'Actualité',
    readTime: '3 min',
    image: images.length > 0 ? `/api/media/${images[0]}` : null,
    featured: false,
    isPublished: true,
    createdAt: annonce.created_at,
    updatedAt: annonce.updated_at,
  };
}

// GET /api/news - Récupérer toutes les actualités publiées (avec pagination)
router.get('/news', async (req, res) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 50);
    const offset = Math.max(parseInt(req.query.offset) || 0, 0);

    const rows = await annoncesRepo.getPublic({ limit, offset });
    const news = rows.map(formatAnnonceAsNews);

    res.status(200).json({
      success: true,
      data: news,
      count: news.length,
    });
  } catch (error) {
    console.error('Erreur récupération actualités:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des actualités',
    });
  }
});

// GET /api/news/:id - Récupérer un article spécifique
router.get('/news/:id', async (req, res) => {
  try {
    const articleId = parseInt(req.params.id);

    if (isNaN(articleId) || articleId < 1) {
      return res.status(400).json({
        success: false,
        error: 'ID d\'article invalide',
      });
    }

    const annonce = await annoncesRepo.getById(articleId);

    if (!annonce || (annonce.statut !== 'publie' && annonce.statut !== 'publié')) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
        message: `L'article avec l'ID ${articleId} n'existe pas ou n'est pas publié`,
      });
    }

    // Incrémenter le compteur de vues (fire & forget)
    annoncesRepo.incrementViewCount(articleId);

    res.status(200).json({
      success: true,
      data: formatAnnonceAsNews(annonce),
    });
  } catch (error) {
    console.error('Erreur récupération article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'article',
    });
  }
});

module.exports = router;
