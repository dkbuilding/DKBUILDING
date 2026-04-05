/**
 * Hook React pour obtenir le taux de rafraîchissement de l'écran
 */

import { useState, useEffect } from 'react';
import { getRefreshRate, getFrameDuration, initRefreshRateDetection } from '@/utils/displayRefreshRate';

interface UseRefreshRateReturn {
  readonly refreshRate: number;
  readonly frameDuration: number;
  readonly isReady: boolean;
}

export const useRefreshRate = (): UseRefreshRateReturn => {
  const [refreshRate, setRefreshRate] = useState(60);
  const [frameDuration, setFrameDuration] = useState(16.67);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await initRefreshRateDetection();
      setRefreshRate(getRefreshRate());
      setFrameDuration(getFrameDuration());
      setIsReady(true);
    };

    init();
  }, []);

  return { refreshRate, frameDuration, isReady };
};
