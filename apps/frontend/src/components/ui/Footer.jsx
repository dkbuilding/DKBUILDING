import { useLayoutEffect, useRef, forwardRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapConfig';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import AnimatedGradientText from './AnimatedGradientText';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Linkedin, 
  Instagram, 
  Youtube, 
  Facebook,
  Twitter,
  Github,
  ExternalLink,
  ChevronUp
} from 'lucide-react';
import { 
  FaDiscord,
  FaTwitch,
  FaTiktok,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp
} from 'react-icons/fa';

// Import des images
import logoStructure2 from '../../assets/images/logos/Logo — DK BUILDING — Structure 2.png';
import logoStructure from '../../assets/images/logos/Logo — DK BUILDING — Structure.png';

const Footer = forwardRef(({ className, ...props }, ref) => {
  const footerRef = useRef(null);
  const logoRef = useRef(null);
  const navColumnsRef = useRef(null);
  const heroTitleRef = useRef(null);
  const titleTextRef = useRef(null);
  const titleContainerRef = useRef(null);
  const footerBottomRef = useRef(null);
  const scrollToTopRef = useRef(null);
  const [bottomPosition, setBottomPosition] = useState(32); // Valeur par défaut en px (2rem)
  const [gridColumns, setGridColumns] = useState('1fr'); // Colonnes par défaut : 1 colonne
  const [isMobile, setIsMobile] = useState(true); // État pour détecter si on est sur mobile

  // Fonction pour calculer la position bottom proportionnelle
  const calculateBottomPosition = () => {
    if (typeof window === 'undefined') return 32;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculer un rapport basé sur la largeur et la hauteur
    // Utilisation d'un rapport qui s'adapte aux deux dimensions
    // Formule : base + (largeur * ratioLargeur) + (hauteur * ratioHauteur)
    const baseValue = 16; // Valeur de base minimale (1rem)
    const widthRatio = 0.02; // 2% de la largeur
    const heightRatio = 0.01; // 1% de la hauteur
    
    // Calcul proportionnel combinant largeur et hauteur
    const calculatedBottom = baseValue + (viewportWidth * widthRatio) + (viewportHeight * heightRatio);
    
    // Limites min et max pour éviter des valeurs extrêmes
    const minBottom = 16; // 1rem minimum
    const maxBottom = 120; // 7.5rem maximum
    
    return Math.max(minBottom, Math.min(maxBottom, calculatedBottom));
  };

  // Combiner les refs
  const combinedRef = (node) => {
    footerRef.current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

  const navigationLinks = [
    { label: 'ACCUEIL', href: '/#home' },
    { label: 'SERVICES', href: '/#services' },
    { label: 'RÉALISATIONS', href: '/#portfolio' },
    { label: 'À PROPOS', href: '/#about' },
    { label: 'CONTACT', href: '/#contact' },
  ];

  const servicesLinks = [
    { label: 'CHARPENTE MÉTALLIQUE', href: '/#services' },
    { label: 'BARDAGE', href: '/#services' },
    { label: 'COUVERTURE', href: '/#services' },
    { label: 'DEVIS GRATUIT', href: '/#contact' }
  ];

  const legalLinks = [
    { label: 'MENTIONS LÉGALES', href: '/legal/mentions-legales' },
    { label: 'POLITIQUE DE CONFIDENTIALITÉ', href: '/legal/politique-confidentialite' },
    { label: 'CGV / CONDITIONS GÉNÉRALES DE VENTE', href: '/legal/cgv' }
  ];

  const socialLinks = [
    {
      icon: Linkedin,
      href: 'https://www.linkedin.com/in/dk-building-281097364/',
      label: 'Suivre DK BUILDING sur LinkedIn'
    },
    {
      icon: Instagram,
      href: 'https://www.instagram.com/dk_bu1lding/',
      label: 'Suivre DK BUILDING sur Instagram'
    },
    {
      icon: FaWhatsapp,
      href: 'https://wa.me/33768113839',
      label: 'Contacter DK BUILDING sur WhatsApp'
    },
    {
      icon: Youtube,
      href: 'https://youtube.com/channel/UCcfEMru6bCpuiHGBiEQ72YA',
      label: 'Suivre DK BUILDING sur YouTube'
    }
  ];

  // Fonction pour retourner en haut de page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0, // Position de l'animation
      timeout: 1000, // Timeout de l'animation
      delay: 1000, // Délai avant l'animation
      duration: 1000, // Durée de l'animation
      ease: 'power2.inOut', // Effet de l'animation
      behavior: 'smooth', // Comportement de l'animation
      scrollTrigger: { // Trigger de l'animation
        trigger: scrollToTopRef.current, // Trigger de l'animation
        start: 'top top', // Début de l'animation
        end: 'bottom top', // Fin de l'animation
        scrub: true // Scrub de l'animation
      }
    });
  };

  // Fonction pour ajuster la taille de police selon la largeur disponible
  const adjustFontSize = () => {
    if (!titleTextRef.current || !titleContainerRef.current) return;
    
    const container = titleContainerRef.current;
    const h2Element = titleTextRef.current.parentElement;
    if (!h2Element) return;
    
    const containerWidth = container.offsetWidth;
    // Vérifier que le conteneur a une largeur valide
    if (containerWidth === 0) return;
    
    const padding = 32; // 2rem de chaque côté (1rem = 16px)
    const availableWidth = Math.max(100, containerWidth - padding); // Minimum 100px
    
    // Taille minimale et maximale
    const minSize = 32; // 2rem
    const maxSize = 128; // 8rem
    
    try {
      // Mesurer la largeur du texte avec différentes tailles
      const text = 'DK BUILDING';
      const measureElement = document.createElement('span');
      measureElement.style.visibility = 'hidden';
      measureElement.style.position = 'absolute';
      measureElement.style.top = '-9999px';
      measureElement.style.left = '-9999px';
      measureElement.style.whiteSpace = 'nowrap';
      measureElement.style.fontFamily = getComputedStyle(h2Element).fontFamily || 'Foundation Sans, sans-serif';
      measureElement.style.fontWeight = '900';
      measureElement.style.letterSpacing = getComputedStyle(h2Element).letterSpacing || 'normal';
      measureElement.textContent = text;
      document.body.appendChild(measureElement);
      
      // Trouver la taille optimale par dichotomie
      let fontSize = maxSize;
      let low = minSize;
      let high = maxSize;
      
      while (high - low > 1) {
        fontSize = (low + high) / 2;
        measureElement.style.fontSize = `${fontSize}px`;
        const textWidth = measureElement.offsetWidth;
        
        if (textWidth <= availableWidth) {
          low = fontSize;
        } else {
          high = fontSize;
        }
      }
      
      fontSize = Math.max(minSize, Math.min(maxSize, low));
      
      // Nettoyer l'élément de mesure
      if (measureElement.parentNode) {
        document.body.removeChild(measureElement);
      }
      
      // Appliquer la taille calculée directement sur le h2
      h2Element.style.fontSize = `${fontSize}px`;
    } catch (error) {
      console.warn('Erreur lors de l\'ajustement de la taille de police:', error);
      // Fallback : utiliser la taille clamp par défaut
      h2Element.style.fontSize = '';
    }
  };

  // Hook pour gérer le responsive de la grille de navigation
  useEffect(() => {
    const updateGridColumns = () => {
      if (typeof window === 'undefined') return;
      
      const width = window.innerWidth;
      
      if (width < 768) {
        // Mobile : 1 colonne
        setGridColumns('1fr');
        setIsMobile(true);
      } else if (width < 1024) {
        // Tablette : 2 colonnes
        setGridColumns('repeat(2, 1fr)');
        setIsMobile(false);
      } else {
        // PC : 3 colonnes
        setGridColumns('repeat(3, 1fr)');
        setIsMobile(false);
      }
    };

    // Calculer initialement
    updateGridColumns();

    // Écouter les changements de taille
    window.addEventListener('resize', updateGridColumns);
    window.addEventListener('orientationchange', updateGridColumns);

    return () => {
      window.removeEventListener('resize', updateGridColumns);
      window.removeEventListener('orientationchange', updateGridColumns);
    };
  }, []);

  useLayoutEffect(() => {
    if (!footerRef.current) return;

    // Calculer la position bottom initiale
    setBottomPosition(calculateBottomPosition());

    // Fonction pour mettre à jour la position bottom lors du resize
    const handleResize = () => {
      setBottomPosition(calculateBottomPosition());
    };

    // Écouter les changements de taille de fenêtre
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // Ajuster la taille de police pour que le texte tienne dans la largeur
    let resizeObserver = null;
    if (titleContainerRef.current && titleTextRef.current) {
      // Attendre que les polices soient chargées avant de calculer
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          setTimeout(() => adjustFontSize(), 100);
        });
      } else {
        setTimeout(() => adjustFontSize(), 300);
      }
      
      // Réajuster lors du redimensionnement
      resizeObserver = new ResizeObserver(() => {
        setTimeout(() => {
          adjustFontSize();
          // Recalculer aussi la position bottom lors du resize du conteneur
          setBottomPosition(calculateBottomPosition());
        }, 50);
      });
      resizeObserver.observe(titleContainerRef.current);
    }

    const ctx = gsap.context(() => {
      // Vérifier si les éléments existent avant de les animer
      const elements = [
        { ref: logoRef, delay: 0 },
        { ref: navColumnsRef, delay: 0.2 },
        { ref: heroTitleRef, delay: 0.4 },
        { ref: footerBottomRef, delay: 0.6 }
      ];

      elements.forEach(({ ref, delay }) => {
        if (ref.current) {
          gsap.fromTo(ref.current,
            gsapUtils.fadeInUp(ref.current, delay),
            { 
              y: 0, 
              opacity: 1,
              duration: motionTokens.durations.normal,
              ease: motionTokens.easing.smooth,
              scrollTrigger: {
                trigger: ref.current,
                ...scrollTriggerDefaults
              }
            }
          );
        }
      });

      // Animation spéciale pour le bouton "Retourner vers le haut" - s'affiche immédiatement
      // Ne pas toucher au transform horizontal pour préserver le centrage Tailwind
      if (scrollToTopRef.current) {
        gsap.set(scrollToTopRef.current, { 
          opacity: 1, 
          y: 0,
          visibility: 'visible'
          // Ne pas modifier x ou clearProps pour préserver -translate-x-1/2 de Tailwind
        });
      }

      // L'animation du gradient est maintenant gérée par le composant AnimatedGradientText

    }, footerRef);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return (
    <footer 
      ref={combinedRef} 
      className={`bg-dk-black border-gradient-top relative ${className || ''}`}
      role="contentinfo"
      aria-label="Pied de page"
      {...props}
    >
      <div className="container-custom section-padding py-12 lg:py-16">

        {/* Logo en haut */}
        <div ref={logoRef} className="mb-8 lg:mb-12 flex justify-center md:justify-start">
          <img 
            src={logoStructure2} 
            alt="DK BUILDING Logo" 
            className="w-12 h-12 md:w-16 md:h-16"
          />
        </div>

        {/* Navigation - Responsive : 1 colonne mobile, 2 colonnes tablette, 3 colonnes PC */}
        <nav 
          ref={navColumnsRef} 
          className={`grid gap-8 lg:gap-12 mb-12 lg:mb-16 ${isMobile ? 'justify-items-center' : ''}`}
          style={{ 
            gridTemplateColumns: gridColumns
          }}
          aria-label="Navigation du site"
        >
          
          {/* Section Navigation */}
          <div 
            aria-label="Navigation principale" 
            className={`flex flex-col space-y-3 lg:space-y-4 w-full ${isMobile ? 'items-center text-center' : 'items-start'}`}
          >
            <h4 className={`text-lg lg:text-xl font-foundation-black text-white mb-2 lg:mb-3 w-full ${isMobile ? 'text-center' : 'text-left'}`}>
              NAVIGATION
            </h4>
            {navigationLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`text-dk-gray-300 hover:text-dk-yellow transition-colors duration-300 group py-2 no-underline rounded w-full font-foundation ${isMobile ? 'block text-center' : 'flex items-center justify-start'}`}
                aria-label={`Aller à la section ${link.label.toLowerCase()}`}
              >
                <span className="text-sm lg:text-base font-foundation-bold">{link.label}</span>
                {!isMobile && (
                  <ExternalLink 
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Section Services */}
          <div 
            aria-label="Services proposés" 
            className={`flex flex-col space-y-3 lg:space-y-4 w-full ${isMobile ? 'items-center text-center' : 'items-start'}`}
          >
            <h4 className={`text-lg lg:text-xl font-foundation-black text-white mb-2 lg:mb-3 w-full ${isMobile ? 'text-center' : 'text-left'}`}>
              SERVICES
            </h4>
            {servicesLinks.map((service, index) => (
              <a
                key={index}
                href={service.href}
                className={`text-dk-gray-300 hover:text-dk-yellow transition-colors duration-300 group py-2 no-underline rounded w-full font-foundation ${isMobile ? 'block text-center' : 'flex items-center justify-start'}`}
                aria-label={`Découvrir le service ${service.label.toLowerCase()}`}
              >
                <span className="text-sm lg:text-base font-foundation-bold">{service.label}</span>
                {!isMobile && (
                  <ExternalLink 
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </div>

          {/* Section Légal */}
          <div 
            aria-label="Liens légaux" 
            className={`flex flex-col space-y-3 lg:space-y-4 w-full ${isMobile ? 'items-center text-center' : 'items-start'}`}
          >
            <h4 className={`text-lg lg:text-xl font-foundation-black text-white mb-2 lg:mb-3 w-full ${isMobile ? 'text-center' : 'text-left'}`}>
              LÉGAL
            </h4>
            {legalLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={`text-dk-gray-300 hover:text-dk-yellow transition-colors duration-300 group py-2 no-underline rounded w-full font-foundation ${isMobile ? 'block text-center' : 'flex items-center justify-start'}`}
                aria-label={`Aller à la section ${link.label.toLowerCase()}`}
              >
                <span className="text-sm lg:text-base font-foundation-bold">{link.label}</span>
                {!isMobile && (
                  <ExternalLink 
                    className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                )}
              </a>
            ))}
          </div>
        </nav>
        
        {/* Grand Titre DK BUILDING */}
        <div ref={heroTitleRef} className="my-16 lg:my-24 mx-0 text-center w-full px-4">
          <div ref={titleContainerRef} className="w-full">
            <h2 
              className="font-foundation-black text-white leading-none tracking-tight relative inline-block whitespace-nowrap"
              style={{ 
                fontSize: 'clamp(2rem, 12vw, 8rem)',
                width: 'fit-content',
                maxWidth: '100%',
                margin: '0 auto'
              }}
            >
              <AnimatedGradientText ref={titleTextRef}>
                DK BUILDING
              </AnimatedGradientText>
            </h2>
          </div>
        </div>

        {/* Bottom Bar : Copyright + Réseaux sociaux */}
        <div ref={footerBottomRef} className="border-gradient-top pt-8 pb-8">
          <div className="flex flex-col-reverse lg:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <p className="text-dk-gray-400 text-sm lg:text-base text-center lg:text-left">
              © {new Date().getFullYear()} <span className="font-foundation-black text-white hover:text-dk-yellow transition-colors duration-300">DK BUILDING</span>. Tous droits réservés.
            </p>
            
            {/* Réseaux sociaux en ligne horizontale */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110 no-underline group"
                    aria-label={social.label}
                  >
                    <IconComponent className="w-8 h-8 text-dk-yellow group-hover:text-dk-yellow transition-colors duration-300" />
                  </a>
                );
              })}
            </div>
          </div>
          
          {/* Crédit développeur */}
          <div className="text-center">
            <p className="text-dk-gray-500 text-sm lg:text-base leading-relaxed">
              Conçu par               <a 
                href="https://aissabelkoussa.fr" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-dk-yellow hover:text-white hover:font-foundation-black rounded transition-all duration-300"
                aria-label="Visiter le site web officiel d'Aïssa Belkoussa (nouvel onglet)"
              >
                Aïssa Belkoussa
              </a> avec <span className="text-dk-yellow" aria-label="cœur jaune">💛</span> pour l'excellence technique
            </p>
          </div>
        </div>
      </div>

      {/* Logo DK BUILDING Structure - Élément décoratif responsive optimisé */}
      <div className="relative mt-12 xs:mt-16 sm:mt-20 lg:mt-28 bottom-0 w-screen">
        <img 
          src={logoStructure} 
          alt="Logo DK BUILDING - Structure architecturale symbolisant la solidité et l'excellence"
          className="w-full h-auto transition-all duration-500"
          onError={(e) => {
            e.target.style.display = 'none';
            console.warn('Logo DK BUILDING Structure non chargé');
          }}
        />
        
        {/* Bouton Retourner vers le haut - Centré horizontalement en bas du footer - Responsive avec position proportionnelle */}
        <div 
          ref={scrollToTopRef} 
          className="absolute left-1/2 -translate-x-1/2 z-10 mx-auto w-fit scroll-to-top-container"
          style={{ bottom: `${bottomPosition}px` }}
        >
          <button
            onClick={scrollToTop}
            className="group flex items-center justify-center gap-1 xs:gap-2 px-3 py-2 xs:px-4 xs:py-3 sm:px-6 sm:py-4 text-dk-black transition-all duration-300 touch-target cursor-pointer"
            aria-label="Retourner en haut de la page"
          >  
            <ChevronUp className="scroll-to-top-icon group-hover:animate-bounce flex-shrink-0" />
            <span className="scroll-to-top-text text-xs xs:text-sm font-foundation-bold uppercase tracking-wide whitespace-nowrap">
              Retourner vers le haut
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
});

Footer.displayName = 'Footer';

export default Footer;

