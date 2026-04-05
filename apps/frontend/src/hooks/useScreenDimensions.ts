/**
 * Hook personnalisé pour détecter la largeur et la hauteur de l'écran en temps réel
 */

import { useState, useEffect } from 'react';

interface ScreenData {
  readonly width: number;
  readonly height: number;
  readonly isWidthBelowMinimum: boolean;
  readonly isHeightBelowMinimum: boolean;
  readonly isBelowMinimum: boolean;
}

/**
 * @param minWidth - Largeur minimale requise (défaut: 480px)
 * @param minHeight - Hauteur minimale requise (défaut: 480px)
 */
export function useScreenDimensions(minWidth = 480, minHeight = 480): ScreenData {
  const [screenData, setScreenData] = useState<ScreenData>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
    isWidthBelowMinimum: false,
    isHeightBelowMinimum: false,
    isBelowMinimum: false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const handleResize = (): void => {
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

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, [minWidth, minHeight]);

  return screenData;
}

export default useScreenDimensions;
