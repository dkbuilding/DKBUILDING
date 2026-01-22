import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { ScrollTrigger, ScrollToPlugin } from '../utils/gsapConfig';
import { scroll as logScroll, nav as logNav } from '../utils/logger';

/**
 * Hook ultra-simple pour la navigation entre sections
 * Utilise directement les IDs des sections sans détection complexe
 */
export const useSmartNavigation = () => {
  const isScrollingRef = useRef(false);
  const [currentSection, setCurrentSection] = useState(0);

  // Ordre des sections défini explicitement
  const sections = useMemo(() => [
    { id: 'home', name: 'Accueil' },
    { id: 'news', name: 'Actualités' },
    { id: 'services', name: 'Services' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'about', name: 'À propos' },
    { id: 'contact', name: 'Contact' }
  ], []);

  /**
   * Trouve l'index de la section actuelle basé sur la position de scroll
   */
  const getCurrentSectionIndex = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Logs de scroll désactivés par défaut (trop verbeux)
    // Activer avec ENABLE_SCROLL_LOGS=true en développement si besoin
    logScroll(`ScrollY: ${scrollY}, WindowHeight: ${windowHeight}`);
    
    // Si on est tout en haut, on est sur la première section
    if (scrollY < windowHeight * 0.5) {
      logScroll('Section actuelle: 0 (home)');
      setCurrentSection(0);
      return 0;
    }
    
    // Sinon, trouver quelle section est la plus proche du haut de la fenêtre
    for (let i = 0; i < sections.length; i++) {
      const section = document.getElementById(sections[i].id);
      if (!section) continue;
      
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + scrollY;
      
      logScroll(`Section ${i} (${sections[i].id}): top=${sectionTop}, rect.top=${rect.top}`);
      
      // Si le haut de la section est proche du haut de la fenêtre
      if (rect.top <= windowHeight * 0.2) {
        logScroll(`Section actuelle: ${i} (${sections[i].id})`);
        setCurrentSection(i);
        return i;
      }
    }
    
    logScroll('Aucune section détectée, retour à 0');
    setCurrentSection(0);
    return 0;
  }, [sections]);

  /**
   * Met à jour la section actuelle en temps réel
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!isScrollingRef.current) {
        getCurrentSectionIndex();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getCurrentSectionIndex]);

  /**
   * Navigation vers la section suivante
   */
  const scrollToNextSection = useCallback(() => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    const nextIndex = currentIndex + 1;
    
    logNav(`Navigation: ${currentIndex} → ${nextIndex}`);
    
    if (nextIndex < sections.length) {
      const nextSectionId = sections[nextIndex].id;
      const nextSection = document.getElementById(nextSectionId);
      
      if (nextSection) {
        logNav(`Navigation vers: ${nextSectionId}`);
        isScrollingRef.current = true;
        
        // Utiliser scrollIntoView simple
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Réinitialiser le flag après un délai
        setTimeout(() => {
          isScrollingRef.current = false;
          logNav('Navigation terminée');
        }, 1000);
      } else {
        logNav(`Section ${nextSectionId} non trouvée`);
      }
    } else {
      logNav('Pas de section suivante');
    }
  }, [sections, getCurrentSectionIndex]);

  /**
   * Navigation vers la section précédente
   */
  const scrollToPreviousSection = useCallback(() => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    const prevIndex = currentIndex - 1;
    
    logNav(`Navigation: ${currentIndex} → ${prevIndex}`);
    
    if (prevIndex >= 0) {
      const prevSectionId = sections[prevIndex].id;
      const prevSection = document.getElementById(prevSectionId);
      
      if (prevSection) {
        logNav(`Navigation vers: ${prevSectionId}`);
        isScrollingRef.current = true;
        
        prevSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        setTimeout(() => {
          isScrollingRef.current = false;
          logNav('Navigation terminée');
        }, 1000);
      } else {
        logNav(`Section ${prevSectionId} non trouvée`);
      }
    } else {
      logNav('Pas de section précédente');
    }
  }, [sections, getCurrentSectionIndex]);

  /**
   * Navigation directe vers une section par ID
   */
  const scrollToSectionById = useCallback((sectionId) => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      logNav(`Navigation directe vers: ${sectionId}`);
      isScrollingRef.current = true;
      
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      setTimeout(() => {
        isScrollingRef.current = false;
        logNav('Navigation terminée');
      }, 1000);
    } else {
      logNav(`Section ${sectionId} non trouvée`);
    }
  }, []);

  return {
    sections,
    currentSection,
    scrollToNextSection,
    scrollToPreviousSection,
    scrollToSection: scrollToSectionById,
    isScrolling: isScrollingRef.current,
    getCurrentSectionIndex
  };
};
