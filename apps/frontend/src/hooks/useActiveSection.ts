import { useState, useEffect } from 'react';

/**
 * Hook pour détecter la section active basée sur la position de scroll
 * @param sectionIds - Array des IDs des sections à surveiller
 * @param offset - Offset en pixels pour ajuster la détection (défaut: -100)
 * @returns {string} activeSection - ID de la section actuellement active
 */
export const useActiveSection = (sectionIds: string[] = [], offset: number = -100): string => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const handleScroll = (): void => {
      const scrollPosition = window.scrollY + offset;
      
      // Trouver la section la plus proche du haut de la page
      let currentSection = sectionIds[0];
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const element = document.getElementById(sectionIds[i]);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = sectionIds[i];
          break;
        }
      }
      
      setActiveSection(currentSection);
    };

    // Vérifier immédiatement au montage
    handleScroll();

    // Écouter les événements de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [sectionIds, offset]);

  return activeSection;
};

/**
 * Hook pour détecter la section active avec intersection observer
 * Plus performant pour les pages avec beaucoup de contenu
 */
export const useActiveSectionIntersection = (sectionIds: string[] = []): string => {
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Section considérée active quand elle est dans le tiers supérieur
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observer toutes les sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds]);

  return activeSection;
};
