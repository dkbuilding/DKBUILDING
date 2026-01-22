/**
 * Calcule le temps de lecture estimé en minutes
 * Basé sur une vitesse de lecture moyenne de 200 mots par minute
 * 
 * @param {string} text - Le texte à analyser
 * @returns {string} - Temps de lecture formaté (ex: "3 min")
 */
export const calculateReadingTime = (text) => {
  if (!text || typeof text !== 'string') {
    return '1 min';
  }

  // Supprimer les balises HTML/Markdown pour compter uniquement les mots
  const cleanText = text
    .replace(/<[^>]*>/g, '') // Supprimer les balises HTML
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remplacer les liens markdown par leur texte
    .replace(/[#*`_~]/g, '') // Supprimer les caractères markdown
    .replace(/\n+/g, ' ') // Remplacer les retours à la ligne par des espaces
    .trim();

  // Compter les mots (séparés par des espaces)
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  // Vitesse de lecture moyenne : 200 mots par minute
  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  // Retourner au minimum 1 minute
  return `${Math.max(1, minutes)} min`;
};

/**
 * Calcule le temps de lecture pour un article complet
 * Prend en compte le titre, l'extrait et le contenu
 * 
 * @param {Object} article - L'objet article avec title, excerpt, content
 * @returns {string} - Temps de lecture formaté
 */
export const calculateArticleReadingTime = (article) => {
  if (!article) {
    return '1 min';
  }

  const texts = [];
  
  if (article.title) texts.push(article.title);
  if (article.excerpt) texts.push(article.excerpt);
  if (article.content) texts.push(article.content);

  const fullText = texts.join(' ');
  return calculateReadingTime(fullText);
};

