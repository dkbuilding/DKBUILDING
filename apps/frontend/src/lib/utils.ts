import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine class names avec Tailwind merge pour résoudre les conflits
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
