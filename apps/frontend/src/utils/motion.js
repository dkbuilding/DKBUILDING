import { getFrameDuration } from './displayRefreshRate';

// Motion tokens pour DK BUILDING
export const motionTokens = {
  // Durées (adaptées au taux de rafraîchissement natif)
  durations: {
    fast: 0.3,
    normal: 0.6,
    slow: 0.9,
    hero: 1.2,
  },
  
  // Durée d'une frame (synchronisée avec le taux de rafraîchissement)
  // Fonction pour obtenir la valeur actuelle (peut changer après détection)
  get frameDuration() {
    return getFrameDuration();
  },
  
  // Easing
  easing: {
    smooth: "power3.out",
    bounce: "power2.out",
    elastic: "elastic.out(1, 0.3)",
  },
  
  // Distances
  distances: {
    small: 20,
    medium: 40,
    large: 80,
  },
  
  // Délais stagger
  stagger: {
    fast: 0.1,
    normal: 0.2,
    slow: 0.3,
  }
};

// Utilitaires GSAP
export const gsapUtils = {
  // Animation d'entrée fade + slide
  fadeInUp: (element, delay = 0) => ({
    y: motionTokens.distances.medium,
    opacity: 0,
    duration: motionTokens.durations.normal,
    delay,
    ease: motionTokens.easing.smooth,
  }),
  
  // Animation scale + fade
  scaleIn: (element, delay = 0) => ({
    scale: 0.8,
    opacity: 0,
    duration: motionTokens.durations.normal,
    delay,
    ease: motionTokens.easing.smooth,
  }),
  
  // Animation slide horizontal
  slideInLeft: (element, delay = 0) => ({
    x: -motionTokens.distances.large,
    opacity: 0,
    duration: motionTokens.durations.normal,
    delay,
    ease: motionTokens.easing.smooth,
  }),
  
  slideInRight: (element, delay = 0) => ({
    x: motionTokens.distances.large,
    opacity: 0,
    duration: motionTokens.durations.normal,
    delay,
    ease: motionTokens.easing.smooth,
  }),
  
  // Animation hero
  heroEntrance: (element, delay = 0) => ({
    y: motionTokens.distances.large,
    opacity: 0,
    scale: 0.9,
    duration: motionTokens.durations.hero,
    delay,
    ease: motionTokens.easing.smooth,
  }),
  
  // Animation parallax
  parallax: (_element, speed = 0.5) => ({
    y: () => window.innerHeight * speed,
    ease: "none",
  }),
  
  // Animation hover
  hoverScale: () => ({
    scale: 1.05,
    duration: motionTokens.durations.fast,
    ease: motionTokens.easing.smooth,
  }),
  
  hoverReset: () => ({
    scale: 1,
    duration: motionTokens.durations.fast,
    ease: motionTokens.easing.smooth,
  }),
};

// Configuration ScrollTrigger par défaut
export const scrollTriggerDefaults = {
  start: "top 80%",
  end: "bottom 20%",
  toggleActions: "play none none reverse",
  markers: false, // A désactiver en production
};

// Configuration ScrollTrigger pour parallax
export const parallaxConfig = {
  start: "top bottom",
  end: "bottom top",
  scrub: true,
  invalidateOnRefresh: true,
};
