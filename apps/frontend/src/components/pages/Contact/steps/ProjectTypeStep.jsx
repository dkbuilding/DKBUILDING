import {
  FormField,
  FormItem,
  FormControl,
} from "../../../ui/form";
import ContactFormMessage from "../ContactFormMessage";

const ProjectTypeStep = ({
  form,
  projectTypes,
  projectTypesRef,
  reportValidationError,
  errorReported,
}) => {
  return (
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
            <ContactFormMessage
              fieldName="projectType"
              reportValidationError={reportValidationError}
              errorReported={errorReported}
            />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ProjectTypeStep;
