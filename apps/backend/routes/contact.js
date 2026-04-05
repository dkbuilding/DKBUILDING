const express = require("express");
const router = express.Router();
const emailService = require("../utils/emailService");
const validateZod = require("../middleware/validateZod");
const { contactLimiter } = require("../middleware/rateLimiter");
const { contactFormSchema, validationErrorReportSchema } = require("../validators/schemas");
const {
  sendCreated,
  sendSuccess,
  sendInternalError,
  sendValidationError,
} = require("../utils/apiResponse");

/**
 * POST /api/contact
 * Soumettre une demande de devis
 *
 * Rate limited : 5 soumissions / 15 min
 * Validation : Zod (contactFormSchema)
 * Response : 201 Created
 */
router.post(
  "/contact",
  contactLimiter,
  validateZod(contactFormSchema),
  async (req, res) => {
    try {
      const {
        projectType,
        projectDetails,
        surface,
        deadline,
        location,
        name,
        email,
        phone,
        message,
      } = req.body;

      // Préparation des données pour l'email
      const emailData = {
        to: process.env.CONTACT_EMAIL || "contact@dkbuilding.fr",
        subject: `Nouvelle demande de devis - ${name}`,
        template: "contact-form",
        data: {
          name,
          email,
          phone,
          projectType: getProjectTypeLabel(projectType),
          projectDetails: projectDetails || "Non spécifié",
          surface: surface ? `${surface} m²` : "Non spécifié",
          deadline: getDeadlineLabel(deadline),
          location: location || "Non spécifié",
          message: message || "Aucun message supplémentaire",
          timestamp: new Date().toLocaleString("fr-FR"),
          clientIP: req.ip || req.connection.remoteAddress,
        },
      };

      const result = await emailService.sendEmail(emailData);

      if (result.success) {
        // Email de confirmation au client
        const confirmationData = {
          to: email,
          subject: "Confirmation de votre demande de devis - DK BUILDING",
          template: "confirmation",
          data: { name, projectType: getProjectTypeLabel(projectType) },
        };

        await emailService.sendEmail(confirmationData);

        return sendCreated(
          res,
          { messageId: result.messageId },
          "Votre demande a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.",
        );
      }

      throw new Error(result.error);
    } catch (error) {
      console.error("Erreur lors de l'envoi du formulaire:", error);
      return sendInternalError(
        res,
        "Erreur lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter directement.",
      );
    }
  },
);

/**
 * GET /api/contact/status
 * Statut du service de contact
 */
router.get("/contact/status", (req, res) => {
  return sendSuccess(res, {
    service: "Contact API",
    version: "latest",
    emailConfigured: emailService.isConfigured(),
    timestamp: new Date().toISOString(),
  });
});

/**
 * POST /api/validation-errors
 * Signaler une erreur de validation frontend (telemetrie)
 *
 * Validation : Zod (validationErrorReportSchema)
 */
router.post(
  "/validation-errors",
  validateZod(validationErrorReportSchema),
  async (req, res) => {
    try {
      const Logger = require("../utils/logger");
      const { field, error, formData, userAgent, url } = req.body;

      Logger.createLog("validation_error", "contact_form", null, null, {
        field,
        error: error || "Erreur de validation inconnue",
        formData: formData || {},
        userAgent: userAgent || "Unknown",
        url: url || "Unknown",
        timestamp: new Date().toISOString(),
      });

      return sendSuccess(res, null, { message: "Erreur signalée avec succès" });
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      return sendInternalError(res, "Erreur lors du signalement");
    }
  },
);

function getProjectTypeLabel(type) {
  const labels = {
    charpente: "Charpente Métallique",
    bardage: "Bardage",
    couverture: "Couverture",
    mixte: "Projet Mixte",
  };
  return labels[type] || type;
}

function getDeadlineLabel(deadline) {
  const labels = {
    urgent: "Urgent (moins d'1 mois)",
    "1-3mois": "1 à 3 mois",
    "3-6mois": "3 à 6 mois",
    "6mois+": "Plus de 6 mois",
  };
  return labels[deadline] || deadline || "Non spécifié";
}

module.exports = router;
