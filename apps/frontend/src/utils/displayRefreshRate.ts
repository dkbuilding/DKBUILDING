/**
 * Utilitaire pour détecter et utiliser le taux de rafraîchissement natif de l'écran
 * Permet de synchroniser toutes les animations avec le FPS du navigateur/système
 */

let refreshRate = 60;
let isDetected = false;

/** Accès à l'API Screen refresh rate (non standard, Chrome 94+) */
interface ScreenWithRefreshRate extends Screen {
  readonly refreshRate?: number;
}

/**
 * Détecte le taux de rafraîchissement de l'écran en utilisant requestAnimationFrame
 */
export const detectRefreshRate = (): Promise<number> => {
  return new Promise((resolve) => {
    if (isDetected) {
      resolve(refreshRate);
      return;
    }

    const screenWithRate = window.screen as ScreenWithRefreshRate;
    if (screenWithRate.refreshRate) {
      refreshRate = screenWithRate.refreshRate;
      isDetected = true;
      resolve(refreshRate);
      return;
    }

    // Fallback : Mesurer via requestAnimationFrame
    let lastTime = performance.now();
    let frameCount = 0;
    const samples: number[] = [];
    const sampleCount = 10;

    const measure = (currentTime: DOMHighResTimeStamp): void => {
      frameCount++;
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frameCount * 1000) / delta);
        samples.push(fps);

        if (samples.length >= sampleCount) {
          const avgFps = Math.round(
            samples.reduce((a, b) => a + b, 0) / samples.length
          );
          refreshRate = avgFps;
          isDetected = true;
          resolve(refreshRate);
          return;
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measure);
    };

    requestAnimationFrame(measure);
  });
};

/** Obtient le taux de rafraîchissement (mise en cache après première détection) */
export const getRefreshRate = (): number => refreshRate;

/** Obtient la durée d'une frame en millisecondes */
export const getFrameDuration = (): number => 1000 / refreshRate;

/** Initialise la détection du taux de rafraîchissement */
export const initRefreshRateDetection = async (): Promise<number | undefined> => {
  if (typeof window === 'undefined') return;

  await detectRefreshRate();

  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    mediaQuery.addEventListener('change', () => {
      isDetected = false;
      detectRefreshRate();
    });
  }

  return refreshRate;
};
