import { useLayoutEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapConfig';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';

/**
 * Composant d'indicateur de navigation intelligent
 * Affiche la progression et permet la navigation entre sections
 */
const SmartNavigationIndicator = () => {
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const dotsRef = useRef([]);
  const arrowRef = useRef(null);
  
  const {
    sections,
    currentSection,
    scrollToNextSection,
    scrollToPreviousSection,
    scrollToSection,
    isScrolling
  } = useSmartNavigation();

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animation d'entrée du conteneur
      gsap.fromTo(containerRef.current,
        { 
          x: 50, 
          opacity: 0,
          scale: 0.8
        },
        {
          x: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "power3.out",
          delay: 1.5
        }
      );

      // Animation des points de progression
      dotsRef.current.forEach((dot, index) => {
        if (dot) {
          gsap.fromTo(dot,
            { 
              scale: 0, 
              opacity: 0,
              rotation: -180
            },
            {
              scale: 1,
              opacity: 1,
              rotation: 0,
              duration: 0.6,
              ease: "back.out(1.7)",
              delay: 1.8 + (index * 0.1)
            }
          );
        }
      });

      // Animation de la flèche
      if (arrowRef.current) {
        gsap.fromTo(arrowRef.current,
          { 
            y: -20, 
            opacity: 0,
            rotation: -10
          },
          {
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: 0.8,
            ease: "power3.out",
            delay: 2.2
          }
        );

        // Animation de bounce continue pour la flèche
        gsap.to(arrowRef.current, {
          y: 8,
          duration: 1.5,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1,
          delay: 2.5
        });
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Animation de la progression
  useLayoutEffect(() => {
    if (!progressRef.current) return;

    const progress = (currentSection / (sections.length - 1)) * 100;
    
    gsap.to(progressRef.current, {
      height: `${progress}%`,
      duration: 0.8,
      ease: "power3.out"
    });

    // Animation des points actifs/inactifs
    dotsRef.current.forEach((dot, index) => {
      if (dot) {
        const isActive = index === currentSection;
        const isPassed = index < currentSection;
        
        gsap.to(dot, {
          scale: isActive ? 1.3 : 1,
          backgroundColor: isActive ? '#F59E0B' : isPassed ? '#10B981' : '#6B7280',
          duration: 0.4,
          ease: "power2.out"
        });
      }
    });
  }, [currentSection, sections.length]);

  // Masquer l'indicateur pendant le scroll
  useLayoutEffect(() => {
    if (isScrolling) {
      gsap.to(containerRef.current, {
        opacity: 0.3,
        scale: 0.95,
        duration: 0.3
      });
    } else {
      gsap.to(containerRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.3
      });
    }
  }, [isScrolling]);

  const handleNextClick = () => {
    scrollToNextSection();
  };

  const handlePreviousClick = () => {
    scrollToPreviousSection();
  };

  const handleDotClick = (index) => {
    if (index !== currentSection) {
      const sectionId = sections[index]?.id;
      if (sectionId) {
        scrollToSection(sectionId);
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:flex flex-col items-center space-y-4"
    >
      {/* Bouton précédent */}
      <button
        onClick={handlePreviousClick}
        disabled={currentSection === 0 || isScrolling}
        className="w-10 h-10 rounded-full bg-dk-gray-800/80 backdrop-blur-sm border border-dk-gray-600 flex items-center justify-center text-white hover:bg-dk-yellow hover:text-dk-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Section précédente"
      >
        <svg 
          className="w-4 h-4 transform rotate-90 group-hover:scale-110 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Barre de progression */}
      <div className="relative flex flex-col items-center">
        {/* Barre de progression verticale */}
        <div className="w-1 h-32 bg-dk-gray-700 rounded-full overflow-hidden">
          <div 
            ref={progressRef}
            className="w-full bg-gradient-to-b from-dk-yellow to-dk-yellow/60 rounded-full transition-all duration-500"
            style={{ height: '0%' }}
          />
        </div>

        {/* Points de progression */}
        <div className="absolute left-1/2 transform -translate-x-1/2 flex flex-col justify-between h-32 py-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              ref={el => dotsRef.current[index] = el}
              onClick={() => handleDotClick(index)}
              className="w-3 h-3 rounded-full bg-dk-gray-500 hover:bg-dk-yellow transition-all duration-300"
              aria-label={`Aller à la section ${section.name}`}
              title={section.name}
            />
          ))}
        </div>
      </div>

      {/* Bouton suivant */}
      <button
        ref={arrowRef}
        onClick={handleNextClick}
        disabled={currentSection === sections.length - 1 || isScrolling}
        className="w-10 h-10 rounded-full bg-dk-gray-800/80 backdrop-blur-sm border border-dk-gray-600 flex items-center justify-center text-white hover:bg-dk-yellow hover:text-dk-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
        aria-label="Section suivante"
      >
        <svg 
          className="w-4 h-4 transform -rotate-90 group-hover:scale-110 transition-transform duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Indicateur de section actuelle */}
      <div className="text-xs text-dk-gray-400 text-center mt-2 px-2 py-1 bg-dk-gray-800/60 backdrop-blur-sm rounded-lg">
        <div className="font-foundation-bold text-dk-yellow">
          {sections[currentSection]?.name}
        </div>
        <div className="text-dk-gray-500">
          {currentSection + 1} / {sections.length}
        </div>
      </div>
    </div>
  );
};

export default SmartNavigationIndicator;
