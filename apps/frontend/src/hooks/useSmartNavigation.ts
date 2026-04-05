/**
 * Hook ultra-simple pour la navigation entre sections
 * Utilise directement les IDs des sections sans détection complexe
 */

import { useRef, useCallback, useEffect, useState, useMemo } from 'react';
import { scroll as logScroll, nav as logNav } from '@/utils/logger';

interface NavigationSection {
  readonly id: string;
  readonly name: string;
}

interface UseSmartNavigationReturn {
  readonly sections: readonly NavigationSection[];
  readonly currentSection: number;
  readonly scrollToNextSection: () => void;
  readonly scrollToPreviousSection: () => void;
  readonly scrollToSection: (sectionId: string) => void;
  readonly isScrolling: boolean;
  readonly getCurrentSectionIndex: () => number;
}

export const useSmartNavigation = (): UseSmartNavigationReturn => {
  const isScrollingRef = useRef(false);
  const [currentSection, setCurrentSection] = useState(0);

  const sections: readonly NavigationSection[] = useMemo(() => [
    { id: 'home', name: 'Accueil' },
    { id: 'news', name: 'Actualités' },
    { id: 'services', name: 'Services' },
    { id: 'portfolio', name: 'Portfolio' },
    { id: 'about', name: 'À propos' },
    { id: 'contact', name: 'Contact' }
  ] as const, []);

  const getCurrentSectionIndex = useCallback((): number => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    logScroll(`ScrollY: ${scrollY}, WindowHeight: ${windowHeight}`);

    if (scrollY < windowHeight * 0.5) {
      logScroll('Section actuelle: 0 (home)');
      setCurrentSection(0);
      return 0;
    }

    for (let i = 0; i < sections.length; i++) {
      const sectionDef = sections[i];
      if (!sectionDef) continue;
      const section = document.getElementById(sectionDef.id);
      if (!section) continue;

      const rect = section.getBoundingClientRect();

      logScroll(`Section ${i} (${sectionDef.id}): rect.top=${rect.top}`);

      if (rect.top <= windowHeight * 0.2) {
        logScroll(`Section actuelle: ${i} (${sectionDef.id})`);
        setCurrentSection(i);
        return i;
      }
    }

    logScroll('Aucune section détectée, retour à 0');
    setCurrentSection(0);
    return 0;
  }, [sections]);

  useEffect(() => {
    const handleScroll = (): void => {
      if (!isScrollingRef.current) {
        getCurrentSectionIndex();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [getCurrentSectionIndex]);

  const scrollToNextSection = useCallback((): void => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    const nextIndex = currentIndex + 1;

    logNav(`Navigation: ${currentIndex} → ${nextIndex}`);

    const nextSectionDef = sections[nextIndex];
    if (nextSectionDef) {
      const nextSection = document.getElementById(nextSectionDef.id);

      if (nextSection) {
        logNav(`Navigation vers: ${nextSectionDef.id}`);
        isScrollingRef.current = true;

        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
          isScrollingRef.current = false;
          logNav('Navigation terminée');
        }, 1000);
      } else {
        logNav(`Section ${nextSectionDef.id} non trouvée`);
      }
    } else {
      logNav('Pas de section suivante');
    }
  }, [sections, getCurrentSectionIndex]);

  const scrollToPreviousSection = useCallback((): void => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const currentIndex = getCurrentSectionIndex();
    const prevIndex = currentIndex - 1;

    logNav(`Navigation: ${currentIndex} → ${prevIndex}`);

    const prevSectionDef = sections[prevIndex];
    if (prevSectionDef) {
      const prevSection = document.getElementById(prevSectionDef.id);

      if (prevSection) {
        logNav(`Navigation vers: ${prevSectionDef.id}`);
        isScrollingRef.current = true;

        prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

        setTimeout(() => {
          isScrollingRef.current = false;
          logNav('Navigation terminée');
        }, 1000);
      } else {
        logNav(`Section ${prevSectionDef.id} non trouvée`);
      }
    } else {
      logNav('Pas de section précédente');
    }
  }, [sections, getCurrentSectionIndex]);

  const scrollToSectionById = useCallback((sectionId: string): void => {
    if (isScrollingRef.current) {
      logNav('Navigation déjà en cours');
      return;
    }

    const section = document.getElementById(sectionId);
    if (section) {
      logNav(`Navigation directe vers: ${sectionId}`);
      isScrollingRef.current = true;

      section.scrollIntoView({ behavior: 'smooth', block: 'start' });

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
