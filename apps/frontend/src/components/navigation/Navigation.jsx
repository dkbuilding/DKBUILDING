import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motionTokens } from '../../utils/motion';
import { useScroll } from '../../hooks/useScroll';
import { useFooterProximity } from '../../hooks/useFooterProximity';
import { Menu, X, Info } from 'lucide-react';

const Navigation = ({ onToggleSidebar, isSidebarOpen, footerRef }) => {
  const navRef = useRef(null);
  const bannerRef = useRef(null);
  const trackRef = useRef(null);
  const isScrolled = useScroll(50);
  
  // Créer un ref par défaut si footerRef n'est pas fourni
  const defaultFooterRef = useRef(null);
  const effectiveFooterRef = footerRef || defaultFooterRef;
  
  // Utiliser le hook de proximité du Footer (seulement si footerRef est fourni)
  const { isNearFooter, scrollDirection } = useFooterProximity(effectiveFooterRef);
  // Messages du bandeau
  const bannerMessages = [
    // TODO: Ajouter les messages du bandeau avec les liens correspondants
    // { text: '', href: '', ariaLabel: '' },
    { text: 'Entreprise générale du bâtiment – devis gratuits', href: '/#contact', ariaLabel: 'Aller au contact' },
    { text: 'Conformité réglementaire totale – assurances et garanties', href: '/legal/mentions-legales', ariaLabel: 'Voir mentions légales' },
    { text: 'Interventions rapides – Occitanie', href: '/#services', ariaLabel: 'Voir services' },
    { text: 'Nous sommes à votre écoute – Contactez-nous', href: '/#contact', ariaLabel: 'Aller au contact' },
  ];

  // État du bandeau (toujours affiché par défaut)
  const [isBannerClosed, setIsBannerClosed] = useState(false);

  // Fonction pour fermer le bandeau (temporairement, réapparaît au rechargement)
  const handleCloseBanner = () => {
    if (bannerRef.current) {
      // Appliquer display: none immédiatement pour éviter l'espacement
      gsap.set(bannerRef.current, {
        display: 'none',
        height: 0,
        opacity: 0,
        clearProps: 'all'
      });
      
      // Mettre à jour l'état immédiatement (pas de persistance)
      setIsBannerClosed(true);
    } else {
      setIsBannerClosed(true);
    }
  };



  useLayoutEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      // Animation d'entrée de la navbar
      gsap.fromTo(navRef.current,
        { y: -100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: motionTokens.durations.normal,
          ease: motionTokens.easing.smooth
        }
      );

      // Animation du bandeau si visible
      if (bannerRef.current && !isBannerClosed) {
        gsap.fromTo(bannerRef.current,
          { height: 0, opacity: 0 },
          { 
            height: '2.25rem',
            opacity: 1,
            duration: motionTokens.durations.normal,
            ease: motionTokens.easing.smooth,
            delay: 0.2
          }
        );
      }
    }, navRef);

    return () => ctx.revert();
  }, [isBannerClosed]);

  // Animation de masquage/affichage basée sur la proximité du Footer
  useLayoutEffect(() => {
    if (!navRef.current) return;

    const ctx = gsap.context(() => {
      // Vérifier prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Animation instantanée pour l'accessibilité
        gsap.set(navRef.current, { 
          y: (!isSidebarOpen && isNearFooter && scrollDirection === 'down') ? '-100%' : 0, 
          opacity: (!isSidebarOpen && isNearFooter && scrollDirection === 'down') ? 0 : 1 
        });
        return;
      }

      // Si le sidebar est ouvert, toujours afficher
      if (isSidebarOpen) {
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });
      } else if (isNearFooter && scrollDirection === 'down') {
        // Masquer uniquement si sidebar fermé ET footer visible
        gsap.to(navRef.current, {
          y: '-100%',
          opacity: 0,
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });
      } else {
        // Réafficher
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });
      }
    }, navRef);

    return () => ctx.revert();
  }, [isNearFooter, scrollDirection, isSidebarOpen]);

  // Animation marquee intelligente du bandeau (système infini optimisé)
  useLayoutEffect(() => {
    if (!trackRef.current || isBannerClosed) return;

    const ctx = gsap.context(() => {
      // Vérifier prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Mode statique pour l'accessibilité
        gsap.set(trackRef.current, { x: 0 });
        return;
      }

      // Mesurer la largeur réelle du contenu (maintenant avec 3 instances)
      const trackWidth = trackRef.current.scrollWidth;
      
      // Calculer la distance pour une boucle infinie parfaite avec 3 instances
      // On déplace exactement 1/3 du contenu (une instance complète)
      const instanceWidth = trackWidth / 3;
      
      // Vitesse constante et fluide (60px/s pour un défilement naturel)
      const speed = 60; // pixels par seconde
      const duration = instanceWidth / speed;

      // Timeline marquee infinie avec boucle parfaite (3 instances)
      const tl = gsap.timeline({ 
        repeat: -1, 
        defaults: { ease: 'none' },
        immediateRender: false
      });

      // Animation principale : défilement continu avec boucle infinie fluide
      tl.fromTo(trackRef.current, 
        { x: 0 }, // Commence à la position initiale
        { 
          x: `-=${instanceWidth}`, // Se déplace exactement d'une instance (retour à la position initiale visuellement)
          duration: duration,
          ease: 'none'
        }
      );

      // Pause intelligente au survol et focus
      const handlePause = () => {
        tl.pause();
        // Ajouter un effet de flou subtil pendant la pause
        gsap.to(trackRef.current, { filter: 'blur(0.5px)', duration: 0.3 });
      };
      
      const handleResume = () => {
        tl.play();
        // Retirer l'effet de flou
        gsap.to(trackRef.current, { filter: 'blur(0px)', duration: 0.3 });
      };

      // Event listeners pour pause/resume
      trackRef.current.addEventListener('mouseenter', handlePause);
      trackRef.current.addEventListener('mouseleave', handleResume);
      trackRef.current.addEventListener('focusin', handlePause);
      trackRef.current.addEventListener('focusout', handleResume);

      // Optimisation : pause automatique quand la fenêtre n'est pas visible
      const handleVisibilityChange = () => {
        if (document.hidden) {
          tl.pause();
        } else {
          tl.play();
        }
      };
      
      document.addEventListener('visibilitychange', handleVisibilityChange);

      // Cleanup des event listeners
      return () => {
        trackRef.current?.removeEventListener('mouseenter', handlePause);
        trackRef.current?.removeEventListener('mouseleave', handleResume);
        trackRef.current?.removeEventListener('focusin', handlePause);
        trackRef.current?.removeEventListener('focusout', handleResume);
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }, trackRef);

    return () => ctx.revert();
  }, [isBannerClosed]);

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        margin: 0,
        padding: 0,
        lineHeight: 0
      }}
    >
      {/* Bandeau d'informations */}
      <div 
        ref={bannerRef}
        className={`w-full bg-dk-black text-dk-yellow overflow-hidden border-gradient-bottom-yellow ${
          isBannerClosed ? 'hidden' : 'block'
        }`}
        role="banner"
        aria-label="Informations importantes"
        style={{ 
          height: isBannerClosed ? '0px' : '2.25rem',
          minHeight: isBannerClosed ? '0px' : '2.25rem',
          maxHeight: isBannerClosed ? '0px' : '2.25rem',
          lineHeight: isBannerClosed ? '0' : 'normal'
        }}
      >
        <div className="container-custom section-padding relative">
          {/* Bouton fermer - en dehors du mask */}
          <button
            onClick={handleCloseBanner}
            className="invisible sm:visible pointer-events-auto absolute left-12 top-1/2 -translate-y-1/2 z-[9999] p-1 cursor-pointer hover:bg-dk-yellow/10 rounded transition-colors duration-200"
            aria-label="Fermer le bandeau d'informations"
          >
            <X className="w-4 h-4" strokeWidth={2} style={{ color: '#F3E719' }} />
          </button>
          
          <div 
            className="relative h-full flex items-center justify-center overflow-hidden lg:w-[92.5%] md:w-[87.5%] sm:w-[80%] xs:w-[75%] xxs:w-[70%]"
            style={{ 
              position: 'relative',
              // Centrer le contenu
              margin: '0 auto',
              // Limiter la largeur pour éviter le dépassement
              maxWidth: '100%',
              // Mask optimisé pour éviter les effets de bord
              WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, #000 2.5%, #000 97.5%, transparent 100%)',
              maskImage: 'linear-gradient(90deg, transparent 0%, #000 2.5%, #000 97.5%, transparent 100%)',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              // Optimisations GPU
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              perspective: '1000px'
            }}>
            {/* Piste d'animation intelligente avec duplication pour boucle infinie */}
            <ul 
              ref={trackRef}
              className="flex items-center whitespace-nowrap h-full"
              style={{ 
                width: 'max-content',
                minWidth: '100%',
                willChange: 'transform' // Optimisation GPU
              }}
            >
              {/* Instances multiples pour boucle infinie fluide */}
              {Array.from({ length: 3 }, (_, instanceIndex) => (
                <React.Fragment key={`instance-${instanceIndex}`}>
                  {bannerMessages.map((message, index) => (
                    <li key={`message-${instanceIndex}-${index}`} className="flex items-center">
                      <a
                        href={message.href}
                        aria-label={message.ariaLabel}
                        className="flex items-center px-8 py-2 hover:text-dk-yellow/80 transition-colors duration-200 group"
                      >
                        <Info className="w-4 h-4 mr-3 flex-shrink-0 transition-transform duration-200" strokeWidth={2} style={{ color: '#F3E719' }} />
                        <span className="text-sm font-medium hover:underline transition-transform duration-200" style={{ color: '#F3E719' }}>{message.text}</span>
                      </a>
                    </li>
                  ))}
                  
                  {/* Séparateur entre instances */}
                  {instanceIndex < 2 && (
                    <li className="flex items-center px-12">
                      <span className="text-transparent">•</span>
                    </li>
                  )}
                </React.Fragment>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Navigation principale */}
      <nav 
        ref={navRef}
        className={`w-full transition-all duration-300 ${
          isScrolled && !isSidebarOpen ? 'bg-dk-black/95 backdrop-blur-md' : 'bg-transparent'
        }`}
        style={{
          position: 'relative',
          top: 0,
          margin: 0,
          padding: 0
        }}
      >
        <div className="container-custom section-padding">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="p-2 flex items-center">
              <img 
                src="/src/assets/images/logos/Logo — DK BUILDING — Structure 2.png" 
                alt="DK BUILDING Logo"
                aria-label="Retour à l'accueil"
                href="/"
                onClick={() => window.location.href = '/'}
                className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 mr-2 xs:mr-3 cursor-pointer"
              />
            </div>

            {/* CTA et Bouton Hamburger */}
            <div className="flex items-center space-x-4">
              {/* Bouton Hamburger */}
              <button
                onClick={onToggleSidebar}
                className="p-2 cursor-pointer text-dk-yellow transition-all duration-300 group appearance-none bg-transparent border-0 outline-none ring-0 hover:bg-transparent touch-target"
                aria-label={isSidebarOpen ? "Fermer le menu" : "Ouvrir le menu"}
              >
                <div className="w-8 h-8 xs:w-9 xs:h-9 relative">
                  <Menu 
                    className={`w-8 h-8 xs:w-9 xs:h-9 transition-all duration-300 ${
                      isSidebarOpen ? 'opacity-0 rotate-180 scale-0' : 'opacity-100 rotate-0 scale-100'
                    }`}
                    strokeWidth={3}
                  />
                  <X 
                    className={`w-8 h-8 xs:w-9 xs:h-9 absolute top-0 left-0 transition-all duration-300 ${
                      isSidebarOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-180 scale-0'
                    }`}
                    strokeWidth={3}
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navigation;
