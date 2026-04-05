/**
 * Schemas de validation Backend — DK BUILDING
 *
 * Re-exporte depuis @dkbuilding/shared (source unique de verite).
 * Le backend utilise les schemas "backend" specialises quand ils existent
 * (ex: projetBackendSchema avec preprocess pour featured).
 *
 * /!\ Ne PAS dupliquer les definitions Zod ici.
 *     Toute modification doit etre faite dans shared/validators/schemas.js
 */

const { z } = require("zod");
const {
  annonceSchema,
  annonceBackendSchema,
  projetSchema,
  projetBackendSchema,
  contactFormSchema,
} = require("@dkbuilding/shared/validators");

// ─────────────────────────────────────────────
// Schémas backend-only (pas dans shared)
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
  // Schemas partagés (depuis @dkbuilding/shared)
  annonceSchema: annonceBackendSchema || annonceSchema,
  projetSchema: projetBackendSchema || projetSchema,
  contactFormSchema,
  // Schemas backend-only
  authHealthSchema,
  lockAccessConfigSchema,
  validationErrorReportSchema,
};
