import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import App from "./App.jsx";
import { initGSAP } from "./utils/gsapConfig";

// Configuration "GovTech" du QueryClient
// Pas de refetch agressif pour éviter de spammer le backend,
// mais un cache intelligent pour une UX fluide
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Les données sont fraîches pendant 5 minutes
      retry: 1, // On réessaie une fois en cas d'erreur réseau
      refetchOnWindowFocus: false, // Évite les clignotements inutiles
    },
  },
});

// Configuration pour supprimer les alertes React liées à GSAP
// TEMPORARILY DISABLED TO DEBUG
/*
if (import.meta.env.DEV) {
  // Supprimer l'alerte React pour onselectstart (propriété DOM native utilisée par GSAP)
  const originalError = console.error;
  console.error = (...args) => {
    if (typeof args[0] === 'string' && 
        (args[0].includes('onSelectStart') || 
         args[0].includes('Unknown event handler property'))) {
      return; // Ignorer ces alertes spécifiques de GSAP
    }
    originalError.apply(console, args);
  };
}
*/

// Rendre React IMMÉDIATEMENT pour que le preloader s'affiche tout de suite
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      {/* DevTools pour visualiser le cache en développement */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  </StrictMode>,
);

// Initialiser GSAP en parallèle (non-bloquant) après le rendu
// Le preloader sera déjà visible pendant l'initialisation
initGSAP().catch((error) => {
  if (import.meta.env.DEV) {
    console.warn(
      "[GSAP] Erreur lors de l'initialisation (non-bloquant):",
      error,
    );
  }
});
