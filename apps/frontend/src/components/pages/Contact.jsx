import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  motionTokens,
  gsapUtils,
  scrollTriggerDefaults,
} from "../../utils/motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Select } from "../ui/select";
import { Card } from "../ui/card";
import {
  FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
  useFormContext,
} from "../ui/form";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import * as React from "react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";

gsap.registerPlugin(ScrollTrigger);

// Schéma de validation Zod avec messages en français empathiques et actionnables
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
    )
    .refine(
      (val) => {
        if (!val) return false;
        // Nettoyer le numéro pour la validation (inclure les parenthèses)
        const cleaned = val.replace(/[\s.\-()]/g, "");
        // Accepter les formats français (0X ou +33 ou +330)
        const frenchFormat =
          /^(\+33|0)[1-9](\d{8})$/.test(cleaned) ||
          /^\+330[1-9](\d{8})$/.test(cleaned);
        // Accepter aussi les numéros internationaux valides
        return frenchFormat || isValidPhoneNumber(val);
      },
      {
        message:
          "Format de téléphone invalide. Utilisez un numéro français (07 68 11 38 39) ou international (+33 7 68 11 38 39)",
      },
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

// Styles pour les grilles responsive du formulaire de contact
const contactGridStyles = `
  .contact-project-types-grid,
  .contact-details-grid,
  .contact-info-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  @media (min-width: 375px) {
    .contact-project-types-grid {
      gap: 1.5rem;
    }
    .contact-details-grid,
    .contact-info-grid {
      gap: 1rem;
    }
  }
  @media (min-width: 768px) {
    .contact-project-types-grid,
    .contact-details-grid,
    .contact-info-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`;

const Contact = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const formRef = useRef(null);
  const contactInfoRef = useRef(null);
  const projectTypesRef = useRef([]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errorReported, setErrorReported] = useState({});

  const steps = [
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

  const projectTypes = [
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

  // Configuration react-hook-form avec zod
  const form = useForm({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      projectType: "",
      projectDetails: "",
      surface: "",
      deadline: "",
      location: "",
      name: "",
      email: "",
      phone: "",
      message: "",
    },
    mode: "onChange",
  });

  // Ajustement automatique de la hauteur des textareas
  useLayoutEffect(() => {
    const adjustTextareaHeight = (textarea) => {
      if (!textarea) return;
      textarea.style.height = "auto";
      const minHeight = parseFloat(getComputedStyle(textarea).lineHeight) || 24;
      const padding =
        parseFloat(getComputedStyle(textarea).paddingTop) +
          parseFloat(getComputedStyle(textarea).paddingBottom) || 24;
      const minTotalHeight = minHeight + padding;
      const scrollHeight = textarea.scrollHeight;
      textarea.style.height = `${Math.max(minTotalHeight, scrollHeight)}px`;
    };

    const projectDetails = document.querySelector(
      'textarea[name="projectDetails"]',
    );
    const message = document.querySelector('textarea[name="message"]');

    if (projectDetails) adjustTextareaHeight(projectDetails);
    if (message) adjustTextareaHeight(message);
  }, [form.watch("projectDetails"), form.watch("message"), currentStep]);

  const validateStep = async (step) => {
    let fieldsToValidate = [];

    if (step === 1) {
      fieldsToValidate = ["projectType"];
    } else if (step === 2) {
      fieldsToValidate = ["surface", "deadline", "location", "projectDetails"];
    } else if (step === 3) {
      fieldsToValidate = ["name", "email", "phone", "message"];
    }

    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const nextStep = async () => {
    if (currentStep < 3) {
      const isValid = await validateStep(currentStep);
      if (isValid) {
        setCurrentStep(currentStep + 1);
        setSubmitError("");
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Fonction pour déterminer si une erreur doit être signalée (erreurs techniques uniquement)
  const shouldReportError = (errorMessage) => {
    if (!errorMessage) return false;

    const errorLower = errorMessage.toLowerCase();

    // Erreurs techniques à signaler
    const technicalErrorKeywords = [
      "syntheticbaseevent",
      "invalid input: expected",
      "received",
      "type error",
      "undefined",
      "null",
      "[object object]",
      "cannot read",
      "is not defined",
    ];

    // Vérifier si c'est une erreur technique
    const isTechnicalError = technicalErrorKeywords.some((keyword) =>
      errorLower.includes(keyword),
    );

    // Ne pas signaler les erreurs de validation normales (format, longueur, etc.)
    const normalValidationKeywords = [
      "doit être",
      "doit contenir",
      "est obligatoire",
      "est trop",
      "format",
      "invalide",
      "exemple",
      "maximum",
      "minimum",
      "caractères",
    ];

    const isNormalValidation = normalValidationKeywords.some((keyword) =>
      errorLower.includes(keyword),
    );

    // Signaler uniquement les erreurs techniques, pas les erreurs de validation normales
    return isTechnicalError && !isNormalValidation;
  };

  // Fonction pour signaler les erreurs de validation au Dashboard
  const reportValidationError = async (fieldName, errorMessage) => {
    // Ne signaler que les erreurs techniques
    if (!shouldReportError(errorMessage)) {
      return;
    }

    // Éviter de signaler plusieurs fois la même erreur
    const errorKey = `${fieldName}-${errorMessage}`;
    if (errorReported[errorKey]) {
      return;
    }

    try {
      await fetch("/api/report-validation-error", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          field: fieldName,
          error: errorMessage,
          formData: form.getValues(),
          userAgent: navigator.userAgent,
          url: window.location.href,
          timestamp: new Date().toISOString(),
        }),
      });

      // Marquer l'erreur comme signalée
      setErrorReported((prev) => ({ ...prev, [errorKey]: true }));
    } catch (error) {
      console.error("Erreur lors du signalement:", error);
      // Ne pas bloquer l'utilisateur si le signalement échoue
    }
  };

  // Composant FormMessage personnalisé avec signalement automatique
  const ContactFormMessage = ({ fieldName }) => {
    const formContext = useFormContext();
    const error = formContext?.formState?.errors?.[fieldName];
    const errorMessage = error ? String(error?.message ?? "") : null;
    const isReported = errorMessage
      ? errorReported[`${fieldName}-${errorMessage}`]
      : false;

    // Signaler l'erreur automatiquement
    React.useEffect(() => {
      if (errorMessage && !isReported) {
        reportValidationError(fieldName, errorMessage);
      }
    }, [errorMessage, fieldName, isReported]);

    if (!errorMessage) {
      return null;
    }

    return (
      <div className="space-y-1">
        <p className="text-sm font-medium text-red-400 mt-1 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>{errorMessage}</span>
        </p>
        {isReported && (
          <p className="text-xs text-dk-yellow/80 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Cette erreur a été signalée à l'administration</span>
          </p>
        )}
      </div>
    );
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Nettoyer le numéro de téléphone avant l'envoi
      const cleanedPhone = data.phone.replace(/[\s.\-]/g, "");
      const dataToSend = {
        ...data,
        phone: cleanedPhone,
      };

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      let responseData;
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Erreur HTTP ${response.status}`);
      }

      if (response.ok) {
        setIsSubmitted(true);
        form.reset();
      } else {
        const errorMessage = responseData.details
          ? responseData.details.map((err) => err.msg).join(", ")
          : responseData.message || "Erreur lors de l'envoi du formulaire";
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Erreur:", error);
      let errorMessage =
        "Erreur lors de l'envoi du formulaire. Veuillez réessayer.";

      if (error.message) {
        errorMessage = error.message;
      } else if (
        error.name === "TypeError" &&
        error.message.includes("fetch")
      ) {
        errorMessage =
          "Erreur de connexion. Vérifiez votre connexion internet et réessayez. Si le problème persiste, contactez-nous directement au +33 7 68 11 38 39.";
      } else if (error.name === "AbortError") {
        errorMessage =
          "La requête a expiré. Réessayez dans quelques instants. Si le problème persiste, contactez-nous directement.";
      }

      setSubmitError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, gsapUtils.fadeInUp(titleRef.current), {
          y: 0,
          opacity: 1,
          scrollTrigger: {
            trigger: titleRef.current,
            ...scrollTriggerDefaults,
          },
        });
      }

      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          gsapUtils.slideInLeft(formRef.current, 0.2),
          {
            x: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: formRef.current,
              ...scrollTriggerDefaults,
            },
          },
        );
      }

      if (contactInfoRef.current) {
        gsap.fromTo(
          contactInfoRef.current,
          gsapUtils.slideInRight(contactInfoRef.current, 0.4),
          {
            x: 0,
            opacity: 1,
            scrollTrigger: {
              trigger: contactInfoRef.current,
              ...scrollTriggerDefaults,
            },
          },
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Animation des cartes de types de projets (uniquement à l'étape 1)
  useLayoutEffect(() => {
    if (currentStep !== 1 || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      projectTypesRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(
            card,
            gsapUtils.fadeInUp(card, index * motionTokens.stagger.normal),
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                ...scrollTriggerDefaults,
              },
            },
          );

          const handleMouseEnter = () => {
            gsap.to(card, gsapUtils.hoverScale(card));
          };

          const handleMouseLeave = () => {
            gsap.to(card, gsapUtils.hoverReset(card));
          };

          card.addEventListener("mouseenter", handleMouseEnter);
          card.addEventListener("mouseleave", handleMouseLeave);
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [currentStep]);

  if (isSubmitted) {
    return (
      <section ref={sectionRef} className="py-40 bg-dk-black-animated">
        <div className="container-custom section-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-dk-yellow to-yellow-300 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-dk-black" />
            </div>
            <h2 className="text-4xl font-foundation-black mb-6 text-white">
              Demande envoyée avec succès !
            </h2>
            <p className="text-xl text-dk-gray-300 mb-4">
              Merci pour votre demande. Notre équipe vous contactera dans les
              plus brefs délais (généralement sous 24h) pour discuter de votre
              projet et vous proposer un devis personnalisé.
            </p>
            <p className="text-lg text-dk-gray-400 mb-8">
              En attendant, découvrez nos réalisations ou consultez nos
              services.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                form.reset();
                setSubmitError("");
              }}
              className="btn-primary"
            >
              Faire une autre demande
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-40 bg-dk-black-animated"
    >
      <style>{contactGridStyles}</style>
      <div className="container-custom section-padding">
        {/* Titre de section */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-white text-clamp-3xl xs:text-clamp-4xl sm:text-clamp-5xl lg:text-clamp-6xl font-foundation-black mb-4 xs:mb-6">
            DEMANDEZ VOTRE <span className="text-gradient">DEVIS GRATUIT</span>
          </h2>
          <p className="text-clamp-lg xs:text-clamp-xl text-dk-gray-300 max-w-3xl mx-auto">
            Obtenez un devis personnalisé pour votre projet de construction
            métallique
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 xs:gap-6 sm:gap-8 lg:gap-16">
          {/* Formulaire */}
          <div ref={formRef}>
            <FormProvider {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Indicateur de progression */}
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between mb-6 xs:mb-8 space-y-4 xs:space-y-0">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`w-8 h-8 xs:w-10 xs:h-10 rounded-full flex items-center justify-center text-xs xs:text-sm font-medium ${
                          currentStep >= step.id
                            ? "bg-dk-yellow text-dk-black"
                            : "bg-dk-gray-800 text-dk-gray-400"
                        }`}
                      >
                        {currentStep > step.id ? (
                          <Check className="w-4 h-4 xs:w-5 xs:h-5" />
                        ) : (
                          step.id
                        )}
                      </div>
                      <div className="ml-2 xs:ml-3">
                        <div
                          className={`text-xs xs:text-sm font-medium ${
                            currentStep >= step.id
                              ? "text-white"
                              : "text-dk-gray-400"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-xs text-dk-gray-500 hidden xs:block">
                          {step.description}
                        </div>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`hidden xs:block w-6 xs:w-8 h-0.5 mx-2 xs:mx-4 ${
                            currentStep > step.id
                              ? "bg-dk-yellow"
                              : "bg-dk-gray-800"
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Message d'erreur général */}
                {submitError && (
                  <div
                    className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400"
                    role="alert"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium mb-1">
                          {submitError}
                        </p>
                        <p className="text-xs text-red-400/80">
                          Si le problème persiste, contactez-nous directement au{" "}
                          <a
                            href="tel:+33768113839"
                            className="underline hover:text-red-300"
                          >
                            +33 7 68 11 38 39
                          </a>{" "}
                          ou par e-mail à{" "}
                          <a
                            href="mailto:contact@dkbuilding.fr"
                            className="underline hover:text-red-300"
                          >
                            contact@dkbuilding.fr
                          </a>
                          .
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Étape 1: Type de projet */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <h3 className="text-xl xs:text-2xl font-foundation-bold text-white mb-4 xs:mb-6">
                      QUEL TYPE DE PROJET SOUHAITEZ-VOUS RÉALISER ?
                    </h3>
                    <FormField
                      control={form.control}
                      name="projectType"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="contact-project-types-grid w-full">
                              {projectTypes.map((type, index) => (
                                <label
                                  key={type.id}
                                  ref={(el) =>
                                    (projectTypesRef.current[index] = el)
                                  }
                                  className={`group w-full p-4 xs:p-5 sm:p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 touch-target bg-dk-gray-900/30 backdrop-blur-sm ${
                                    field.value === type.id
                                      ? "border-dk-yellow bg-dk-yellow/10 shadow-lg shadow-dk-yellow/20"
                                      : form.formState.errors.projectType
                                        ? "border-red-500/50 hover:border-red-500/70"
                                        : "border-dk-gray-800 hover:border-dk-gray-700 hover:bg-dk-gray-900/50"
                                  }`}
                                  aria-label={`Sélectionner ${type.label}`}
                                >
                                  <input
                                    type="radio"
                                    {...field}
                                    value={type.id}
                                    checked={field.value === type.id}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className="sr-only"
                                    aria-describedby={`project-type-${type.id}-desc`}
                                  />
                                  <div
                                    className={`font-foundation-bold text-white mb-1 xs:mb-2 text-base xs:text-lg sm:text-xl transition-colors ${
                                      field.value === type.id
                                        ? "text-dk-yellow"
                                        : ""
                                    }`}
                                  >
                                    {type.label}
                                  </div>
                                  <div
                                    id={`project-type-${type.id}-desc`}
                                    className="text-xs xs:text-sm sm:text-base text-dk-gray-400 leading-relaxed"
                                  >
                                    {type.description}
                                  </div>
                                </label>
                              ))}
                            </div>
                          </FormControl>
                          <ContactFormMessage fieldName="projectType" />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Étape 2: Détails du projet */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-foundation-bold text-white mb-6">
                      DÉTAILS DE VOTRE PROJET
                    </h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="projectDetails"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>DESCRIPTION DU PROJET</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Ex: Construction d'un entrepôt de 500m² avec charpente métallique et bardage"
                                className="min-h-[3.25rem] resize-y"
                                style={{ overflowY: "auto" }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                  const textarea = e.target;
                                  textarea.style.height = "auto";
                                  const minHeight =
                                    parseFloat(
                                      getComputedStyle(textarea).lineHeight,
                                    ) || 24;
                                  const padding =
                                    parseFloat(
                                      getComputedStyle(textarea).paddingTop,
                                    ) +
                                      parseFloat(
                                        getComputedStyle(textarea)
                                          .paddingBottom,
                                      ) || 24;
                                  textarea.style.height = `${Math.max(minHeight + padding, textarea.scrollHeight)}px`;
                                }}
                              />
                            </FormControl>
                            <ContactFormMessage fieldName="projectDetails" />
                          </FormItem>
                        )}
                      />
                      <div className="contact-details-grid w-full">
                        <FormField
                          control={form.control}
                          name="surface"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SURFACE (m²)</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="500"
                                  onChange={(e) => {
                                    let value = e.target.value;
                                    // Supprimer les zéros non significatifs à gauche
                                    if (value && value.trim() !== "") {
                                      // Si la valeur contient des zéros à gauche suivis de chiffres non nuls
                                      if (/^0+[1-9]/.test(value)) {
                                        // Convertir en nombre pour supprimer automatiquement les zéros à gauche
                                        const numValue = parseFloat(value);
                                        if (!isNaN(numValue)) {
                                          value = numValue.toString();
                                        }
                                      }
                                      // Si c'est juste "0" ou "00", etc., on garde tel quel (sera validé par Zod)
                                    }
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <FormDescription>
                                En mètres carrés. Cette information nous aide à
                                estimer au mieux votre projet et vous proposer
                                un devis précis.
                              </FormDescription>
                              <ContactFormMessage fieldName="surface" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="deadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>DÉLAI SOUHAITÉ</FormLabel>
                              <FormControl>
                                <Select
                                  {...field}
                                  value={field.value || ""}
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(
                                      value === "" ? undefined : value,
                                    );
                                  }}
                                >
                                  <option value="">
                                    Sélectionnez un délai
                                  </option>
                                  <option value="urgent">
                                    Urgent (moins d'1 mois)
                                  </option>
                                  <option value="1-3mois">1 à 3 mois</option>
                                  <option value="3-6mois">3 à 6 mois</option>
                                  <option value="6mois+">Plus de 6 mois</option>
                                </Select>
                              </FormControl>
                              <FormDescription>
                                Indiquez votre délai idéal pour que nous
                                puissions planifier au mieux et vous proposer
                                une date d'intervention adaptée.
                              </FormDescription>
                              <ContactFormMessage fieldName="deadline" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>LOCALISATION DU PROJET</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="text"
                                placeholder="Albi, Tarn"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              La localisation nous permet d'organiser
                              l'intervention et d'estimer les frais de
                              déplacement si nécessaire.
                            </FormDescription>
                            <ContactFormMessage fieldName="location" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Étape 3: Informations de contact */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-foundation-bold text-white mb-6">
                      VOS INFORMATIONS DE CONTACT
                    </h3>
                    <div className="space-y-4">
                      <div className="contact-info-grid w-full">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>NOM COMPLET *</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="text"
                                  placeholder="Jean Dupont"
                                  onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                  }}
                                />
                              </FormControl>
                              <ContactFormMessage fieldName="name" />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>TÉLÉPHONE *</FormLabel>
                              <FormControl>
                                <div className="phone-input-wrapper">
                                  <PhoneInput
                                    international
                                    defaultCountry="FR"
                                    value={field.value}
                                    onChange={(value) => {
                                      if (value) {
                                        // Nettoyer le numéro pour vérifier le format
                                        const cleaned = value.replace(
                                          /[\s.\-()]/g,
                                          "",
                                        );

                                        // Si le numéro commence par +33 suivi d'un 0
                                        if (cleaned.startsWith("+330")) {
                                          // Extraire la partie après +330
                                          const rest = cleaned.substring(4);
                                          if (rest.length > 0) {
                                            // Formater avec le 0 entre parenthèses
                                            const formatted =
                                              rest
                                                .match(/.{1,2}/g)
                                                ?.join(" ") || rest;
                                            value = `+33 (0) ${formatted}`;
                                          } else {
                                            value = "+33 (0)";
                                          }
                                        }
                                        // Si le numéro ne commence pas par + (format national français)
                                        else if (!cleaned.startsWith("+")) {
                                          // Si c'est un numéro français (commence par 0)
                                          if (cleaned.startsWith("0")) {
                                            const rest = cleaned.substring(1);
                                            if (rest.length > 0) {
                                              // Toujours des groupes de 2 chiffres, jamais de groupe de 3
                                              const formatted =
                                                rest
                                                  .match(/.{1,2}/g)
                                                  ?.join(" ") || rest;
                                              value = `0${formatted}`;
                                            } else {
                                              value = "0";
                                            }
                                          }
                                        }
                                        // Pour les autres numéros internationaux (+33 sans 0), on garde le formatage de PhoneInput
                                      }
                                      field.onChange(value);
                                    }}
                                    onBlur={field.onBlur}
                                    className="phone-input-custom"
                                    placeholder="07 68 11 38 39"
                                  />
                                </div>
                                <style>{`
                                  .phone-input-wrapper {
                                    position: relative;
                                    width: 100%;
                                  }
                                  .phone-input-custom {
                                    width: 100%;
                                    display: flex;
                                    align-items: center;
                                  }
                                  .phone-input-custom .PhoneInputInput {
                                    flex: 1;
                                    height: 2.5rem;
                                    min-width: 0;
                                    border-radius: 0.375rem;
                                    border: 1px solid rgb(31 41 55);
                                    background-color: rgba(0, 0, 0, 0.5);
                                    padding: 0.5rem 0.75rem;
                                    font-size: 0.875rem;
                                    color: white;
                                    transition: border-color 0.2s;
                                  }
                                  .phone-input-custom .PhoneInputInput:focus {
                                    outline: none;
                                    border-color: rgb(234 179 8);
                                  }
                                  .phone-input-custom .PhoneInputInput::placeholder {
                                    color: rgb(107 114 128);
                                  }
                                  .phone-input-custom .PhoneInputCountry {
                                    margin-right: 0.5rem;
                                    display: flex;
                                    align-items: center;
                                    height: 2.5rem;
                                  }
                                  .phone-input-custom .PhoneInputCountryIcon {
                                    width: 1.5rem;
                                    height: 1.5rem;
                                    border-radius: 0.25rem;
                                    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1);
                                    object-fit: cover;
                                  }
                                  .phone-input-custom .PhoneInputCountryIcon--border {
                                    border: none !important;
                                    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) !important;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelect {
                                    background-color: rgba(0, 0, 0, 0.5) !important;
                                    border: 1px solid rgb(31 41 55) !important;
                                    border-radius: 0.375rem !important;
                                    color: white !important;
                                    padding: 0.25rem 0.5rem !important;
                                    font-size: 0.875rem !important;
                                    margin-right: 0.5rem !important;
                                    cursor: pointer;
                                    transition: border-color 0.2s;
                                    height: 2.5rem;
                                    display: flex;
                                    align-items: center;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelect:focus {
                                    outline: none !important;
                                    border-color: rgb(234 179 8) !important;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelect:hover {
                                    border-color: rgb(234 179 8) !important;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelectArrow {
                                    opacity: 0.7;
                                    margin-left: 0.25rem;
                                    color: rgb(234 179 8) !important;
                                    fill: rgb(234 179 8) !important;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelectArrow--open {
                                    color: rgb(234 179 8) !important;
                                    fill: rgb(234 179 8) !important;
                                  }
                                  /* Correction pour les couleurs bleues - remplacer par jaune */
                                  .phone-input-custom .PhoneInputCountrySelect:focus,
                                  .phone-input-custom .PhoneInputCountrySelect:active {
                                    border-color: rgb(234 179 8) !important;
                                    box-shadow: 0 0 0 1px rgb(234 179 8) !important;
                                  }
                                  /* Remplacer toutes les couleurs bleues par jaune */
                                  .phone-input-custom * {
                                    --PhoneInputCountryFlagIcon-border-color: rgba(255, 255, 255, 0.1) !important;
                                  }
                                  .phone-input-custom .PhoneInputCountrySelect:focus,
                                  .phone-input-custom .PhoneInputCountrySelect:hover {
                                    border-color: rgb(234 179 8) !important;
                                  }
                                  /* S'assurer que les images de drapeaux chargent */
                                  .phone-input-custom .PhoneInputCountryIcon img,
                                  .phone-input-custom .PhoneInputCountryIcon svg {
                                    width: 100%;
                                    height: 100%;
                                    object-fit: cover;
                                    display: block;
                                  }
                                  /* Alignement vertical */
                                  .phone-input-custom .PhoneInput {
                                    display: flex;
                                    align-items: center;
                                    width: 100%;
                                  }
                                `}</style>
                              </FormControl>
                              <FormDescription>
                                Pour vous contacter rapidement concernant votre
                                projet. Nous vous rappelons généralement sous
                                24h.
                              </FormDescription>
                              <ContactFormMessage fieldName="phone" />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>EMAIL *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="email"
                                placeholder="jean.dupont@exemple.com"
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Nous ne partagerons jamais votre e-mail avec des
                              tiers. Vous recevrez uniquement nos réponses à
                              votre demande.
                            </FormDescription>
                            <ContactFormMessage fieldName="email" />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>MESSAGE SUPPLÉMENTAIRE</FormLabel>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Ex: Contraintes particulières, délais spécifiques, budget approximatif..."
                                className="min-h-[3.25rem] resize-y"
                                style={{ overflowY: "auto" }}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  field.onChange(value);
                                  const textarea = e.target;
                                  textarea.style.height = "auto";
                                  const minHeight =
                                    parseFloat(
                                      getComputedStyle(textarea).lineHeight,
                                    ) || 24;
                                  const padding =
                                    parseFloat(
                                      getComputedStyle(textarea).paddingTop,
                                    ) +
                                      parseFloat(
                                        getComputedStyle(textarea)
                                          .paddingBottom,
                                      ) || 24;
                                  textarea.style.height = `${Math.max(minHeight + padding, textarea.scrollHeight)}px`;
                                }}
                              />
                            </FormControl>
                            <FormDescription>
                              Toute information supplémentaire qui pourrait nous
                              aider à mieux comprendre votre projet
                            </FormDescription>
                            <ContactFormMessage fieldName="message" />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Boutons de navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Précédent
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      disabled={!form.watch("projectType")}
                      className="btn-primary flex items-center"
                    >
                      Continuer
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex items-center"
                    >
                      {isSubmitting
                        ? "Envoi de votre demande en cours..."
                        : "Envoyer ma demande"}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Informations de contact */}
          <div ref={contactInfoRef} className="space-y-8">
            <Card className="p-8">
              <h3 className="text-2xl font-foundation-bold mb-6 text-white">
                CONTACTEZ-NOUS DIRECTEMENT
              </h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Téléphone</p>
                    <p className="text-dk-gray-300">
                      Appelez-nous pour un devis rapide. Nous répondons
                      généralement sous 24h.
                    </p>
                    <a
                      href="tel:+33768113839"
                      className="text-dk-yellow hover:text-yellow-300 transition-colors"
                    >
                      +33 7 68 11 38 39
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <Mail className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Email</p>
                    <p className="text-dk-gray-300">
                      Envoyez-nous vos plans et photos pour un devis précis.
                      Réponse garantie sous 24h.
                    </p>
                    <a
                      href="mailto:contact@dkbuilding.fr"
                      className="text-dk-yellow hover:text-yellow-300 transition-colors"
                    >
                      contact@dkbuilding.fr
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Adresse</p>
                    <p className="text-dk-gray-300">59 Rue Pierre Cormary</p>
                    <p className="text-dk-gray-300">81000 Albi, Tarn</p>
                    <p className="text-dk-gray-300">Occitanie, France</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="w-6 h-6 text-dk-yellow mt-1 mr-4 flex-shrink-0" />
                  <div>
                    <p className="text-white font-medium">Horaires</p>
                    <p className="text-dk-gray-300">
                      Lundi - Vendredi : 8h00 - 18h00
                    </p>
                    <p className="text-dk-gray-300">Samedi : 9h00 - 12h00</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Pourquoi choisir DK BUILDING */}
            {currentStep !== 3 && (
              <Card className="bg-gradient-to-br from-dk-yellow/10 to-yellow-300/10 border-dk-yellow/20 p-8">
                <div className="flex md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-foundation-bold mb-4 text-white">
                      POURQUOI CHOISIR{" "}
                      <span className="font-foundation-black hover:text-dk-yellow">
                        DK BUILDING
                      </span>{" "}
                      ?
                    </h3>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                        <span className="text-dk-gray-300">
                          Devis gratuit et sans engagement. Vous n'avez aucune
                          obligation.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                        <span className="text-dk-gray-300">
                          Expertise technique certifiée. Des années d'expérience
                          à votre service.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                        <span className="text-dk-gray-300">
                          Matériaux de qualité premium. Des résultats durables
                          et fiables.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                        <span className="text-dk-gray-300">
                          Garantie sur tous nos travaux. Votre tranquillité est
                          notre priorité.
                        </span>
                      </li>
                      <li className="flex items-start">
                        <Check className="w-5 h-5 text-dk-yellow mt-1 mr-3 flex-shrink-0" />
                        <span className="text-dk-gray-300">
                          Intervention dans toute la France. Où que vous soyez,
                          nous intervenons.
                        </span>
                      </li>
                    </ul>
                    <div className="mt-6 p-4 bg-dk-yellow/5 rounded-lg border border-dk-yellow/20">
                      <p className="text-sm text-dk-gray-300">
                        <strong className="text-dk-yellow">
                          Réponse sous 24h.
                        </strong>{" "}
                        Devis gratuit et sans engagement.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
