/**
 * API Response Helper — DK BUILDING
 * Format de réponse standardisé pour toute l'API.
 *
 * Réponses de succès : { success: true, data, meta? }
 * Réponses d'erreur  : { success: false, error: { code, message, details? } }
 */

/**
 * Réponse de succès
 * @param {import('express').Response} res
 * @param {*} data - Données à retourner
 * @param {object} [options]
 * @param {number} [options.status=200] - Code HTTP
 * @param {string} [options.message] - Message optionnel
 * @param {object} [options.meta] - Métadonnées (pagination, etc.)
 */
function sendSuccess(res, data, options = {}) {
  const { status = 200, message, meta } = options;

  const response = { success: true, data };

  if (message) response.message = message;
  if (meta) response.meta = meta;

  return res.status(status).json(response);
}

/**
 * Réponse de succès pour création (201 Created)
 */
function sendCreated(res, data, message = "Ressource créée avec succès") {
  return sendSuccess(res, data, { status: 201, message });
}

/**
 * Réponse sans contenu (204 No Content) — pour DELETE
 */
function sendNoContent(res) {
  return res.status(204).send();
}

/**
 * Réponse d'erreur standardisée
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number} options.status - Code HTTP
 * @param {string} options.code - Code d'erreur machine (UPPER_SNAKE_CASE)
 * @param {string} options.message - Message lisible
 * @param {Array} [options.details] - Détails champ par champ (validation)
 */
function sendError(res, { status, code, message, details }) {
  const error = { code, message };
  if (details) error.details = details;

  return res.status(status).json({ success: false, error });
}

// Erreurs prédéfinies courantes
function sendBadRequest(res, message = "Requête invalide", details) {
  return sendError(res, {
    status: 400,
    code: "BAD_REQUEST",
    message,
    details,
  });
}

function sendUnauthorized(res, message = "Authentification requise") {
  return sendError(res, {
    status: 401,
    code: "UNAUTHORIZED",
    message,
  });
}

function sendForbidden(res, message = "Accès refusé") {
  return sendError(res, {
    status: 403,
    code: "FORBIDDEN",
    message,
  });
}

function sendNotFound(res, message = "Ressource non trouvée") {
  return sendError(res, {
    status: 404,
    code: "NOT_FOUND",
    message,
  });
}

function sendConflict(res, message = "Conflit de ressource") {
  return sendError(res, {
    status: 409,
    code: "CONFLICT",
    message,
  });
}

function sendValidationError(res, details, message = "Données invalides") {
  return sendError(res, {
    status: 422,
    code: "VALIDATION_ERROR",
    message,
    details,
  });
}

function sendTooManyRequests(res, message = "Trop de requêtes, réessayez plus tard") {
  return sendError(res, {
    status: 429,
    code: "TOO_MANY_REQUESTS",
    message,
  });
}

function sendInternalError(res, message = "Erreur interne du serveur") {
  return sendError(res, {
    status: 500,
    code: "INTERNAL_SERVER_ERROR",
    message,
  });
}

/**
 * Construire un objet meta de pagination standardisé
 * @param {object} params
 * @param {number} params.total - Nombre total d'éléments
 * @param {number} params.limit - Taille de la page
 * @param {number} params.offset - Décalage actuel
 */
function paginationMeta({ total, limit, offset }) {
  return {
    pagination: {
      total,
      limit,
      offset,
      page: Math.floor(offset / limit) + 1,
      totalPages: Math.ceil(total / limit),
      hasNext: offset + limit < total,
      hasPrev: offset > 0,
    },
  };
}

module.exports = {
  sendSuccess,
  sendCreated,
  sendNoContent,
  sendError,
  sendBadRequest,
  sendUnauthorized,
  sendForbidden,
  sendNotFound,
  sendConflict,
  sendValidationError,
  sendTooManyRequests,
  sendInternalError,
  paginationMeta,
};
