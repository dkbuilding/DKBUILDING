/**
 * Index de recherche pour la page d'erreur DK BUILDING
 * Contient toutes les routes disponibles avec leurs mots-clés pour la recherche fuzzy
 */

export const searchIndex = [
  {
    title: 'Accueil',
    path: '/',
    keywords: ['home', 'accueil', 'principal', 'dk building', 'charpente', 'bardage', 'couverture', 'photovoltaïque', 'terrassement'], // 'climatisation' mis en pause
    description: 'Page d\'accueil DK BUILDING - Entreprise générale du bâtiment',
    icon: 'home'
  },
  {
    title: 'Services',
    path: '/#services',
    keywords: ['services', 'prestations', 'charpente', 'bardage', 'couverture', 'photovoltaïque', 'terrassement', 'construction', 'métallique', 'tarn'], // 'climatisation' mis en pause
    description: 'Nos services de charpente, bardage, couverture, photovoltaïque et terrassement', // climatisation mise en pause
    icon: 'wrench'
  },
  {
    title: 'Réalisations',
    path: '/#portfolio',
    keywords: ['projets', 'réalisations', 'portfolio', 'galerie', 'chantiers', 'travaux', 'exemples'],
    description: 'Découvrez nos réalisations et projets de construction',
    icon: 'briefcase'
  },
  {
    title: 'À propos',
    path: '/#about',
    keywords: ['about', 'équipe', 'entreprise', 'histoire', 'qui sommes nous', 'présentation'],
    description: 'Présentation de l\'entreprise DK BUILDING',
    icon: 'users'
  },
  {
    title: 'Contact',
    path: '/#contact',
    keywords: ['contact', 'devis', 'appel', 'téléphone', 'email', 'adresse', 'demande'],
    description: 'Contactez-nous pour vos projets de construction',
    icon: 'mail'
  },
  {
    title: 'Mentions légales',
    path: '/legal/mentions-legales',
    keywords: ['mentions', 'légales', 'legal', 'conditions', 'droits', 'propriété'],
    description: 'Mentions légales et conditions d\'utilisation',
    icon: 'file-text'
  },
  {
    title: 'Politique de confidentialité',
    path: '/legal/politique-confidentialite',
    keywords: ['politique', 'confidentialité', 'données', 'rgpd', 'protection', 'privacy'],
    description: 'Politique de confidentialité et protection des données personnelles',
    icon: 'shield'
  },
  {
    title: 'Conditions générales de vente',
    path: '/legal/cgv',
    keywords: ['cgv', 'conditions', 'vente', 'générales', 'commercial', 'contrat'],
    description: 'Conditions générales de vente DK BUILDING',
    icon: 'shield'
  }
];

/**
 * Pages les plus visitées (statiques) pour les suggestions
 * Utilisé quand aucune correspondance intelligente n'est trouvée
 */
export const popularPages = [
  {
    title: 'Accueil',
    path: '/',
    description: 'Retour à la page d\'accueil',
    icon: 'home'
  },
  {
    title: 'Services',
    path: '/#services',
    description: 'Découvrir nos services',
    icon: 'wrench'
  },
  {
    title: 'Réalisations',
    path: '/#portfolio',
    description: 'Voir nos projets',
    icon: 'briefcase'
  },
  {
    title: 'Contact',
    path: '/#contact',
    description: 'Nous contacter',
    icon: 'mail'
  },
  {
    title: 'À propos',
    path: '/#about',
    description: 'En savoir plus sur nous',
    icon: 'users'
  }
];

/**
 * Fonction de recherche fuzzy dans l'index
 * @param {string} query - Terme de recherche
 * @param {number} limit - Nombre maximum de résultats
 * @returns {Array} Résultats de recherche triés par pertinence
 */
export const searchInIndex = (query, limit = 5) => {
  if (!query || query.trim().length < 2) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Calculer le score de pertinence pour chaque élément
  const scoredResults = searchIndex.map(item => {
    let score = 0;
    
    // Score pour le titre (priorité haute)
    if (item.title.toLowerCase().includes(normalizedQuery)) {
      score += 10;
    }
    
    // Score pour les mots-clés
    item.keywords.forEach(keyword => {
      if (keyword.toLowerCase().includes(normalizedQuery)) {
        score += 5;
      }
      // Score bonus pour correspondance exacte
      if (keyword.toLowerCase() === normalizedQuery) {
        score += 3;
      }
    });
    
    // Score pour la description
    if (item.description.toLowerCase().includes(normalizedQuery)) {
      score += 2;
    }
    
    return { ...item, score };
  });
  
  // Filtrer les résultats avec score > 0 et trier par score décroissant
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
};

/**
 * Obtenir les pages populaires
 * @param {number} limit - Nombre maximum de pages
 * @returns {Array} Pages populaires
 */
export const getPopularPages = (limit = 5) => {
  return popularPages.slice(0, limit);
};
