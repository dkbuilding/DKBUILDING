import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
} from "../../../ui/form";
import { Input } from "../../../ui/input";
import { Textarea } from "../../../ui/textarea";
import { Select } from "../../../ui/select";
import ContactFormMessage from "../ContactFormMessage";

const ProjectDetailsStep = ({ form, reportValidationError, errorReported }) => {
  return (
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
              <ContactFormMessage
                fieldName="projectDetails"
                reportValidationError={reportValidationError}
                errorReported={errorReported}
              />
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
                <ContactFormMessage
                  fieldName="surface"
                  reportValidationError={reportValidationError}
                  errorReported={errorReported}
                />
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
                <ContactFormMessage
                  fieldName="deadline"
                  reportValidationError={reportValidationError}
                  errorReported={errorReported}
                />
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
              <ContactFormMessage
                fieldName="location"
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

export default ProjectDetailsStep;
