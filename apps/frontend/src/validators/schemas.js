/**
 * Schémas de validation Frontend — DK BUILDING
 *
 * Re-export depuis @dkbuilding/shared (source unique de vérité).
 * Ne plus définir de schémas ici — modifier uniquement apps/shared/validators/schemas.js
 */

// Import CJS → ESM via namespace import (compatible Rollup)
import * as shared from "@dkbuilding/shared";

export const {
  // Schemas de base
  annonceSchema,
  annonceBaseSchema,
  annonceFrontendSchema,
  annonceBackendSchema,

  projetSchema,
  projetBaseSchema,
  projetFrontendSchema,
  projetBackendSchema,

  contactFormSchema,
} = shared;
