/**
 * Schémas de validation Frontend — DK BUILDING
 *
 * Source synchronisée avec apps/shared/validators/schemas.js
 * En cas de modification, mettre à jour les DEUX fichiers.
 */

import { z } from "zod";

// ─────────────────────────────────────────────
// Schéma Annonces
// ─────────────────────────────────────────────

export const annonceBaseSchema = z.object({
  titre: z.string().min(3, "Le titre doit faire au moins 3 caractères").max(255),
  description: z.string().optional().nullable(),
  contenu: z.string().optional().nullable(),
  categorie: z.string().optional().nullable(),
  statut: z.enum(["brouillon", "publie", "archive"]).default("brouillon"),
  meta_keywords: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
});

export const annonceFrontendSchema = annonceBaseSchema.extend({
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

export const annonceSchema = annonceBaseSchema;

// ─────────────────────────────────────────────
// Schéma Projets
// ─────────────────────────────────────────────

export const projetBaseSchema = z.object({
  titre: z.string().min(3, "Le titre doit faire au moins 3 caractères").max(255),
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
});

export const projetFrontendSchema = projetBaseSchema.extend({
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

export const projetSchema = projetBaseSchema;

// ─────────────────────────────────────────────
// Schéma Contact
// ─────────────────────────────────────────────

export const contactFormSchema = z.object({
  projectType: z.enum(["charpente", "bardage", "couverture", "mixte"], {
    required_error: "Sélectionnez un type de projet pour continuer",
    invalid_type_error: "Type de projet invalide. Veuillez choisir parmi les options proposées.",
  }),
  projectDetails: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(10, "La description doit contenir au moins 10 caractères pour nous aider à mieux comprendre votre projet.").max(2000, "La description est trop longue. Réduisez à 2000 caractères maximum.").optional(),
  ),
  surface: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().optional().refine(
      (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
      { message: "La surface doit être un nombre positif. Exemple : 500 (en m²)" },
    ),
  ),
  deadline: z.preprocess(
    (val) => (val === "" || val === null || val === undefined) ? undefined : val,
    z.enum(["urgent", "1-3mois", "3-6mois", "6mois+"], {
      errorMap: () => ({ message: "Sélectionnez un délai dans la liste." }),
    }).optional(),
  ),
  location: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(200, "La localisation est trop longue.").optional(),
  ),
  name: z.string().min(1, "Votre nom est obligatoire.").min(2, "Le nom doit contenir au moins 2 caractères").max(100).trim(),
  email: z.string().min(1, "Votre adresse e-mail est obligatoire.").email("Cette adresse e-mail n'est pas valide."),
  phone: z.string().min(1, "Votre numéro de téléphone est obligatoire."),
  message: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().max(1000, "Le message est trop long. Réduisez à 1000 caractères maximum.").optional(),
  ),
});
