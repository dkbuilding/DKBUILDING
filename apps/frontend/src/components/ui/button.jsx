import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

/**
 * Variantes du bouton via CVA (class-variance-authority)
 * Source unique pour toutes les combinaisons variant x size x state
 */
const buttonVariants = cva(
  // Base commune
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-md text-sm font-semibold",
    "transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dk-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dk-black",
    "disabled:pointer-events-none disabled:opacity-50",
    "cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-dk-yellow text-dk-black",
          "hover:bg-dk-yellow-300",
          "active:bg-dk-yellow-600",
        ],
        destructive: [
          "bg-dk-error text-white",
          "hover:bg-red-600",
          "active:bg-red-700",
        ],
        outline: [
          "border-2 border-dk-yellow text-dk-yellow bg-transparent",
          "hover:bg-dk-yellow hover:text-dk-black",
          "active:bg-dk-yellow-600 active:text-dk-black",
        ],
        secondary: [
          "bg-dk-gray-800 text-white border border-dk-gray-700",
          "hover:bg-dk-gray-700",
          "active:bg-dk-gray-600",
        ],
        ghost: [
          "text-dk-yellow bg-transparent",
          "hover:bg-dk-yellow/10",
          "active:bg-dk-yellow/20",
        ],
        link: [
          "text-dk-yellow underline-offset-4 bg-transparent",
          "hover:underline",
        ],
      },
      size: {
        xs: "h-8 px-2.5 text-xs rounded-sm",
        sm: "h-9 px-3 text-sm rounded-md",
        default: "h-10 px-4 py-2 text-sm",
        lg: "h-11 px-6 text-base rounded-md",
        xl: "h-12 px-8 text-base font-bold rounded-lg",
        icon: "h-10 w-10 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/**
 * Composant Button — Design System DK BUILDING
 * 
 * @param {Object} props
 * @param {"default"|"destructive"|"outline"|"secondary"|"ghost"|"link"} props.variant
 * @param {"xs"|"sm"|"default"|"lg"|"xl"|"icon"} props.size
 * @param {boolean} props.loading - Affiche un spinner et desactive le bouton
 * @param {string} props.className - Classes supplementaires
 */
const Button = React.forwardRef(
  (
    {
      className,
      variant = "default",
      size = "default",
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          loading && "relative pointer-events-none",
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        {loading && (
          <span
            className="absolute inset-0 flex items-center justify-center"
            aria-hidden="true"
          >
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </span>
        )}
        <span className={cn(loading && "invisible")}>{children}</span>
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
