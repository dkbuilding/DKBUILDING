import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { gsap, ScrollTrigger } from "../../utils/gsapConfig";
import { motionTokens } from "../../utils/motion";
import { useSmartNavigation } from "../../hooks/useSmartNavigation";
import { video as logVideo, nav as logNav } from "../../utils/logger";
import NoiseOverlay from "../ui/NoiseOverlay";
import AnimatedGradientText from "../ui/AnimatedGradientText";
import { Stars } from "lucide-react";

const Hero = () => {
  const heroRef = useRef(null);
  const logoRef = useRef(null);
  const titleRef = useRef(null);
  const heroTitleTextRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  const backgroundElementsRef = useRef([]);
  const videoRef = useRef(null);
  // États pour la gestion de la vidéo
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  // Utiliser le système simple de navigation
  const { scrollToNextSection, isScrolling } = useSmartNavigation();
  // Fonction pour scroller vers la section suivante
  const handleScrollToNext = () => {
    logNav("Hero: Clic sur Découvrir");
    scrollToNextSection();
  };
  // Fonctions de gestion de la vidéo
  const handleVideoLoad = () => {
    setVideoLoaded(true);
    logVideo("Vidéo chargée avec succès");
  };
  const handleVideoError = () => {
    setVideoError(true);
    logVideo("Erreur lors du chargement de la vidéo");
  };
  const handleVideoPlay = () => {
    setVideoPlaying(true);
    logVideo("Vidéo en cours de lecture");
  };

  const handleVideoPause = () => {
    setVideoPlaying(false);
    logVideo("Vidéo mise en pause - tentative de relance...");
    // Relancer immédiatement la vidéo
    setTimeout(() => playVideo(), 100);
  };
  // Fonction pour forcer la lecture de la vidéo
  const playVideo = useCallback(async () => {
    if (videoRef.current) {
      try {
        // S'assurer que la vidéo est configurée pour l'autoplay
        videoRef.current.muted = true;
        videoRef.current.loop = true;
        videoRef.current.playsInline = true;

        await videoRef.current.play();
        setVideoPlaying(true);
        logVideo("Vidéo en cours de lecture");
      } catch (error) {
        logVideo("Erreur autoplay:", error);
        setVideoPlaying(false);

        // Essayer de jouer après une interaction utilisateur
        const handleUserInteraction = () => {
          playVideo();
          document.removeEventListener("click", handleUserInteraction);
          document.removeEventListener("touchstart", handleUserInteraction);
        };

        document.addEventListener("click", handleUserInteraction, {
          once: true,
        });
        document.addEventListener("touchstart", handleUserInteraction, {
          once: true,
        });
      }
    }
  }, []);

  // Fonction pour surveiller et relancer la vidéo si elle s'arrête
  const monitorPlayback = useCallback(() => {
    if (videoRef.current && videoLoaded) {
      if (videoRef.current.paused || videoRef.current.ended) {
        logVideo("Relance de la vidéo...");
        playVideo();
      }
    }
  }, [videoLoaded, playVideo]);

  // Effet pour gérer l'autoplay de la vidéo
  useEffect(() => {
    if (videoLoaded && !videoPlaying) {
      const timer = setTimeout(() => {
        playVideo();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [videoLoaded, videoPlaying, playVideo]);

  // Effet pour surveiller en continu la lecture de la vidéo
  useEffect(() => {
    if (!videoLoaded) return;

    // Surveiller toutes les 2 secondes si la vidéo est toujours en cours
    const monitoringInterval = setInterval(monitorPlayback, 2000);

    // Essayer de jouer immédiatement
    playVideo();

    return () => {
      clearInterval(monitoringInterval);
    };
  }, [videoLoaded, monitorPlayback, playVideo]);

  // Effet pour relancer la vidéo dès qu'elle se met en pause
  useEffect(() => {
    if (!videoRef.current || !videoLoaded) return;

    const video = videoRef.current;

    const handlePause = () => {
      logVideo("Vidéo mise en pause, relance...");
      setTimeout(() => playVideo(), 100);
    };

    const handleEnded = () => {
      logVideo("Vidéo terminée, relance...");
      setTimeout(() => playVideo(), 100);
    };

    const handleStalled = () => {
      logVideo("Vidéo bloquée, relance...");
      setTimeout(() => playVideo(), 500);
    };

    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);
    video.addEventListener("stalled", handleStalled);

    return () => {
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("stalled", handleStalled);
    };
  }, [videoLoaded, playVideo]);

  useLayoutEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Animation d'entrée du logo
      if (logoRef.current) {
        gsap.fromTo(
          logoRef.current,
          {
            scale: 0.5,
            opacity: 0,
            rotation: -10,
          },
          {
            scale: 1,
            opacity: 1,
            rotation: 0,
            duration: motionTokens.durations.hero,
            ease: motionTokens.easing.smooth,
            delay: 0.2,
          },
        );
      }

      // Animation du titre
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: motionTokens.easing.smooth },
        );
      }

      // Animation du sous-titre
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: motionTokens.easing.smooth },
        );
      }

      // Animation du CTA
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: motionTokens.easing.smooth,
          },
        );
      }

      // Animation de l'indicateur de scroll
      if (scrollIndicatorRef.current) {
        gsap.fromTo(
          scrollIndicatorRef.current,
          { y: -20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.durations.normal,
            delay: 1.2,
            ease: motionTokens.easing.smooth,
          },
        );

        // Animation de l'indicateur de scroll (bounce)
        gsap.to(scrollIndicatorRef.current, {
          y: 10,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: 1.5,
        });

        // Animation de l'indicateur pendant le scroll
        if (isScrolling) {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 0.5,
            scale: 0.9,
            duration: 0.3,
          });
        } else {
          gsap.to(scrollIndicatorRef.current, {
            opacity: 1,
            scale: 1,
            duration: 0.3,
          });
        }
      }

      // L'animation du gradient est maintenant gérée par le composant AnimatedGradientText
    }, heroRef);

    return () => ctx.revert();
  }, [isScrolling]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden bg-dk-black"
      style={{ height: "100dvh" }}
    >
      {/* Vidéo de fond */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        controls={false}
        controlsList="nodownload nofullscreen noremoteplayback"
        disablePictureInPicture
        disableRemotePlayback
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        x5-video-player-fullscreen="false"
        x5-video-orientation="portraint"
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={() => {
          logVideo("Vidéo terminée, relance automatique...");
          setTimeout(() => playVideo(), 100);
        }}
        onStalled={() => {
          logVideo("Vidéo bloquée, relance...");
          setTimeout(() => playVideo(), 500);
        }}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: videoLoaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
          pointerEvents: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
          MozUserSelect: "none",
          msUserSelect: "none",
          outline: "none",
          border: "none",
          background: "transparent",
        }}
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onMouseDown={(e) => e.preventDefault()}
      >
        <source
          src="https://static.vecteezy.com/system/resources/previews/048/803/969/mp4/inside-building-construction-free-video.mp4"
          type="video/mp4"
        />
        <source
          src="https://static.vecteezy.com/system/resources/previews/055/318/013/mp4/steel-construction-of-modern-factory-modern-storehouse-construction-with-metal-structures-of-frame-structural-steel-structure-of-new-commercial-building-free-video.mp4"
          type="video/mp4"
        />
      </video>

      {/* Image de fallback si la vidéo ne charge pas */}
      {videoError && (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
          }}
        />
      )}

      {/* Overlay de chargement */}
      {!videoLoaded && !videoError && (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-dk-black via-dk-gray-900 to-dk-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dk-yellow mx-auto mb-4"></div>
            <p className="text-sm">Chargement de la vidéo...</p>
          </div>
        </div>
      )}

      {/* Overlay effet 4K noise pour améliorer la netteté */}
      <NoiseOverlay
        variant="primary"
        intensity="strong"
        color="default"
        animated={false}
      />
      {/* Overlay noise alternatif avec pattern SVG pour plus de contrôle */}
      <NoiseOverlay
        variant="svg"
        intensity="medium"
        color="default"
        animated={false}
      />

      {/* Overlay de test temporaire pour vérifier la visibilité */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0),
            radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0),
            radial-gradient(circle at 3px 3px, rgba(255,255,255,0.2) 1px, transparent 0)
          `,
          backgroundSize: "4px 4px, 6px 6px, 8px 8px",
          backgroundPosition: "0 0, 1px 1px, 2px 2px",
          opacity: 0.15,
          filter: "contrast(2) brightness(1.3)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Overlay de test très visible pour debug */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(
            "data:image/svg+xml,%3Csvg viewBox='0 0 100 100' 
            xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter 
            id='noiseFilter'%3E%3CfeTurbulence 
            type='fractalNoise' 
            baseFrequency='0.9' 
            numOctaves='4' 
            stitchTiles='stitch'/%3E%3C/filter%3E%3Crect 
            width='100%25' 
            height='100%25' 
            filter='url(%23noiseFilter)' 
            opacity='0.8'/%3E%3C/svg%3E")
          )`,
          backgroundSize: "100px 100px",
          opacity: 0.2,
          filter: "contrast(2) brightness(1.2)",
          mixBlendMode: "soft-light",
        }}
      />

      {/* Overlay dégradé DK BUILDING */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(14, 14, 14, 0), rgba(14, 14, 14, 0.3), rgba(14, 14, 14, 1))",
        }}
      ></div>

      {/* Contenu principal */}
      <div className="relative z-10 text-center container-custom section-padding pointer-events-none flex flex-col items-center justify-center min-h-[60vh] sm:min-h-[70vh] w-full">
        {/* Logo DK BUILDING */}
        <div ref={logoRef} className="mb-6 xs:mb-8">
          <div className="inline-block">
            <img
              src="/src/assets/images/logos/Logo — DK BUILDING — Structure 2.png"
              alt="DK BUILDING Logo"
              className="w-24 h-24 xs:w-28 xs:h-28 sm:w-32 sm:h-32 lg:w-40 lg:h-40 mx-auto"
            />
          </div>
        </div>

        {/* Titre principal */}
        <h1
          ref={titleRef}
          className="font-foundation-black text-balance pointer-events-auto whitespace-nowrap sm:whitespace-normal sm:break-anywhere sm:text-clamp-7xl lg:text-clamp-8xl"
          style={{
            fontSize: "clamp(2rem, 4vw + 1.2rem, 3.75rem)",
          }}
        >
          <AnimatedGradientText ref={heroTitleTextRef}>
            DK BUILDING
          </AnimatedGradientText>
        </h1>

        {/* Sous-titre */}
        <p
          ref={subtitleRef}
          className="text-white hover:text-dk-yellow mb-6 xs:mb-8 sm:mb-10 font-foundation-bold tracking-wide transition-all duration-300 pointer-events-auto line-clamp-4 xs:line-clamp-3 sm:line-clamp-2 sm:text-clamp-2xl lg:text-clamp-3xl px-2"
          style={{
            fontSize: "clamp(0.875rem, 2.5vw + 0.5rem, 1.5rem)",
          }}
        >
          CHARPENTE · BARDAGE · COUVERTURE · PHOTOVOLTAÏQUE · TERRASSEMENT
          {/* CLIMATISATION · - Service mis en pause temporairement */}
        </p>

        {/* Section SEO/GEO Moderne et Réaliste */}
        <div className="flex flex-col items-center gap-4 xs:gap-5 sm:gap-6 mb-8 xs:mb-10 sm:mb-12 pointer-events-auto">
          {/* Badge de localisation moderne */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-4 py-3 xs:px-6 xs:py-4 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 xs:gap-4">
              <div className="w-3 h-3 bg-dk-yellow rounded-full animate-pulse shadow-lg"></div>
              <div className="flex items-center gap-2 xs:gap-3">
                <span className="text-white font-foundation-bold text-sm xs:text-base">
                  <span className="text-dk-yellow">Albi</span> ·{" "}
                  <span className="text-white">Tarn</span> ·{" "}
                  <span className="text-white">Occitanie</span>
                </span>
                <span className="text-dk-gray-300 text-xs xs:text-sm font-medium">
                  <span className="hidden xs:inline">Intervention locale</span>
                  <span className="xs:hidden">Local</span>
                </span>
              </div>
            </div>
          </div>

          {/* Mots-clés SEO modernes */}
          <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 opacity-70">
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10">
              #CharpenteMétallique
            </span>
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10">
              #BardageAlbi
            </span>
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10">
              #CouvertureTarn
            </span>
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10 hidden xs:inline">
              #Photovoltaïque
            </span>
            {/* <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10 hidden sm:inline">
              #Climatisation
            </span> */}
            <span className="bg-white/5 backdrop-blur-sm rounded-full px-3 py-1 text-dk-gray-300 text-xs xs:text-sm font-medium border border-white/10 hidden md:inline">
              #Terrassement
            </span>
          </div>
        </div>
      </div>

      {/* Indicateur de scroll intelligent */}
      <div
        ref={scrollIndicatorRef}
        onClick={handleScrollToNext}
        className="absolute left-0 right-0 bottom-4 xs:bottom-6 sm:bottom-8 md:bottom-12 z-30 flex justify-center cursor-pointer group safe-area-bottom"
      >
        <div className="flex flex-col items-center text-dk-yellow transition-all duration-300 touch-target">
          <span className="text-xs xs:text-sm mb-2 font-foundation-bold">
            {isScrolling ? "Navigation..." : "Découvrir"}
          </span>
          <div className="w-5 h-8 xs:w-6 xs:h-10 border-2 border-dk-yellow rounded-full flex justify-center group-hover:border-dk-yellow/80 transition-colors duration-300">
            <div className="w-1 h-2 xs:h-3 bg-dk-yellow rounded-full mt-1 xs:mt-2 animate-bounce group-hover:bg-dk-yellow/80 transition-colors duration-300"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
