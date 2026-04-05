import { useLayoutEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gsap, ScrollTrigger } from "../../../utils/gsapConfig";
import {
  motionTokens,
  gsapUtils,
  scrollTriggerDefaults,
} from "../../../utils/motion";
import {
  ChevronRight,
  ChevronLeft,
  Check,
} from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Button } from "../../ui/button";
import { FormProvider } from "../../ui/form";

import { contactFormSchema, PROJECT_TYPES, FORM_STEPS } from "./contactSchema";
import ContactStepProgress from "./ContactStepProgress";
import ContactSidebar from "./ContactSidebar";
import ProjectTypeStep from "./steps/ProjectTypeStep";
import ProjectDetailsStep from "./steps/ProjectDetailsStep";
import ContactInfoStep from "./steps/ContactInfoStep";


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

  // Valeurs surveillées pour l'ajustement des textareas
  const watchedProjectDetails = form.watch("projectDetails");
  const watchedMessage = form.watch("message");

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
  }, [watchedProjectDetails, watchedMessage, currentStep]);

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

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Nettoyer le numéro de téléphone avant l'envoi
      const cleanedPhone = data.phone.replace(/[\s.-]/g, "");
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

  // Animation GSAP principale
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Afficher les éléments directement sans animation
      if (titleRef.current) gsap.set(titleRef.current, { opacity: 1, y: 0 });
      if (formRef.current) gsap.set(formRef.current, { opacity: 1, x: 0 });
      if (contactInfoRef.current) gsap.set(contactInfoRef.current, { opacity: 1, x: 0 });
      return;
    }

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Afficher les éléments directement sans animation
      projectTypesRef.current.forEach((card) => {
        if (card) gsap.set(card, { opacity: 1, y: 0, scale: 1 });
      });
      return;
    }

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
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/#portfolio"
                className="btn btn-primary touch-target font-foundation-black"
              >
                Découvrir nos réalisations
              </a>
              <Button
                onClick={() => {
                  setIsSubmitted(false);
                  setCurrentStep(1);
                  form.reset();
                  setSubmitError("");
                }}
                className="btn-secondary touch-target"
              >
                Faire une autre demande
              </Button>
            </div>
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
                <ContactStepProgress
                  currentStep={currentStep}
                  steps={FORM_STEPS}
                />

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
                  <ProjectTypeStep
                    form={form}
                    projectTypes={PROJECT_TYPES}
                    projectTypesRef={projectTypesRef}
                    reportValidationError={reportValidationError}
                    errorReported={errorReported}
                  />
                )}

                {/* Étape 2: Détails du projet */}
                {currentStep === 2 && (
                  <ProjectDetailsStep
                    form={form}
                    reportValidationError={reportValidationError}
                    errorReported={errorReported}
                  />
                )}

                {/* Étape 3: Informations de contact */}
                {currentStep === 3 && (
                  <ContactInfoStep
                    form={form}
                    reportValidationError={reportValidationError}
                    errorReported={errorReported}
                  />
                )}

                {/* Boutons de navigation */}
                <div className="flex flex-col xs:flex-row justify-between gap-3 pt-6">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="flex items-center touch-target order-2 xs:order-1"
                  >
                    <ChevronLeft className="w-5 h-5 mr-2" />
                    Précédent
                  </Button>

                  {currentStep < 3 ? (
                    <div className="flex flex-col items-end order-1 xs:order-2">
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!form.watch("projectType") && currentStep === 1}
                        className="btn-primary flex items-center touch-target"
                      >
                        {currentStep === 1 ? "Détailler mon projet" : "Finaliser ma demande"}
                        <ChevronRight className="w-5 h-5 ml-2" />
                      </Button>
                      {currentStep === 1 && !form.watch("projectType") && (
                        <p className="text-xs text-dk-gray-400 mt-2">
                          Sélectionnez un type de projet pour continuer
                        </p>
                      )}
                    </div>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary flex items-center touch-target order-1 xs:order-2"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-dk-black mr-2" />
                          Envoi en cours...
                        </>
                      ) : (
                        "Envoyer ma demande de devis"
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </FormProvider>
          </div>

          {/* Informations de contact */}
          <ContactSidebar
            currentStep={currentStep}
            contactInfoRef={contactInfoRef}
          />
        </div>
      </div>
    </section>
  );
};

export default Contact;
