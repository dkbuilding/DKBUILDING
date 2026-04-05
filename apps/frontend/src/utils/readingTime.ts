/**
 * Calcule le temps de lecture estimé en minutes
 * Basé sur une vitesse de lecture moyenne de 200 mots par minute
 */

interface Article {
  readonly title?: string;
  readonly excerpt?: string;
  readonly content?: string;
}

/**
 * @param text - Le texte à analyser
 * @returns Temps de lecture formaté (ex: "3 min")
 */
export const calculateReadingTime = (text: string | null | undefined): string => {
  if (!text || typeof text !== 'string') {
    return '1 min';
  }

  const cleanText = text
    .replace(/<[^>]*>/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[#*`_~]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  const wordCount = words.length;

  const wordsPerMinute = 200;
  const minutes = Math.ceil(wordCount / wordsPerMinute);

  return `${Math.max(1, minutes)} min`;
};

/**
 * Calcule le temps de lecture pour un article complet
 * Prend en compte le titre, l'extrait et le contenu
 */
export const calculateArticleReadingTime = (article: Article | null | undefined): string => {
  if (!article) {
    return '1 min';
  }

  const texts: string[] = [];

  if (article.title) texts.push(article.title);
  if (article.excerpt) texts.push(article.excerpt);
  if (article.content) texts.push(article.content);

  const fullText = texts.join(' ');
  return calculateReadingTime(fullText);
};
