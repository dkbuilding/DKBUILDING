/**
 * Schemas de validation Frontend — DK BUILDING
 *
 * Source unique de verite : apps/shared/validators/schemas.js
 * Ce fichier re-exporte les schemas shared et ajoute les types TypeScript.
 *
 * /!\ Ne PAS dupliquer les definitions Zod ici.
 *     Toute modification doit etre faite dans shared/validators/schemas.js
 */

import { z } from "zod";

// ─────────────────────────────────────────────
// Import depuis @dkbuilding/shared (source unique)
// ─────────────────────────────────────────────

// @ts-expect-error — CJS import sans types
export {
  annonceBaseSchema,
  annonceFrontendSchema,
  annonceSchema,
  projetBaseSchema,
  projetFrontendSchema,
  projetSchema,
  contactFormSchema,
} from "@dkbuilding/shared/validators";

// ─────────────────────────────────────────────
// Types TypeScript inferes (frontend-only)
// ─────────────────────────────────────────────

// Re-import pour inferer les types
// @ts-expect-error — CJS import sans types
import { annonceBaseSchema, annonceFrontendSchema, projetBaseSchema, projetFrontendSchema, contactFormSchema } from "@dkbuilding/shared/validators";

/** Type infere depuis le schema de base Annonce */
export type AnnonceBase = z.infer<typeof annonceBaseSchema>;
/** Type infere depuis le schema frontend Annonce (avec images/documents) */
export type AnnonceFrontend = z.infer<typeof annonceFrontendSchema>;

/** Type infere depuis le schema de base Projet */
export type ProjetBase = z.infer<typeof projetBaseSchema>;
/** Type infere depuis le schema frontend Projet (avec images/documents/videos) */
export type ProjetFrontend = z.infer<typeof projetFrontendSchema>;

/** Type infere depuis le schema de formulaire Contact */
export type ContactFormData = z.infer<typeof contactFormSchema>;

// ─────────────────────────────────────────────
// Statuts et types metier (unions de strings)
// ─────────────────────────────────────────────

export type AnnonceStatut = "brouillon" | "publie" | "archive";
export type ProjetStatut = "en_cours" | "termine" | "annule";
export type ProjectType = "charpente" | "bardage" | "couverture" | "mixte";
export type ProjectDeadline = "urgent" | "1-3mois" | "3-6mois" | "6mois+";
