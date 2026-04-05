/**
 * Schemas de validation Backend — DK BUILDING
 *
 * Re-exporte depuis @dkbuilding/shared (source unique de verite).
 * Le backend utilise les schemas "backend" specialises quand ils existent
 * (ex: projetBackendSchema avec preprocess pour featured).
 *
 * /!\ Ne PAS dupliquer les definitions Zod ici.
 *     Toute modification doit etre faite dans shared/validators/schemas.js
 */

const {
  annonceSchema,
  annonceBackendSchema,
  projetSchema,
  projetBackendSchema,
  contactFormSchema,
} = require("@dkbuilding/shared/validators");

module.exports = {
  // Utiliser les variants backend quand disponibles (avec preprocess featured, etc.)
  annonceSchema: annonceBackendSchema || annonceSchema,
  projetSchema: projetBackendSchema || projetSchema,
  contactFormSchema,
};
