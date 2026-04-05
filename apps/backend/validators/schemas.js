/**
 * Schemas de validation Backend — DK BUILDING
 *
 * Source de vérité : apps/shared/validators/schemas.js
 * Ce fichier est synchronisé manuellement. En cas de modification,
 * mettre à jour shared/validators/schemas.js ET ce fichier.
 *
 * Raison : Vercel serverless déploie uniquement apps/backend/,
 * le workspace @dkbuilding/shared n'est pas accessible au runtime.
 */

const { z } = require("zod");

// ─────────────────────────────────────────────
// Schéma Annonces (sync shared/validators/schemas.js)
// ─────────────────────────────────────────────

const annonceSchema = z.object({
  titre: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(255),
  description: z.string().optional().nullable(),
  contenu: z.string().optional().nullable(),
  categorie: z.string().optional().nullable(),
  statut: z.enum(["brouillon", "publie", "archive"]).default("brouillon"),
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

// ─────────────────────────────────────────────
// Schéma Projets (sync shared/validators/schemas.js)
// ─────────────────────────────────────────────

const projetSchema = z.object({
  titre: z
    .string()
    .min(3, "Le titre doit faire au moins 3 caractères")
    .max(255),
  description: z.string().optional().nullable(),
  contenu: z.string().optional().nullable(),
  type_projet: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  lieu: z.string().optional().nullable(),
  date_debut: z.string().optional().nullable(),
  date_fin: z.string().optional().nullable(),
  statut: z.enum(["en_cours", "termine", "annule"]).default("en_cours"),
  featured: z
    .preprocess(
      (val) => val === "true" || val === true || val === 1 || val === "1",
      z.boolean(),
    )
    .optional(),
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

// ─────────────────────────────────────────────
// Schéma Contact (sync shared/validators/schemas.js)
// ─────────────────────────────────────────────

const contactFormSchema = z.object({
  projectType: z.enum(["charpente", "bardage", "couverture", "mixte"], {
    required_error: "Sélectionnez un type de projet",
  }),
  projectDetails: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(10).max(2000).optional(),
  ),
  surface: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional(),
  ),
  deadline: z.preprocess(
    (val) => (val === "" || val === null || val === undefined ? undefined : val),
    z.enum(["urgent", "1-3mois", "3-6mois", "6mois+"]).optional(),
  ),
  location: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(200).optional(),
  ),
  name: z.string().min(1).min(2).max(100).trim(),
  email: z.string().min(1).email(),
  phone: z.string().min(1),
  message: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(1000).optional(),
  ),
});

// ─────────────────────────────────────────────
// Schémas backend-only
// ─────────────────────────────────────────────

const authHealthSchema = z.object({
  password: z.string().min(1, "Le mot de passe est requis"),
});

const lockAccessConfigSchema = z.object({
  enabled: z.boolean().optional(),
  locked: z.boolean().optional(),
  maintenanceMode: z.boolean().optional(),
  allowedIPs: z.array(z.string()).optional(),
  blockedIPs: z.array(z.string()).optional(),
});

const validationErrorReportSchema = z.object({
  field: z.string(),
  error: z.string(),
  userAgent: z.string().optional(),
  url: z.string().optional(),
  timestamp: z.string().optional(),
});

module.exports = {
  annonceSchema,
  projetSchema,
  contactFormSchema,
  authHealthSchema,
  lockAccessConfigSchema,
  validationErrorReportSchema,
};
