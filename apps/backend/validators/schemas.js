/**
 * Schémas de validation Backend — DK BUILDING
 *
 * Réexporte depuis le package partagé @dkbuilding/shared.
 * Source unique de vérité : apps/shared/validators/schemas.js
 */

const {
  contactFormSchema,
  annonceBackendSchema,
  projetBackendSchema,
} = require("@dkbuilding/shared/validators");

// Réexporter avec les noms attendus par le backend
module.exports = {
  contactFormSchema,
  annonceSchema: annonceBackendSchema,
  projetSchema: projetBackendSchema,
};
