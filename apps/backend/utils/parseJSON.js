/**
 * Utilitaire de parsing JSON sécurisé
 * Utilisé pour parser les colonnes JSON stockées en TEXT dans SQLite/Turso
 *
 * @param {string} data - Données JSON en string
 * @returns {Array|Object} - Données parsées ou tableau vide en cas d'erreur
 */
const parseJSON = (data) => {
  try {
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
};

module.exports = parseJSON;
