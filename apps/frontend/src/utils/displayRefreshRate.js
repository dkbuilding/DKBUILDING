// Utilitaire pour détecter et utiliser le taux de rafraîchissement natif de l'écran
// Permet de synchroniser toutes les animations avec le FPS du navigateur/système

let refreshRate = 60; // Valeur par défaut (60 Hz)
let isDetected = false;

/**
 * Détecte le taux de rafraîchissement de l'écran en utilisant requestAnimationFrame
 * @returns {Promise<number>} Le taux de rafraîchissement détecté en Hz
 */
export const detectRefreshRate = () => {
  return new Promise((resolve) => {
    if (isDetected) {
      resolve(refreshRate);
      return;
    }

    // Utiliser l'API Screen Refresh Rate si disponible (Chrome 94+)
    if (window.screen?.refreshRate) {
      refreshRate = window.screen.refreshRate;
      isDetected = true;
      resolve(refreshRate);
      return;
    }

    // Fallback : Mesurer via requestAnimationFrame
    let lastTime = performance.now();
    let frameCount = 0;
    let samples = [];
    const sampleCount = 10; // Nombre d'échantillons pour moyenne

    const measure = (currentTime) => {
      frameCount++;
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        // Calculer FPS pour cette seconde
        const fps = Math.round((frameCount * 1000) / delta);
        samples.push(fps);

        if (samples.length >= sampleCount) {
          // Moyenne des échantillons pour plus de précision
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

/**
 * Obtient le taux de rafraîchissement (mise en cache après première détection)
 * @returns {number} Le taux de rafraîchissement en Hz
 */
export const getRefreshRate = () => {
  return refreshRate;
};

/**
 * Obtient la durée d'une frame en millisecondes
 * @returns {number} Durée d'une frame en ms
 */
export const getFrameDuration = () => {
  return 1000 / refreshRate;
};

/**
 * Initialise la détection du taux de rafraîchissement
 * À appeler au démarrage de l'application
 */
export const initRefreshRateDetection = async () => {
  if (typeof window === 'undefined') return;
  
  await detectRefreshRate();
  
  // Écouter les changements de taux de rafraîchissement (multi-écrans)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: no-preference)');
    mediaQuery.addEventListener('change', () => {
      // Re-détecter si nécessaire
      isDetected = false;
      detectRefreshRate();
    });
  }
  
  return refreshRate;
};

