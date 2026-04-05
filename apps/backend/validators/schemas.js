/**
 * Schémas de validation Backend — DK BUILDING
 *
 * Source synchronisée avec apps/shared/validators/schemas.js
 * En cas de modification, mettre à jour les DEUX fichiers.
 */

const { z } = require("zod");

// ─── Annonces ────────────────────────────────

const annonceSchema = z.object({
  titre: z.string().min(3, "Le titre doit faire au moins 3 caractères").max(255),
  description: z.string().optional().nullable(),
  contenu: z.string().optional().nullable(),
  categorie: z.string().optional().nullable(),
  statut: z.enum(["brouillon", "publie", "archive"]).default("brouillon"),
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

// ─── Projets ─────────────────────────────────

const projetSchema = z.object({
  titre: z.string().min(3, "Le titre doit faire au moins 3 caractères").max(255),
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

// ─── Contact ─────────────────────────────────

const contactFormSchema = z.object({
  projectType: z.enum(["charpente", "bardage", "couverture", "mixte"]),
  projectDetails: z.string().optional(),
  surface: z.string().optional(),
  deadline: z.string().optional(),
  location: z.string().optional(),
  name: z.string().min(1).max(100).trim(),
  email: z.string().email(),
  phone: z.string().min(1),
  message: z.string().max(1000).optional(),
});

module.exports = { annonceSchema, projetSchema, contactFormSchema };
