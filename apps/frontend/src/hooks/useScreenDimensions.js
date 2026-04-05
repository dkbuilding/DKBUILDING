import { useState, useEffect } from 'react';

/**
 * Hook personnalisé pour détecter la largeur et la hauteur de l'écran en temps réel
 * @param {number} minWidth - Largeur minimale requise (défaut: 480px)
 * @param {number} minHeight - Hauteur minimale requise (défaut: 480px)
 * @returns {object} - { width: number, height: number, isWidthBelowMinimum: boolean, isHeightBelowMinimum: boolean, isBelowMinimum: boolean }
 */
export function useScreenDimensions(minWidth = 480, minHeight = 480) {
  const [screenData, setScreenData] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isWidthBelowMinimum: false,
    isHeightBelowMinimum: false,
    isBelowMinimum: false
  });

  useEffect(() => {
    // Guard SSR
    if (typeof window === 'undefined') return;

    let timeoutId;

    const handleResize = () => {
      // Debounce pour optimiser les performances
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const isWidthBelow = width < minWidth;
        const isHeightBelow = height < minHeight;
        
        setScreenData({
          width,
          height,
          isWidthBelowMinimum: isWidthBelow,
          isHeightBelowMinimum: isHeightBelow,
          isBelowMinimum: isWidthBelow || isHeightBelow
        });
      }, 150);
    };

    // Initialisation
    handleResize();

    // Ajouter le listener
    window.addEventListener('resize', handleResize, { passive: true });

    // Cleanup
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [minWidth, minHeight]);

  return screenData;
}

export default useScreenDimensions;

