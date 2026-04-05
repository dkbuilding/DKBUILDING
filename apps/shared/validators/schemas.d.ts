import { z } from 'zod';

// ─── Schemas Annonces ───────────────────────────
export declare const annonceBaseSchema: z.ZodObject<{
  titre: z.ZodString;
  description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  contenu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  categorie: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  statut: z.ZodDefault<z.ZodEnum<['brouillon', 'publie', 'archive']>>;
  meta_keywords: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  meta_description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}>;

export declare const annonceFrontendSchema: z.ZodObject<{
  titre: z.ZodString;
  description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  contenu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  categorie: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  statut: z.ZodDefault<z.ZodEnum<['brouillon', 'publie', 'archive']>>;
  meta_keywords: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  meta_description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  images: z.ZodOptional<z.ZodArray<z.ZodString>>;
  documents: z.ZodOptional<z.ZodArray<z.ZodString>>;
}>;

export declare const annonceBackendSchema: typeof annonceBaseSchema;
export declare const annonceSchema: typeof annonceBaseSchema;

// ─── Schemas Projets ────────────────────────────
export declare const projetBaseSchema: z.ZodObject<{
  titre: z.ZodString;
  description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  contenu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  type_projet: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  client: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  lieu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  date_debut: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  date_fin: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  statut: z.ZodDefault<z.ZodEnum<['en_cours', 'termine', 'annule']>>;
  meta_keywords: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  meta_description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}>;

export declare const projetFrontendSchema: z.ZodObject<{
  titre: z.ZodString;
  description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  contenu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  type_projet: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  client: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  lieu: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  date_debut: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  date_fin: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  statut: z.ZodDefault<z.ZodEnum<['en_cours', 'termine', 'annule']>>;
  meta_keywords: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  meta_description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
  featured: z.ZodOptional<z.ZodBoolean>;
  images: z.ZodOptional<z.ZodArray<z.ZodString>>;
  documents: z.ZodOptional<z.ZodArray<z.ZodString>>;
  videos: z.ZodOptional<z.ZodArray<z.ZodString>>;
}>;

export declare const projetBackendSchema: z.ZodObject<any>;
export declare const projetSchema: typeof projetBaseSchema;

// ─── Schema Contact ─────────────────────────────
export declare const contactFormSchema: z.ZodObject<{
  projectType: z.ZodEnum<['charpente', 'bardage', 'couverture', 'mixte']>;
  projectDetails: z.ZodEffects<any>;
  surface: z.ZodEffects<any>;
  deadline: z.ZodEffects<any>;
  location: z.ZodEffects<any>;
  name: z.ZodString;
  email: z.ZodString;
  phone: z.ZodString;
  message: z.ZodEffects<any>;
}>;

// ─── Types inferes ──────────────────────────────

/** Type d'une annonce (base) infere du schema Zod */
export type AnnonceBase = z.infer<typeof annonceBaseSchema>;

/** Type d'une annonce frontend (avec images/documents) */
export type AnnonceFrontend = z.infer<typeof annonceFrontendSchema>;

/** Type d'un projet (base) infere du schema Zod */
export type ProjetBase = z.infer<typeof projetBaseSchema>;

/** Type d'un projet frontend (avec medias) */
export type ProjetFrontend = z.infer<typeof projetFrontendSchema>;

/** Type du formulaire de contact infere du schema Zod */
export type ContactFormData = z.infer<typeof contactFormSchema>;

/** Statut d'annonce */
export type AnnonceStatut = 'brouillon' | 'publie' | 'archive';

/** Statut de projet */
export type ProjetStatut = 'en_cours' | 'termine' | 'annule';

/** Type de projet */
export type ProjectType = 'charpente' | 'bardage' | 'couverture' | 'mixte';

/** Deadline de projet */
export type ProjectDeadline = 'urgent' | '1-3mois' | '3-6mois' | '6mois+';
