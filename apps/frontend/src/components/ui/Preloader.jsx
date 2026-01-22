import { useEffect, useState, useRef } from 'react';
import { gsap } from 'gsap';
import useScreenDimensions from '../../hooks/useScreenDimensions';
import preloaderConfig from '../../config/preloaderConfig.json';
import { RulerIcon, Maximize2Icon, MaximizeIcon, Monitor, AlertTriangle } from 'lucide-react';
import { checkBackendHealth } from '../../utils/backendHealthCheck';
import { loadCriticalImages, detectCriticalImages } from '../../utils/resourceLoader';
import { isSlowConnection } from '../../utils/connectionDetector';
import { checkBrowserCompatibility } from '../../utils/browserDetector';

export default function Preloader() {
  const [isReady, setIsReady] = useState(false);
  const [backendStatus, setBackendStatus] = useState({
    checked: false,
    available: null,
    error: null,
  });
  const [, setConnectionStatus] = useState({
    checked: false,
    isSlow: false,
    details: null,
  });
  const [, setBrowserStatus] = useState({
    checked: false,
    compatible: true,
    details: null,
  });
  const [, setImagesStatus] = useState({
    checked: false,
    loaded: 0,
    failed: 0,
    total: 0,
  });
  const { 
    width, 
    height, 
    isWidthBelowMinimum, 
    isHeightBelowMinimum, 
    isBelowMinimum 
  } = useScreenDimensions(
    preloaderConfig.screenConditions.minWidth,
    preloaderConfig.screenConditions.minHeight
  );
  const containerRef = useRef(null);
  const messageRef = useRef(null);
  const iconRef = useRef(null);
  const fullscreenRef = useRef(null);

  // Déterminer le type de message à afficher
  const getMessageType = () => {
    if (isWidthBelowMinimum && isHeightBelowMinimum) {
      return 'both';
    } else if (isWidthBelowMinimum) {
      return 'widthOnly';
    } else if (isHeightBelowMinimum) {
      return 'heightOnly';
    }
    return null;
  };

  const messageType = getMessageType();
  const currentMessage = messageType ? preloaderConfig.screenConditions.messages[messageType] : null;

  useEffect(() => {
    let cancelled = false;
    const mountStart = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();

    async function waitForWindowLoad() {
      if (document.readyState === 'complete') return;
      await new Promise((resolve) => {
        const onLoad = () => {
          window.removeEventListener('load', onLoad);
          resolve();
        };
        window.addEventListener('load', onLoad, { passive: true });
      });
    }

    async function waitForFonts() {
      if (document.fonts && document.fonts.ready) {
        try {
          await document.fonts.ready;
        } catch {
          // Ignorer les erreurs de chargement de polices
        }
      }
    }

    function waitForVideos() {
      const videos = Array.from(document.querySelectorAll('video'));
      if (videos.length === 0) return Promise.resolve();

      return Promise.all(
        videos.map((video) => {
          // If metadata and enough data buffered
          if (video.readyState >= 3) return Promise.resolve();
          return new Promise((resolve) => {
            const onReady = () => {
              video.removeEventListener('canplaythrough', onReady);
              video.removeEventListener('loadeddata', onReady);
              resolve();
            };
            video.addEventListener('canplaythrough', onReady, { once: true, passive: true });
            video.addEventListener('loadeddata', onReady, { once: true, passive: true });
          });
        })
      );
    }

    /**
     * Vérification de santé du backend (non-bloquante)
     * Effectuée en parallèle avec les autres vérifications
     */
    async function checkBackend() {
      try {
        const result = await checkBackendHealth(null, 3000); // Timeout de 3 secondes
        if (!cancelled) {
          setBackendStatus({
            checked: true,
            available: result.available,
            error: result.error || null,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setBackendStatus({
            checked: true,
            available: false,
            error: error.message || 'Erreur lors de la vérification du backend',
          });
        }
      }
    }

    /**
     * Vérification de la connexion (non-bloquante)
     */
    async function checkConnection() {
      try {
        const result = await isSlowConnection(
          preloaderConfig.performanceConditions?.slowConnection?.threshold || 2000
        );
        if (!cancelled) {
          setConnectionStatus({
            checked: true,
            isSlow: result.isSlow,
            details: result.details,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setConnectionStatus({
            checked: true,
            isSlow: false,
            details: { error: error.message },
          });
        }
      }
    }

    /**
     * Vérification du navigateur (non-bloquante)
     */
    async function checkBrowser() {
      try {
        const result = checkBrowserCompatibility(
          preloaderConfig.browserConditions?.minVersion || {}
        );
        if (!cancelled) {
          setBrowserStatus({
            checked: true,
            compatible: result.compatible,
            details: result,
          });
        }
      } catch (error) {
        if (!cancelled) {
          setBrowserStatus({
            checked: true,
            compatible: true, // Assume compatible en cas d'erreur
            details: { error: error.message },
          });
        }
      }
    }

    /**
     * Chargement des images critiques (non-bloquante)
     */
    async function loadImages() {
      try {
        // Détecter les images critiques
        const criticalImages = detectCriticalImages();
        
        if (criticalImages.length === 0) {
          if (!cancelled) {
            setImagesStatus({
              checked: true,
              loaded: 0,
              failed: 0,
              total: 0,
            });
          }
          return;
        }

        // Charger les images avec retry
        const result = await loadCriticalImages(criticalImages, 5000, 2);
        
        if (!cancelled) {
          setImagesStatus({
            checked: true,
            loaded: result.loaded,
            failed: result.failed,
            total: result.total,
          });
        }
      } catch {
        if (!cancelled) {
          setImagesStatus({
            checked: true,
            loaded: 0,
            failed: 0,
            total: 0,
          });
        }
      }
    }

    (async () => {
      // Le preloader est déjà visible - on fait toutes les vérifications en arrière-plan
      // Ne PAS attendre window.load qui peut prendre plusieurs secondes
      
      // Démarrer toutes les vérifications en parallèle (non-bloquantes)
      const backendCheck = checkBackend();
      const connectionCheck = checkConnection();
      const browserCheck = checkBrowser();
      const imagesCheck = loadImages();
      
      // Attendre les ressources frontend critiques avec timeout raisonnable
      // Ne pas bloquer indéfiniment si les polices ou vidéos ne se chargent pas
      const criticalResourcesPromise = Promise.race([
        Promise.all([
          waitForFonts().catch(() => {}), // Ignorer les erreurs de polices
          waitForVideos().catch(() => {}) // Ignorer les erreurs de vidéos
        ]),
        new Promise(resolve => setTimeout(resolve, 2000)) // Timeout de 2 secondes max
      ]);
      
      // Attendre les ressources critiques ET les vérifications backend (avec timeout global)
      await Promise.race([
        Promise.allSettled([
          criticalResourcesPromise,
          backendCheck,
          connectionCheck,
          browserCheck,
          imagesCheck
        ]),
        new Promise(resolve => setTimeout(resolve, 3000)) // Timeout global de 3 secondes
      ]);
      
      if (cancelled) return;
      
      // Mesurer le temps écoulé
      const now = typeof performance !== 'undefined' && performance.now ? performance.now() : Date.now();
      const elapsed = now - mountStart;
      
      // Afficher le preloader au minimum 800ms pour une bonne UX
      // Mais ne pas attendre plus de 3 secondes au total
      const MIN_DISPLAY_MS = 800;
      const MAX_DISPLAY_MS = 3000;
      const remaining = Math.max(0, Math.min(MAX_DISPLAY_MS - elapsed, MIN_DISPLAY_MS - elapsed));
      
      if (remaining > 0) {
        const timeout = setTimeout(() => {
          if (!cancelled) setIsReady(true);
        }, remaining);
        return () => clearTimeout(timeout);
      } else {
        // Si on a déjà dépassé le minimum, afficher immédiatement
        if (!cancelled) setIsReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Disable document scrolling while the preloader is visible
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlTouchAction = html.style.touchAction;
    const previousBodyTouchAction = body.style.touchAction;
    const previousHtmlOverscroll = html.style.overscrollBehavior;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    const preventDefault = (e) => {
      e.preventDefault();
    };

    if (!isReady || isBelowMinimum) {
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      html.style.touchAction = 'none';
      body.style.touchAction = 'none';
      html.style.overscrollBehavior = 'none';
      body.style.overscrollBehavior = 'none';

      window.addEventListener('touchmove', preventDefault, { passive: false });
      window.addEventListener('wheel', preventDefault, { passive: false });
    } else {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.touchAction = previousHtmlTouchAction;
      body.style.touchAction = previousBodyTouchAction;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;

      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('wheel', preventDefault);
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      html.style.touchAction = previousHtmlTouchAction;
      body.style.touchAction = previousBodyTouchAction;
      html.style.overscrollBehavior = previousHtmlOverscroll;
      body.style.overscrollBehavior = previousBodyOverscroll;
      window.removeEventListener('touchmove', preventDefault);
      window.removeEventListener('wheel', preventDefault);
    };
  }, [isReady, isBelowMinimum]);

  // Animation GSAP pour le message d'erreur d'écran trop petit
  useEffect(() => {
    if (!isBelowMinimum || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const duration = prefersReducedMotion ? 0.1 : preloaderConfig.preloaderSettings.animation.fadeInDuration;
      const easing = preloaderConfig.preloaderSettings.animation.easing;

      // Si c'est le cas "both", animation différente pour la page fullscreen
      if (messageType === 'both' && fullscreenRef.current) {
        const tl = gsap.timeline({ 
          defaults: { 
            ease: easing,
            duration: duration
          }
        });

        tl.fromTo(fullscreenRef.current, 
          { 
            opacity: 0,
            scale: 0.95
          },
          { 
            opacity: 1,
            scale: 1
          }
        )
        .fromTo(iconRef.current,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -180
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: preloaderConfig.preloaderSettings.animation.scaleDuration
          },
          "-=0.2"
        );
      } else if (messageRef.current) {
        // Animation standard pour les autres cas
        const tl = gsap.timeline({ 
          defaults: { 
            ease: easing,
            duration: duration
          }
        });

        tl.fromTo(messageRef.current, 
          { 
            opacity: 0, 
            y: 30,
            scale: 0.9
          },
          { 
            opacity: 1, 
            y: 0,
            scale: 1
          }
        )
        .fromTo(iconRef.current,
          {
            opacity: 0,
            rotation: -10,
            scale: 0.8
          },
          {
            opacity: 1,
            rotation: 0,
            scale: 1,
            duration: preloaderConfig.preloaderSettings.animation.scaleDuration
          },
          "-=0.3"
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isBelowMinimum, messageType]);

  return (
    <div
      ref={containerRef}
      id="dk-preloader"
      className={`dk-preloader${isReady && !isBelowMinimum ? ' dk-preloader--hidden' : ''}`}
      aria-hidden={isReady && !isBelowMinimum}
      aria-busy={!isReady || isBelowMinimum}
    >
      {/* Logo - masqué pour le cas "both" */}
      {messageType !== 'both' && (
        <img
          className="dk-preloader__logo"
          src="/images/logos/Logo — DK BUILDING — Structure 2.png"
          alt="DK BUILDING"
          width={120}
          height={120}
          decoding="async"
        />
      )}

      {/* Page complète différente pour le cas "both" */}
      {isBelowMinimum && currentMessage && messageType === 'both' && (
        <div 
          ref={fullscreenRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-gradient-to-br from-dk-black via-[#0a0a0a] to-dk-black"
          style={{
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          <div className="max-w-md mx-6 text-center px-8 py-12">
            {/* Grande icône centrale */}
            <div 
              ref={iconRef}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <Monitor className='w-20 h-20 text-dk-yellow' strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <MaximizeIcon className='w-8 h-8 text-dk-yellow/60' strokeWidth={2} />
                </div>
              </div>
            </div>

            {/* Titre principal */}
            <h1 className="text-3xl font-bold text-white mb-4 font-foundation-sans">
              {currentMessage.title}
            </h1>

            {/* Sous-titre */}
            <p className="text-base text-white/90 mb-6 font-foundation-sans leading-relaxed">
              {currentMessage.subtitle}
            </p>

            {/* Message d'action principal */}
            <div className="bg-dk-yellow/10 border border-dk-yellow/30 rounded-xl p-6 mb-8 backdrop-blur-sm">
              <p className="text-lg text-dk-yellow font-semibold font-foundation-sans leading-relaxed">
                {currentMessage.action}
              </p>
            </div>

            {/* Indicateurs de dimensions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="px-4 py-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="text-xs text-white/50 font-foundation-sans mb-1">Largeur</div>
                <div className="text-lg font-bold text-white font-foundation-sans">{width}px</div>
                <div className="text-xs text-dk-yellow/70 font-foundation-sans mt-1">Minimum: 320px</div>
              </div>
              <div className="px-4 py-3 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
                <div className="text-xs text-white/50 font-foundation-sans mb-1">Hauteur</div>
                <div className="text-lg font-bold text-white font-foundation-sans">{height}px</div>
                <div className="text-xs text-dk-yellow/70 font-foundation-sans mt-1">Minimum: 320px</div>
              </div>
            </div>

            {/* Message de suggestion */}
            <p className="text-sm text-white/60 font-foundation-sans leading-relaxed">
              Connectez-vous depuis une tablette ou un ordinateur pour accéder à notre site.
            </p>
          </div>
        </div>
      )}

      {/* Messages standards pour les cas widthOnly et heightOnly */}
      {isBelowMinimum && currentMessage && messageType !== 'both' && (
        <div 
          ref={messageRef}
          className="absolute inset-0 flex items-center justify-center z-10"
          style={{
            backgroundColor: 'rgba(14, 14, 14, 0.5)' /* dk black 50% */,
            WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 2.5%, #000 97.5%, transparent 100%)',
            maskImage: 'linear-gradient(90deg, transparent 0%, #000 2.5%, #000 97.5%, transparent 100%)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            perspective: '1000px'
          }}
        >
          <div className="max-w-sm mx-6 text-center">
            {/* Icône */}
            <div 
              ref={iconRef}
              className="flex justify-center mb-6"
            >
              {currentMessage.icon === 'ruler' && (
                <RulerIcon className='w-6 h-6 text-white/90' />
              )}
              {currentMessage.icon === 'maximize-2' && (
                <Maximize2Icon className='w-6 h-6 text-white/90' />
              )}
              {currentMessage.icon === 'maximize' && (
                <MaximizeIcon className='w-6 h-6 text-white/90' />
              )}
            </div>

            {/* Titre */}
            <h1 className="text-xl font-bold text-white mb-3 font-foundation-sans">
              {currentMessage.title}
            </h1>

            {/* Sous-titre */}
            <p className="text-sm text-white/80 mb-4 font-foundation-sans leading-relaxed">
              {currentMessage.subtitle}
            </p>

            {/* Action */}
            <p className="text-xs text-white/70 font-foundation-sans leading-relaxed">
              {currentMessage.action}
            </p>

            {/* Indicateurs de dimensions actuelles */}
            <div className="mt-6 space-y-2">
              {isWidthBelowMinimum && (
                <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-xs text-white/60 font-foundation-sans">
                    Largeur actuelle : {width}px
                  </span>
                </div>
              )}
              {isHeightBelowMinimum && (
                <div className="px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <span className="text-xs text-white/60 font-foundation-sans">
                    Hauteur actuelle : {height}px
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Avertissement discret si le backend est down (mode dégradé) */}
      {isReady && !isBelowMinimum && backendStatus.checked && !backendStatus.available && (
        <div 
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md mx-4"
          role="alert"
          aria-live="polite"
        >
          <div className="bg-dk-yellow/90 backdrop-blur-sm border border-dk-yellow/50 rounded-lg px-4 py-3 shadow-lg flex items-center gap-3 animate-slide-up">
            <AlertTriangle className="w-5 h-5 text-dk-black flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-dk-black font-foundation-sans">
                Mode dégradé activé
              </p>
              <p className="text-xs text-dk-black/80 font-foundation-sans">
                Le backend n'est pas disponible. Certaines fonctionnalités peuvent être limitées.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


