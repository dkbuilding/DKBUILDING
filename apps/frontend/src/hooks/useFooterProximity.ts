import { useState, useEffect, useRef, RefObject, useCallback } from 'react';

/**
 * Hook personnalisé pour détecter la proximité du Footer et la direction de scroll
 * @param footerRef - Référence vers l'élément Footer
 * @param threshold - Distance de déclenchement en pixels (optionnel, calculé automatiquement si non fourni)
 * @returns {object} - Objet contenant l'état de proximité et la direction de scroll
 */
export const useFooterProximity = (
  footerRef: RefObject<HTMLElement> | null | undefined,
  threshold?: number
): {
  isNearFooter: boolean;
  scrollDirection: 'up' | 'down' | null;
  scrollY: number;
} => {
  const [isNearFooter, setIsNearFooter] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState<number>(0);
  
  const lastScrollY = useRef<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Calculer le seuil responsive avec clamp
  const getResponsiveThreshold = useCallback((): number => {
    if (threshold) return threshold;
    
    // clamp(min, preferred, max) : 100px mobile → 500px desktop
    const viewportHeight = window.innerHeight;
    const preferredThreshold = viewportHeight * 0.2; // 20vh
    const clampedThreshold = Math.max(100, Math.min(preferredThreshold, 500));
    
    return clampedThreshold;
  }, [threshold]);

  // Fonction pour détecter la direction de scroll avec debounce
  const handleScroll = (): void => {
    const currentScrollY = window.scrollY;
    
    // Debounce léger pour éviter les calculs excessifs
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (currentScrollY > lastScrollY.current) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY.current) {
        setScrollDirection('up');
      }
      
      setScrollY(currentScrollY);
      lastScrollY.current = currentScrollY;
    }, 10); // Debounce de 10ms
  };

  useEffect(() => {
    // Si footerRef n'est pas fourni ou n'a pas d'élément, ne rien faire
    if (!footerRef || !footerRef.current) return;

    const currentThreshold = getResponsiveThreshold();
    
    // Configuration de l'IntersectionObserver
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: `-${currentThreshold}px 0px 0px 0px`, // Zone de déclenchement au-dessus du Footer
      threshold: 0,
    };

    // Créer l'IntersectionObserver
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Le Footer entre dans la zone de déclenchement
          setIsNearFooter(entry.isIntersecting);
        });
      },
      observerOptions
    );

    // Observer le Footer
    observerRef.current.observe(footerRef.current);

    // Écouter les événements de scroll pour la direction
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initialiser la position de scroll
    lastScrollY.current = window.scrollY;
    setScrollY(window.scrollY);

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [footerRef, threshold, getResponsiveThreshold]);

  // Recalculer le seuil lors du redimensionnement de la fenêtre
  useEffect(() => {
    const handleResize = (): void => {
      if (!footerRef || !footerRef.current || !observerRef.current) return;
      
      const newThreshold = getResponsiveThreshold();
      
      // Recréer l'observer avec le nouveau seuil
      observerRef.current.disconnect();
      
      const observerOptions: IntersectionObserverInit = {
        root: null,
        rootMargin: `-${newThreshold}px 0px 0px 0px`,
        threshold: 0,
      };
      
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsNearFooter(entry.isIntersecting);
          });
        },
        observerOptions
      );
      
      observerRef.current.observe(footerRef.current);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [footerRef, threshold, getResponsiveThreshold]);

  return {
    isNearFooter,
    scrollDirection,
    scrollY,
  };
};

/**
 * Hook utilitaire pour combiner plusieurs refs
 * @param refs - Array de refs à combiner
 * @returns RefObject combiné
 */
export const useCombinedRefs = <T extends HTMLElement>(
  ...refs: Array<RefObject<T> | ((instance: T | null) => void) | null | undefined>
): RefObject<T> => {
  const targetRef = useRef<T>(null);

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(targetRef.current);
      } else {
        ref.current = targetRef.current;
      }
    });
  });

  return targetRef;
};
