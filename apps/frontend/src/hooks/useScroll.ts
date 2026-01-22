import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour gérer l'état de scroll de la page
 * @param threshold - Seuil de scroll en pixels (défaut: 50)
 * @returns {boolean} isScrolled - État indiquant si la page a été scrollée au-delà du seuil
 */
export const useScroll = (threshold: number = 50): boolean => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > threshold);
    };

    // Écouter l'événement de scroll
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Nettoyer l'event listener au démontage
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [threshold]);

  return isScrolled;
};

/**
 * Hook pour obtenir la position de scroll actuelle
 * @returns {number} scrollY - Position verticale de scroll en pixels
 */
export const useScrollPosition = (): number => {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
};

/**
 * Hook pour détecter la direction de scroll
 * @returns {object} - Objet contenant la direction et la position de scroll
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = (): void => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }
      
      setScrollY(currentScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return { scrollDirection, scrollY };
};
