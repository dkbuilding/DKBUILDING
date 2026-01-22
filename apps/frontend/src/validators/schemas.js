import { z } from "zod";

/**
 * Schémas de validation Frontend - Miroir du Backend
 * Architecture GovTech pour DK BUILDING
 *
 * Ces schémas DOIVENT rester synchronisés avec apps/backend/validators/schemas.js
 */

// Schéma pour les Annonces
export const annonceSchema = z.object({
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
  // Images et documents sont gérés à part via l'upload
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

// Schéma pour les Projets
export const projetSchema = z.object({
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
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  // Fichiers
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});
