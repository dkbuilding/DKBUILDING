const { z } = require("zod");

/**
 * Schémas de validation GovTech - Zéro Trust
 * Architecture Militaire pour DK BUILDING
 */

// Schéma pour les Annonces
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
  // Les images/docs sont gérés via Multer, mais on peut valider les métadonnées si nécessaire
});

// Schéma pour les Projets
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
  date_debut: z.string().optional().nullable(), // Idéalement valider le format date ISO
  date_fin: z.string().optional().nullable(),
  statut: z.enum(["en_cours", "termine", "annule"]).default("en_cours"),
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  featured: z
    .preprocess(
      (val) => val === "true" || val === true || val === 1 || val === "1",
      z.boolean(),
    )
    .optional(),
});

module.exports = {
  annonceSchema,
  projetSchema,
};
