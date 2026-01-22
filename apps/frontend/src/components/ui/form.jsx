import * as React from "react";
import { useFormContext, FormProvider } from "react-hook-form";
import { cn } from "../../lib/utils";

const Form = ({ children, ...formProps }) => {
  return <FormProvider {...formProps}>{children}</FormProvider>;
};

const FormFieldContext = React.createContext(undefined);

const FormField = ({ name, render }) => {
  const form = useFormContext();
  const field = {
    name,
    value: form.watch(name),
    onChange: (value) => form.setValue(name, value, { shouldValidate: true }),
    onBlur: () => form.trigger(name),
  };
  const fieldState = {
    error: form.formState.errors[name],
    isDirty: form.formState.dirtyFields[name],
    isTouched: form.formState.touchedFields[name],
  };
  return (
    <FormFieldContext.Provider value={{ name }}>
      {render({ field, fieldState, form })}
    </FormFieldContext.Provider>
  );
};

const FormItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("space-y-2", className)} {...props} />
  );
});
FormItem.displayName = "FormItem";

const FormLabel = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-dk-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef(({ ...props }, ref) => {
  return <div ref={ref} {...props} />;
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-dk-gray-400", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  const form = useFormContext();
  const fieldContext = React.useContext(FormFieldContext);
  const name = fieldContext?.name;
  const error = name ? form?.formState?.errors?.[name] : null;
  const body = error ? String(error?.message ?? "") : null;

  if (!body) {
    return null;
  }

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-red-400 mt-1", className)}
      {...props}
    >
      {body}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormProvider,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormContext,
};

