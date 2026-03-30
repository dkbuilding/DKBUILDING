const express = require('express');
const router = express.Router();
const db = require('../database/db');

/**
 * Formater une annonce Turso en article de news pour le frontend
 */
function formatAnnonceAsNews(annonce) {
  let images = [];
  try {
    images = annonce.images ? JSON.parse(annonce.images) : [];
  } catch (e) {
    // Images non parsables, on ignore
  }

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

// GET /api/news - Récupérer toutes les actualités publiées
router.get('/news', async (req, res) => {
  try {
    const result = await db.execute({
      sql: "SELECT * FROM annonces WHERE statut = 'publie' OR statut = 'publié' ORDER BY date_publication DESC",
      args: [],
    });

    const news = result.rows.map(formatAnnonceAsNews);

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

    if (isNaN(articleId)) {
      return res.status(400).json({
        success: false,
        error: 'ID d\'article invalide',
      });
    }

    const result = await db.execute({
      sql: "SELECT * FROM annonces WHERE id = ? AND (statut = 'publie' OR statut = 'publié')",
      args: [articleId],
    });

    if (!result.rows.length) {
      return res.status(404).json({
        success: false,
        error: 'Article non trouvé',
        message: `L'article avec l'ID ${articleId} n'existe pas ou n'est pas publié`,
      });
    }

    res.status(200).json({
      success: true,
      data: formatAnnonceAsNews(result.rows[0]),
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
