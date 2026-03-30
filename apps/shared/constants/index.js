/**
 * Constantes partagées — @dkbuilding/shared
 * Source unique de vérité pour les valeurs métier.
 */

// ─────────────────────────────────────────────
// Types de projets (métallique)
// ─────────────────────────────────────────────

const PROJECT_TYPES = ["charpente", "bardage", "couverture", "mixte"];

// ─────────────────────────────────────────────
// Statuts
// ─────────────────────────────────────────────

const ANNONCE_STATUTS = ["brouillon", "publie", "archive"];

const PROJET_STATUTS = ["en_cours", "termine", "annule"];

// ─────────────────────────────────────────────
// Délais de projet (formulaire contact)
// ─────────────────────────────────────────────

const PROJECT_DEADLINES = ["urgent", "1-3mois", "3-6mois", "6mois+"];

// ─────────────────────────────────────────────
// Limites de validation
// ─────────────────────────────────────────────

const VALIDATION_LIMITS = {
  TITRE_MIN: 3,
  TITRE_MAX: 255,
  NOM_MIN: 2,
  NOM_MAX: 100,
  DESCRIPTION_PROJET_MIN: 10,
  DESCRIPTION_PROJET_MAX: 2000,
  MESSAGE_MAX: 1000,
  LOCATION_MAX: 200,
};

module.exports = {
  PROJECT_TYPES,
  ANNONCE_STATUTS,
  PROJET_STATUTS,
  PROJECT_DEADLINES,
  VALIDATION_LIMITS,
};
