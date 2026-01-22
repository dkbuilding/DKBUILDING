/**
 * Utilitaire de matching d'URL pour suggestions intelligentes
 * Utilise l'algorithme de distance de Levenshtein pour trouver des correspondances
 */

/**
 * Calcule la distance de Levenshtein entre deux chaînes
 * @param {string} str1 - Première chaîne
 * @param {string} str2 - Deuxième chaîne
 * @returns {number} Distance entre les deux chaînes
 */
export const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  const len1 = str1.length;
  const len2 = str2.length;

  // Initialiser la matrice
  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  // Calculer les distances
  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len2][len1];
};

/**
 * Normalise une URL pour la comparaison
 * @param {string} url - URL à normaliser
 * @returns {string} URL normalisée
 */
export const normalizeUrl = (url) => {
  return url
    .toLowerCase()
    .replace(/^\/+/, '') // Supprimer les slashes au début
    .replace(/\/+$/, '') // Supprimer les slashes à la fin
    .replace(/\/+/g, '/') // Remplacer les slashes multiples par un seul
    .trim();
};

/**
 * Extrait les segments d'une URL
 * @param {string} url - URL à analyser
 * @returns {Array} Segments de l'URL
 */
export const extractUrlSegments = (url) => {
  const normalized = normalizeUrl(url);
  return normalized.split('/').filter(segment => segment.length > 0);
};

/**
 * Routes disponibles sur le site DK BUILDING
 */
export const availableRoutes = [
  { path: '/', segments: [], keywords: ['home', 'accueil'] },
  { path: '/#services', segments: ['services'], keywords: ['services', 'charpente', 'bardage', 'couverture'] },
  { path: '/#portfolio', segments: ['portfolio'], keywords: ['portfolio', 'projets', 'réalisations'] },
  { path: '/#about', segments: ['about'], keywords: ['about', 'équipe', 'entreprise'] },
  { path: '/#contact', segments: ['contact'], keywords: ['contact', 'devis'] },
  { path: '/legal/mentions-legales', segments: ['legal', 'mentions-legales'], keywords: ['mentions', 'légales'] },
  { path: '/legal/politique-confidentialite', segments: ['legal', 'politique-confidentialite'], keywords: ['politique', 'confidentialité', 'données', 'rgpd'] },
  { path: '/legal/cgv', segments: ['legal', 'cgv'], keywords: ['cgv', 'conditions', 'vente'] }
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
 * Trouve les suggestions d'URL basées sur l'URL cassée
 * @param {string} brokenUrl - URL cassée à analyser
 * @param {number} maxSuggestions - Nombre maximum de suggestions
 * @returns {Array} Suggestions triées par pertinence
 */
export const getUrlSuggestions = (brokenUrl, maxSuggestions = 5) => {
  if (!brokenUrl) return [];

  const normalizedBrokenUrl = normalizeUrl(brokenUrl);
  const brokenSegments = extractUrlSegments(brokenUrl);
  
  const suggestions = [];

  // Analyser chaque route disponible
  availableRoutes.forEach(route => {
    let score = 0;
    let matchType = '';

    // 1. Correspondance exacte de segments
    const routeSegments = route.segments;
    const segmentMatches = brokenSegments.filter(segment => 
      routeSegments.some(routeSegment => 
        levenshteinDistance(segment, routeSegment) <= 2
      )
    );

    if (segmentMatches.length > 0) {
      score += 10 * segmentMatches.length;
      matchType = 'segment';
    }

    // 2. Correspondance de mots-clés
    const keywordMatches = brokenSegments.filter(segment =>
      route.keywords.some(keyword =>
        levenshteinDistance(segment, keyword) <= 3
      )
    );

    if (keywordMatches.length > 0) {
      score += 5 * keywordMatches.length;
      matchType = matchType || 'keyword';
    }

    // 3. Distance globale de Levenshtein sur l'URL complète
    const globalDistance = levenshteinDistance(normalizedBrokenUrl, normalizeUrl(route.path));
    if (globalDistance <= 5) {
      score += Math.max(0, 10 - globalDistance);
      matchType = matchType || 'global';
    }

    // 4. Correspondance partielle dans les segments
    brokenSegments.forEach(segment => {
      routeSegments.forEach(routeSegment => {
        if (routeSegment.includes(segment) || segment.includes(routeSegment)) {
          score += 3;
          matchType = matchType || 'partial';
        }
      });
    });

    if (score > 0) {
      suggestions.push({
        ...route,
        score,
        matchType,
        reason: getMatchReason(matchType, segmentMatches, keywordMatches)
      });
    }
  });

  // Trier par score décroissant et limiter le nombre de suggestions
  return suggestions
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions);
};

/**
 * Génère une raison explicative pour la correspondance
 * @param {string} matchType - Type de correspondance
 * @param {Array} segmentMatches - Segments correspondants
 * @param {Array} keywordMatches - Mots-clés correspondants
 * @returns {string} Raison de la correspondance
 */
const getMatchReason = (matchType, segmentMatches, keywordMatches) => {
  switch (matchType) {
    case 'segment':
      return `Correspondance avec "${segmentMatches.join(', ')}"`;
    case 'keyword':
      return `Mot-clé similaire à "${keywordMatches.join(', ')}"`;
    case 'global':
      return 'URL similaire';
    case 'partial':
      return 'Correspondance partielle';
    default:
      return 'Suggestion basée sur la pertinence';
  }
};

/**
 * Détermine si une URL semble être une faute de frappe
 * @param {string} url - URL à analyser
 * @returns {boolean} True si l'URL semble être une faute de frappe
 */
export const isLikelyTypo = (url) => {
  const normalized = normalizeUrl(url);
  
  // Patterns communs de fautes de frappe
  const commonTypos = [
    { wrong: 'servces', correct: 'services' },
    { wrong: 'servise', correct: 'services' },
    { wrong: 'portfoli', correct: 'portfolio' },
    { wrong: 'portfolo', correct: 'portfolio' },
    { wrong: 'contat', correct: 'contact' },
    { wrong: 'contac', correct: 'contact' },
    { wrong: 'abot', correct: 'about' },
    { wrong: 'abut', correct: 'about' }
  ];

  return commonTypos.some(typo => 
    normalized.includes(typo.wrong) && 
    levenshteinDistance(normalized, normalized.replace(typo.wrong, typo.correct)) <= 2
  );
};
