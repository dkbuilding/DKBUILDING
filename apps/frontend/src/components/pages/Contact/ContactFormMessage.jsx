import * as React from "react";
import { useFormContext } from "../../ui/form";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const ContactFormMessage = React.memo(
  ({ fieldName, reportValidationError, errorReported }) => {
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
    }, [errorMessage, fieldName, isReported, reportValidationError]);

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
  },
);

ContactFormMessage.displayName = "ContactFormMessage";

export default ContactFormMessage;
