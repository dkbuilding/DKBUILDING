/**
 * Middleware de Validation Zod — DK BUILDING
 *
 * Valide le body, query ou params d'une requête avec un schema Zod.
 * Retourne une erreur 422 standardisée en cas d'échec.
 */

const { sendValidationError } = require("../utils/apiResponse");

/**
 * Créer un middleware de validation Zod
 * @param {import('zod').ZodSchema} schema - Schema Zod à appliquer
 * @param {'body' | 'query' | 'params'} [source='body'] - Source des données
 * @returns {import('express').RequestHandler}
 */
function validateZod(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      return sendValidationError(res, details);
    }

    // Remplacer les données par les données validées et transformées
    req[source] = result.data;
    next();
  };
}

module.exports = validateZod;
