/**
 * Schémas de validation Frontend — DK BUILDING
 *
 * Réexporte depuis le package partagé @dkbuilding/shared.
 * Source unique de vérité : apps/shared/validators/schemas.js
 *
 * Note : Le package shared utilise CommonJS (pour compatibilité backend).
 * Vite interop automatiquement les modules CJS comme default export.
 */

// Vite gère l'interop CJS → ESM automatiquement via le default export
import * as shared from "@dkbuilding/shared/validators";

// Réexporter tous les schemas
export const annonceSchema = shared.annonceSchema ?? shared.default?.annonceSchema;
export const projetSchema = shared.projetSchema ?? shared.default?.projetSchema;
export const contactFormSchema = shared.contactFormSchema ?? shared.default?.contactFormSchema;
export const annonceFrontendSchema = shared.annonceFrontendSchema ?? shared.default?.annonceFrontendSchema;
export const projetFrontendSchema = shared.projetFrontendSchema ?? shared.default?.projetFrontendSchema;
export const annonceBaseSchema = shared.annonceBaseSchema ?? shared.default?.annonceBaseSchema;
export const projetBaseSchema = shared.projetBaseSchema ?? shared.default?.projetBaseSchema;
export const annonceBackendSchema = shared.annonceBackendSchema ?? shared.default?.annonceBackendSchema;
export const projetBackendSchema = shared.projetBackendSchema ?? shared.default?.projetBackendSchema;
