import { contactFormSchema as baseContactFormSchema } from "../../../validators/schemas";
import { isValidPhoneNumber } from "react-phone-number-input";

// Types de projets disponibles
export const PROJECT_TYPES = [
  {
    id: "charpente",
    label: "Charpente Métallique",
    description: "Construction ou réparation de charpentes",
  },
  {
    id: "bardage",
    label: "Bardage",
    description: "Pose de bardages métalliques ou composites",
  },
  {
    id: "couverture",
    label: "Couverture",
    description: "Installation ou réparation de couvertures",
  },
  {
    id: "mixte",
    label: "Projet Mixte",
    description: "Combinaison de plusieurs services",
  },
];

// Définition des étapes du formulaire
export const FORM_STEPS = [
  {
    id: 1,
    title: "Type de projet",
    description: "Choisissez votre type de projet",
  },
  {
    id: 2,
    title: "Détails",
    description: "Précisez les détails de votre projet",
  },
  { id: 3, title: "Contact", description: "Vos informations de contact" },
];

// Schema de contact importé depuis @dkbuilding/shared, étendu avec la validation
// téléphone spécifique au frontend (utilise isValidPhoneNumber de react-phone-number-input)
export const contactFormSchema = baseContactFormSchema.refine(
  (data) => {
    if (!data.phone) return false;
    const cleaned = data.phone.replace(/[\s.\-()]/g, "");
    const frenchFormat =
      /^(\+33|0)[1-9](\d{8})$/.test(cleaned) ||
      /^\+330[1-9](\d{8})$/.test(cleaned);
    return frenchFormat || isValidPhoneNumber(data.phone);
  },
  {
    message:
      "Format de téléphone invalide. Utilisez un numéro français (07 68 11 38 39) ou international (+33 7 68 11 38 39)",
    path: ["phone"],
  },
);
