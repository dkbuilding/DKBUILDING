const express = require("express");
const router = express.Router();
const emailService = require("../utils/emailService");
const { body, validationResult } = require("express-validator");

// Validation des données du formulaire
const contactValidation = [
  body("projectType")
    .notEmpty()
    .withMessage("Le type de projet est requis")
    .isIn(["charpente", "bardage", "couverture", "mixte"])
    .withMessage("Type de projet invalide"),

  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Le nom doit contenir entre 2 et 100 caractères"),

  body("email").isEmail().normalizeEmail().withMessage("Email invalide"),

  body("phone")
    .matches(/^(\+33|0)[1-9](\d{8})$/)
    .withMessage("Numéro de téléphone français invalide"),

  body("location")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La localisation ne peut pas dépasser 200 caractères"),

  body("surface")
    .optional()
    .isNumeric()
    .withMessage("La surface doit être un nombre"),

  body("deadline")
    .optional()
    .isIn(["urgent", "1-3mois", "3-6mois", "6mois+"])
    .withMessage("Délai invalide"),

  body("projectDetails")
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage(
      "La description du projet ne peut pas dépasser 2000 caractères",
    ),

  body("message")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Le message ne peut pas dépasser 1000 caractères"),
];

// Route POST pour le formulaire de contact
router.post("/contact", contactValidation, async (req, res) => {
  try {
    // Vérification des erreurs de validation
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: "Validation Error",
        message: "Données invalides",
        details: errors.array(),
      });
    }

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

    // Envoi de l'email
    const result = await emailService.sendEmail(emailData);

    if (result.success) {
      // Envoi d'un email de confirmation au client
      const confirmationData = {
        to: email,
        subject: "Confirmation de votre demande de devis - DK BUILDING",
        template: "confirmation",
        data: {
          name,
          projectType: getProjectTypeLabel(projectType),
        },
      };

      await emailService.sendEmail(confirmationData);

      res.status(200).json({
        success: true,
        message:
          "Votre demande a été envoyée avec succès. Nous vous contacterons dans les plus brefs délais.",
        messageId: result.messageId,
      });
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi du formulaire:", error);

    res.status(500).json({
      error: "Internal Server Error",
      message:
        "Erreur lors de l'envoi de votre demande. Veuillez réessayer ou nous contacter directement.",
    });
  }
});

// Fonction utilitaire pour obtenir le libellé du type de projet
function getProjectTypeLabel(type) {
  const labels = {
    charpente: "Charpente Métallique",
    bardage: "Bardage",
    couverture: "Couverture",
    mixte: "Projet Mixte",
  };
  return labels[type] || type;
}

// Fonction utilitaire pour obtenir le libellé du délai
function getDeadlineLabel(deadline) {
  const labels = {
    urgent: "Urgent (moins d'1 mois)",
    "1-3mois": "1 à 3 mois",
    "3-6mois": "3 à 6 mois",
    "6mois+": "Plus de 6 mois",
  };
  return labels[deadline] || deadline || "Non spécifié";
}

// Route GET pour vérifier le statut de l'API
router.get("/status", (req, res) => {
  res.json({
    status: "OK",
    service: "Contact API",
    version: "latest",
    emailConfigured: emailService.isConfigured(),
    timestamp: new Date().toISOString(),
  });
});

// Route publique pour signaler les erreurs de validation (accessible sans authentification)
router.post("/report-validation-error", async (req, res) => {
  try {
    const Logger = require("../utils/logger");
    const { field, error, formData, userAgent, url } = req.body;

    // Créer un log d'erreur de validation
    Logger.createLog("validation_error", "contact_form", null, null, {
      field,
      error: error || "Erreur de validation inconnue",
      formData: formData || {},
      userAgent: userAgent || "Unknown",
      url: url || "Unknown",
      timestamp: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Erreur signalée avec succès",
    });
  } catch (error) {
    console.error("Erreur lors du signalement:", error);
    res.status(500).json({
      success: false,
      error: "Erreur lors du signalement",
      message: error.message,
    });
  }
});

module.exports = router;
