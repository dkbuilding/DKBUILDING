/**
 * Types JSDoc partages — @dkbuilding/shared
 *
 * Pas de TypeScript car le backend est en CommonJS pur.
 * Ces typedefs sont utilisables via JSDoc dans les deux environnements.
 *
 * IMPORTANT : Les types reels sont inferes des schemas Zod dans schemas.d.ts.
 * Ce fichier fournit des typedefs JSDoc pour le DX en JavaScript pur.
 */

/**
 * @typedef {'charpente' | 'bardage' | 'couverture' | 'mixte'} ProjectType
 */

/**
 * @typedef {'brouillon' | 'publie' | 'archive'} AnnonceStatut
 */

/**
 * @typedef {'en_cours' | 'termine' | 'annule'} ProjetStatut
 */

/**
 * @typedef {'urgent' | '1-3mois' | '3-6mois' | '6mois+'} ProjectDeadline
 */

/**
 * @typedef {Object} Annonce
 * @property {number} [id]
 * @property {string} titre
 * @property {string} [description]
 * @property {string} [contenu]
 * @property {string} [categorie]
 * @property {AnnonceStatut} statut
 * @property {string} [meta_keywords]
 * @property {string} [meta_description]
 * @property {string[]} [images]
 * @property {string[]} [documents]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} Projet
 * @property {number} [id]
 * @property {string} titre
 * @property {string} [description]
 * @property {string} [contenu]
 * @property {string} [type_projet]
 * @property {string} [client]
 * @property {string} [lieu]
 * @property {string} [date_debut]
 * @property {string} [date_fin]
 * @property {ProjetStatut} statut
 * @property {string} [meta_keywords]
 * @property {string} [meta_description]
 * @property {boolean} [featured]
 * @property {string[]} [images]
 * @property {string[]} [documents]
 * @property {string[]} [videos]
 * @property {string} [created_at]
 * @property {string} [updated_at]
 */

/**
 * @typedef {Object} ContactFormData
 * @property {ProjectType} projectType
 * @property {string} [projectDetails]
 * @property {string} [surface]
 * @property {ProjectDeadline} [deadline]
 * @property {string} [location]
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} [message]
 */

/**
 * @typedef {Object} APIResponse
 * @template T
 * @property {boolean} success
 * @property {T} data
 * @property {string} [message]
 * @property {string} [error]
 */

module.exports = {};
