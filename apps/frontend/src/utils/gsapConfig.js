import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { initRefreshRateDetection, getRefreshRate, getFrameDuration } from './displayRefreshRate';
import { log } from './logger';

let isInitialized = false;

/**
 * Initialise GSAP avec la configuration optimale pour le taux de rafraîchissement natif
 */
export const initGSAP = async () => {
  if (isInitialized || typeof window === 'undefined') return;
  
  // Détecter le taux de rafraîchissement
  await initRefreshRateDetection();
  const refreshRate = getRefreshRate();
  const frameDuration = getFrameDuration();
  
  // Enregistrer les plugins GSAP
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  
  // Configuration GSAP pour utiliser le taux de rafraîchissement natif
  // GSAP utilise déjà requestAnimationFrame par défaut, mais on peut optimiser :
  
  // 1. Configurer le ticker pour utiliser le taux de rafraîchissement natif
  // Le ticker de GSAP utilise déjà requestAnimationFrame qui s'adapte automatiquement
  // au taux de rafraîchissement du navigateur/système
  if (gsap.ticker && typeof gsap.ticker.lagSmoothing === 'function') {
    gsap.ticker.lagSmoothing(0); // Désactiver le lag smoothing pour une synchronisation parfaite
  }
  
  // 2. Configurer ScrollTrigger pour une meilleure performance
  if (ScrollTrigger && typeof ScrollTrigger.config === 'function') {
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
      ignoreMobileResize: true,
    });
  }
  
  // 3. GSAP utilise déjà requestAnimationFrame qui s'adapte automatiquement
  // au taux de rafraîchissement natif (60Hz, 120Hz, 144Hz, etc.)
  // Aucune configuration supplémentaire nécessaire, RAF gère cela nativement
  
  // Log en développement pour vérification
  log(`[GSAP] Initialisé avec taux de rafraîchissement: ${refreshRate}Hz (${frameDuration.toFixed(2)}ms/frame)`);
  
  isInitialized = true;
  
  return {
    refreshRate,
    frameDuration,
    gsap,
    ScrollTrigger,
    ScrollToPlugin
  };
};

/**
 * Obtient la configuration GSAP actuelle
 */
export const getGSAPConfig = () => {
  return {
    refreshRate: getRefreshRate(),
    frameDuration: getFrameDuration(),
    isInitialized
  };
};

// Export direct de GSAP et plugins pour usage dans les composants
export { gsap, ScrollTrigger, ScrollToPlugin };

