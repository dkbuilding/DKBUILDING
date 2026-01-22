const slugify = require('slugify');

/**
 * Génère un slug unique à partir d'un titre
 */
function generateSlug(titre, existingSlugs = []) {
  let baseSlug = slugify(titre, {
    lower: true,
    strict: true,
    locale: 'fr'
  });

  // Si le slug existe déjà, ajouter un suffixe numérique
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

module.exports = { generateSlug };

