const { z } = require("zod");

/**
 * Schémas de validation partagés — Source unique de vérité
 * Package @dkbuilding/shared
 *
 * Syntaxe CommonJS pour compatibilité backend (Express) et frontend (Vite gère l'import CJS).
 */

// ─────────────────────────────────────────────
// Schéma Annonces — Base commune
// ─────────────────────────────────────────────

const annonceBaseSchema = z.object({
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

// Frontend : inclut les champs fichiers côté client
const annonceFrontendSchema = annonceBaseSchema.extend({
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
});

// Backend : les images/docs sont gérés via Multer, pas de champs fichiers dans le schema
const annonceBackendSchema = annonceBaseSchema;

// Alias générique (base)
const annonceSchema = annonceBaseSchema;

// ─────────────────────────────────────────────
// Schéma Projets — Base commune
// ─────────────────────────────────────────────

const projetBaseSchema = z.object({
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
});

// Frontend : featured est un booléen simple + champs fichiers
const projetFrontendSchema = projetBaseSchema.extend({
  featured: z.boolean().optional(),
  images: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
});

// Backend : featured avec preprocess pour coercion string/number -> boolean
const projetBackendSchema = projetBaseSchema.extend({
  featured: z
    .preprocess(
      (val) => val === "true" || val === true || val === 1 || val === "1",
      z.boolean(),
    )
    .optional(),
});

// Alias générique (base)
const projetSchema = projetBaseSchema;

// ─────────────────────────────────────────────
// Schéma Contact — Formulaire frontend uniquement
// ─────────────────────────────────────────────

/**
 * Ce schema est utilisé côté frontend pour la validation du formulaire de contact.
 * Le backend utilise express-validator pour le contact, donc ce schema reste frontend-only.
 *
 * Note : la validation du téléphone utilise isValidPhoneNumber de react-phone-number-input,
 * qui est une dépendance frontend uniquement. Le backend ne l'utilise pas.
 * Pour cette raison, le champ phone utilise une regex basique ici.
 * Le composant Contact.jsx peut ajouter un .refine() supplémentaire avec isValidPhoneNumber.
 */
const contactFormSchema = z.object({
  projectType: z.enum(["charpente", "bardage", "couverture", "mixte"], {
    required_error: "Sélectionnez un type de projet pour continuer",
    invalid_type_error:
      "Type de projet invalide. Veuillez choisir parmi les options proposées.",
  }),
  projectDetails: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .min(
        10,
        "La description doit contenir au moins 10 caractères pour nous aider à mieux comprendre votre projet.",
      )
      .max(
        2000,
        "La description est trop longue. Réduisez à 2000 caractères maximum pour que nous puissions traiter votre demande.",
      )
      .optional(),
  ),
  surface: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .optional()
      .refine(
        (val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0),
        {
          message:
            "La surface doit être un nombre positif. Exemple : 500 (en m²)",
        },
      ),
  ),
  deadline: z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;
      return val;
    },
    z
      .enum(["urgent", "1-3mois", "3-6mois", "6mois+"], {
        errorMap: () => ({
          message:
            "Sélectionnez un délai dans la liste pour que nous puissions planifier votre projet.",
        }),
      })
      .optional(),
  ),
  location: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .max(
        200,
        "La localisation est trop longue. Utilisez une adresse plus courte (ex: Albi, Tarn).",
      )
      .optional(),
  ),
  name: z
    .string()
    .min(
      1,
      "Votre nom est obligatoire pour que nous puissions vous contacter personnellement.",
    )
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom est trop long (maximum 100 caractères)")
    .trim(),
  email: z
    .string()
    .min(1, "Votre adresse e-mail est obligatoire pour recevoir notre réponse")
    .email(
      "Cette adresse e-mail n'est pas valide. Vérifiez qu'elle contient un @ et un domaine (ex: exemple@domaine.com)",
    ),
  phone: z
    .string()
    .min(
      1,
      "Votre numéro de téléphone nous permet de vous contacter rapidement pour discuter de votre projet",
    ),
  message: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .string()
      .max(
        1000,
        "Le message est trop long. Réduisez à 1000 caractères maximum.",
      )
      .optional(),
  ),
});

module.exports = {
  // Schemas de base
  annonceSchema,
  projetSchema,
  contactFormSchema,

  // Schemas spécialisés
  annonceBaseSchema,
  annonceFrontendSchema,
  annonceBackendSchema,

  projetBaseSchema,
  projetFrontendSchema,
  projetBackendSchema,
};
