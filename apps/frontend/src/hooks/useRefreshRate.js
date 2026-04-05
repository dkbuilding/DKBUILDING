import { useState, useEffect } from 'react';
import { getRefreshRate, getFrameDuration, initRefreshRateDetection } from '../utils/displayRefreshRate';

/**
 * Hook React pour obtenir le taux de rafraîchissement de l'écran
 * @returns {{ refreshRate: number, frameDuration: number, isReady: boolean }}
 */
export const useRefreshRate = () => {
  const [refreshRate, setRefreshRate] = useState(60);
  const [frameDuration, setFrameDuration] = useState(16.67);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initRefreshRateDetection();
      setRefreshRate(getRefreshRate());
      setFrameDuration(getFrameDuration());
      setIsReady(true);
    };

    init();
  }, []);

  return { refreshRate, frameDuration, isReady };
};

