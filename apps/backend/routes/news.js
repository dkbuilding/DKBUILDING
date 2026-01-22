const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Données d'actualités statiques (fallback si la base de données est vide)
const staticNewsData = [
  {
    id: 1,
    title: "Nouvelle réglementation thermique 2024",
    excerpt: "Découvrez les nouvelles normes de construction et leurs impacts sur vos projets de charpente métallique.",
    content: "La réglementation thermique 2024 introduit de nouvelles exigences en matière d'isolation et de performance énergétique. DK BUILDING s'adapte à ces changements pour vous proposer des solutions conformes et optimisées.",
    date: new Date().toISOString().split('T')[0], // Date du jour
    category: "Réglementation",
    readTime: "3 min",
    image: null,
    featured: true,
    isPublished: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Innovation : Charpentes modulaires préfabriquées",
    excerpt: "Nous développons une nouvelle gamme de charpentes modulaires pour réduire les délais de construction.",
    content: "Nos équipes travaillent sur le développement de charpentes modulaires préfabriquées qui permettront de réduire significativement les délais de construction tout en maintenant notre niveau de qualité.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Il y a 5 jours
    category: "Innovation",
    readTime: "4 min",
    image: null,
    featured: false,
    isPublished: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    title: "Certification ISO 9001 renouvelée",
    excerpt: "DK BUILDING renouvelle sa certification ISO 9001, garantissant notre engagement qualité.",
    content: "Nous sommes fiers d'annoncer le renouvellement de notre certification ISO 9001, qui témoigne de notre engagement constant en faveur de la qualité et de l'amélioration continue.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Il y a 10 jours
    category: "Certification",
    readTime: "2 min",
    image: null,
    featured: false,
    isPublished: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// GET /api/news - Récupérer toutes les actualités publiées
router.get('/news', (req, res) => {
  try {
    // Essayer d'abord de récupérer depuis la base de données SQLite
    try {
      const stmt = db.prepare("SELECT * FROM annonces WHERE statut = 'publie' OR statut = 'publié' ORDER BY date_publication DESC");
      const dbNews = stmt.all();

      // Si on a des annonces en base, les convertir au format attendu
      if (dbNews && dbNews.length > 0) {
        const formattedNews = dbNews.map(annonce => {
          let images = [];
          try {
            images = annonce.images ? JSON.parse(annonce.images) : [];
          } catch (e) {
            console.error('Erreur parsing images:', e);
          }

          const excerpt = annonce.description || (annonce.contenu ? annonce.contenu.substring(0, 150) + '...' : '');
          
          return {
            id: annonce.id,
            title: annonce.titre,
            excerpt: excerpt,
            content: annonce.contenu || annonce.description || '',
            date: annonce.date_publication || annonce.created_at || new Date().toISOString().split('T')[0],
            category: annonce.categorie || 'Actualité',
            readTime: '3 min',
            image: null, // Images désactivées - utilisation de placeholders uniquement
            featured: false,
            isPublished: true,
            createdAt: annonce.created_at,
            updatedAt: annonce.updated_at
          };
        });

        return res.status(200).json({
          success: true,
          data: formattedNews,
          count: formattedNews.length,
          message: 'Actualités récupérées avec succès depuis la base de données'
        });
      }
    } catch (dbError) {
      console.error('Erreur lors de la récupération depuis la DB:', dbError);
      // Si la table n'existe pas encore, utiliser les données statiques
    }

    // Si pas d'annonces en base, utiliser les données statiques
    sendStaticNews(res);
  } catch (error) {
    console.error('Erreur lors de la récupération des actualités:', error);
    sendStaticNews(res);
  }
});

// Fonction helper pour envoyer les données statiques
function sendStaticNews(res) {
  try {
    const publishedNews = staticNewsData.filter(article => article.isPublished);
    const sortedNews = publishedNews.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    res.status(200).json({
      success: true,
      data: sortedNews,
      count: sortedNews.length,
      message: 'Actualités récupérées avec succès (données statiques)'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération des actualités',
      message: error.message
    });
  }
}

// GET /api/news/:id - Récupérer un article spécifique
router.get('/news/:id', (req, res) => {
  try {
    const articleId = parseInt(req.params.id);

    // Essayer d'abord depuis la base de données
    try {
      const stmt = db.prepare("SELECT * FROM annonces WHERE id = ? AND (statut = 'publie' OR statut = 'publié')");
      const dbArticle = stmt.get(articleId);

      if (dbArticle) {
        let images = [];
        try {
          images = dbArticle.images ? JSON.parse(dbArticle.images) : [];
        } catch (e) {
          console.error('Erreur parsing images:', e);
        }

        const excerpt = dbArticle.description || (dbArticle.contenu ? dbArticle.contenu.substring(0, 150) + '...' : '');
        
        const article = {
          id: dbArticle.id,
          title: dbArticle.titre,
          excerpt: excerpt,
          content: dbArticle.contenu || dbArticle.description || '',
          date: dbArticle.date_publication || dbArticle.created_at || new Date().toISOString().split('T')[0],
          category: dbArticle.categorie || 'Actualité',
          readTime: '3 min',
          image: images.length > 0 ? `/api/media/${images[0]}` : null,
          featured: false,
          isPublished: true,
          createdAt: dbArticle.created_at,
          updatedAt: dbArticle.updated_at
        };

        return res.status(200).json({
          success: true,
          data: article,
          message: 'Article récupéré avec succès'
        });
      }
    } catch (dbError) {
      console.error('Erreur DB:', dbError);
      // Si erreur DB, chercher dans les données statiques
    }

    // Si pas trouvé en DB, chercher dans les données statiques
    findStaticArticle(res, articleId);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    res.status(500).json({
      success: false,
      error: 'Erreur serveur lors de la récupération de l\'article',
      message: error.message
    });
  }
});

// Fonction helper pour trouver un article statique
function findStaticArticle(res, articleId) {
  const article = staticNewsData.find(a => a.id === articleId && a.isPublished);

  if (!article) {
    return res.status(404).json({
      success: false,
      error: 'Article non trouvé',
      message: `L'article avec l'ID ${articleId} n'existe pas ou n'est pas publié`
    });
  }

  res.status(200).json({
    success: true,
    data: article,
    message: 'Article récupéré avec succès'
  });
}

module.exports = router;

