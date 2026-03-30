import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import ContactFormMessage from "../ContactFormMessage";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const phoneInputStyles = `
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
`;

const ContactInfoStep = ({ form, reportValidationError, errorReported }) => {
  return (
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
                <ContactFormMessage
                  fieldName="name"
                  reportValidationError={reportValidationError}
                  errorReported={errorReported}
                />
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
                  <style>{phoneInputStyles}</style>
                </FormControl>
                <FormDescription>
                  Pour vous contacter rapidement concernant votre
                  projet. Nous vous rappelons généralement sous
                  24h.
                </FormDescription>
                <ContactFormMessage
                  fieldName="phone"
                  reportValidationError={reportValidationError}
                  errorReported={errorReported}
                />
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
              <ContactFormMessage
                fieldName="email"
                reportValidationError={reportValidationError}
                errorReported={errorReported}
              />
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
              <ContactFormMessage
                fieldName="message"
                reportValidationError={reportValidationError}
                errorReported={errorReported}
              />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default ContactInfoStep;
