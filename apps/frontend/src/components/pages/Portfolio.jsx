import { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImagePlaceholder } from '../ui';

gsap.registerPlugin(ScrollTrigger);

// Styles CSS pour la grille responsive du Portfolio
const portfolioGridStyles = `
  .portfolio-projects-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    align-items: stretch;
  }
  @media (min-width: 375px) {
    .portfolio-projects-grid {
      gap: 1.5rem;
    }
  }
  @media (min-width: 640px) {
    .portfolio-projects-grid {
      gap: 2rem;
    }
  }
  @media (min-width: 768px) {
    .portfolio-projects-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  .portfolio-project-card {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 767px) {
    .portfolio-project-card {
      max-width: 100%;
    }
  }
`;

const Portfolio = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const lightboxRef = useRef(null);
  const projectInfoRef = useRef(null);
  const navigationRef = useRef(null);
  // Données des projets
  const projects = [
    {
      id: 1,
      title: "Charpente Industrielle",
      category: "Charpente",
      description: "Construction d'une charpente métallique pour entrepôt industriel de 2000m²",
      location: "Albi, Tarn"
    },
    {
      id: 2,
      title: "Bardage Commercial",
      category: "Bardage",
      description: "Pose de bardage métallique pour centre commercial avec isolation thermique",
      location: "Toulouse, Haute-Garonne"
    },
    {
      id: 3,
      title: "Couverture Métallique",
      category: "Couverture",
      description: "Installation de couverture métallique pour bâtiment agricole",
      location: "Castres, Tarn"
    },
    {
      id: 4,
      title: "Réhabilitation Structure",
      category: "Charpente",
      description: "Renforcement de structure métallique existante pour extension",
      location: "Montauban, Tarn-et-Garonne"
    },
    {
      id: 5,
      title: "Bardage Résidentiel",
      category: "Bardage",
      description: "Bardage composite pour maison individuelle avec finition sur mesure",
      location: "Rodez, Aveyron"
    },
    {
      id: 6,
      title: "Couverture Industrielle",
      category: "Couverture",
      description: "Couverture métallique pour usine avec système de ventilation intégré",
      location: "Carcassonne, Aude"
    }
  ];
  const openLightbox = (index) => {
    setCurrentImage(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
  };
  // Animation de la lightbox
  useLayoutEffect(() => {
    if (!lightboxOpen || !lightboxRef.current) return;

    const ctx = gsap.context(() => {
      // Animation d'entrée de la lightbox
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      tl.fromTo(lightboxRef.current, 
        { opacity: 0 },
        { opacity: 1, duration: 0.3 }
      )
      .fromTo(projectInfoRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        "-=0.2"
      )
      .fromTo(navigationRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4 },
        "-=0.3"
      );
    }, lightboxRef);

    return () => ctx.revert();
  }, [lightboxOpen, currentImage]);
  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % projects.length);
  };
  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + projects.length) % projects.length);
  };
  // Fonction pour gérer le clic sur le bouton CTA
  const handleStartProject = () => {
    // Fermer la lightbox
    closeLightbox();
    
    // Scroll vers la section contact
    setTimeout(() => {
      const contactSection = document.querySelector('#contact');
      if (contactSection) {
        contactSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 300);
  };
  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Animation du titre (sécurisée)
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          gsapUtils.fadeInUp(titleRef.current),
          { 
            y: 0, 
            opacity: 1,
            scrollTrigger: {
              trigger: titleRef.current,
              ...scrollTriggerDefaults
            }
          }
        );
      }

      // Animation de la grille avec stagger
      const gridItems = gridRef.current?.children;
      if (gridItems && gridItems.length) {
        Array.from(gridItems).forEach((item, index) => {
          if (!item) return;
          gsap.fromTo(
            item,
            gsapUtils.fadeInUp(item, index * motionTokens.stagger.fast),
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: item,
                ...scrollTriggerDefaults
              }
            }
          );
        });
      }

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <section ref={sectionRef} className="py-40 bg-dk-black-animated">
        <style>{portfolioGridStyles}</style>
        <div className="container-custom section-padding">
          {/* Titre de section */}
          <div ref={titleRef} className="text-center mb-16">
            <h2 className="text-white text-clamp-3xl xs:text-clamp-4xl sm:text-clamp-5xl lg:text-clamp-6xl font-foundation-black mb-4 xs:mb-6">
              NOS <span className="text-gradient">RÉALISATIONS</span>
            </h2>
            <p className="text-clamp-lg xs:text-clamp-xl text-dk-gray-300 max-w-3xl mx-auto">
              Découvrez nos projets récents et notre expertise en construction métallique
            </p>
          </div>

          {/* Grid des projets */}
          <div 
            ref={gridRef}
            className="portfolio-projects-grid"
          >
            {projects.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-20 h-20 bg-dk-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-dk-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-foundation-bold text-white mb-3">
                    Aucun projet disponible pour le moment
                  </h3>
                  <p className="text-dk-gray-300 mb-6">
                    Nos réalisations sont en cours de mise à jour. Revenez bientôt pour découvrir nos derniers projets, ou contactez-nous directement pour discuter de votre projet.
                  </p>
                  <button 
                    onClick={handleStartProject}
                    className="btn btn-primary touch-target font-foundation-black"
                  >
                    Démarrer mon projet
                  </button>
                </div>
              </div>
            ) : (
              projects.map((project, index) => (
              <div
                key={project.id}
                className="portfolio-project-card group bg-dk-black/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-dk-gray-800 card-hover cursor-pointer flex flex-col h-full"
                onClick={() => openLightbox(index)}
              >
                {/* Image du projet - Placeholder "Image à venir" */}
                <div className="relative h-48 xs:h-56 sm:h-64 overflow-hidden aspect-[4/3] flex-shrink-0 bg-dk-gray-800">
                  {/* Conteneur pour placeholder et image */}
                  <div className="absolute inset-0 w-full h-full">
                    <ImagePlaceholder
                      src={null}
                      alt={project.title}
                      placeholderText="Image à venir"
                      imageProps={{
                        className: "group-hover:scale-110 transition-transform duration-500"
                      }}
                    />
                  </div>
                  
                  {/* Badges et overlays */}
                  <div className="absolute inset-0 pointer-events-none z-20">
                    {/* Badge en bas à gauche */}
                    <div className="absolute bottom-4 left-4 z-30">
                      <span className="inline-block bg-dk-yellow text-dk-black px-3 py-1 rounded-full text-sm font-medium shadow-[0_10px_30px_rgba(243,231,25,0.25)]">
                        {project.category}
                      </span>
                    </div>
                    {/* Dégradé en bas pour la lisibilité */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dk-black/80 via-dk-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-4 xs:p-5 sm:p-6 flex flex-col flex-1">
                  {/* Contenu principal - prend l'espace disponible */}
                  <div className="flex-1">
                    <h3 className="text-lg xs:text-xl font-foundation-bold mb-2 text-white">
                      {project.title}
                    </h3>
                    <p className="text-dk-gray-400 text-xs xs:text-sm mb-3 xs:mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  
                  {/* Footer - toujours en bas */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-gradient-top">
                    <span className="text-dk-gray-500 text-xs xs:text-sm">
                      📍 {project.location}
                    </span>
                    <button className="btn btn-primary btn--sm touch-target">
                      Découvrir le projet
                    </button>
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12 xs:mt-14 sm:mt-16">
            <div className="bg-gradient-to-r from-dk-yellow/10 to-yellow-300/10 rounded-2xl p-6 xs:p-8 border border-dk-yellow/20">
              <h3 className="text-xl xs:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white">
                VOTRE PROJET NOUS INTÉRESSE ?
              </h3>
              <p className="text-dk-gray-300 mb-4 xs:mb-6 text-sm xs:text-base">
                Contactez-nous pour discuter de votre projet et obtenir un devis personnalisé adapté à vos besoins.
              </p>
              <p className="text-dk-gray-400 mb-4 xs:mb-6 text-xs xs:text-sm">
                Réponse sous 24h. Devis gratuit et sans engagement. Aucune obligation de votre part.
              </p>
              <button 
                onClick={handleStartProject}
                className="btn btn-primary btn--lg touch-target font-foundation-black"
              >
                Démarrer mon projet
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <div ref={lightboxRef} className="fixed inset-0 z-50 bg-dk-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-[90vh] w-full">
            {/* Bouton fermer - au-dessus de tout */}
            <button
              onClick={closeLightbox}
              className="fixed top-4 right-4 z-[9999] bg-dk-black/80 hover:bg-dk-black text-white p-3 rounded-full transition-colors duration-200 touch-target shadow-lg"
              style={{ zIndex: 9999 }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            <button
              onClick={prevImage}
              className="fixed left-4 top-1/2 transform -translate-y-1/2 z-[9998] bg-dk-black/80 hover:bg-dk-black text-white p-3 rounded-full transition-colors duration-200 touch-target shadow-lg"
              style={{ zIndex: 9998 }}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={nextImage}
              className="fixed right-4 top-1/2 transform -translate-y-1/2 z-[9998] bg-dk-black/80 hover:bg-dk-black text-white p-3 rounded-full transition-colors duration-200 touch-target shadow-lg"
              style={{ zIndex: 9998 }}
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image principale - Placeholder "Image à venir" */}
            <div className="w-full h-full min-h-[400px] bg-dk-gray-800 rounded-lg relative overflow-hidden">
              <ImagePlaceholder
                src={null}
                alt={projects[currentImage].title}
                placeholderText="Image à venir"
              />
            </div>

            {/* Informations du projet - Design amélioré */}
            <div ref={projectInfoRef} className="absolute bottom-0 left-0 right-0">
              {/* Dégradé de fond avec effet mesh */}
              <div className="bg-gradient-to-t from-dk-black/95 via-dk-black/80 to-transparent p-6 xs:p-8 rounded-b-lg">
                {/* Badge catégorie en haut */}
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block bg-dk-yellow text-dk-black px-4 py-2 rounded-full text-sm font-foundation-bold shadow-[0_8px_25px_rgba(243,231,25,0.3)]">
                    {projects[currentImage].category}
                  </span>
                  <span className="text-dk-gray-400 text-sm flex items-center">
                    📍 {projects[currentImage].location}
                  </span>
                </div>

                {/* Titre du projet */}
                <h3 className="text-xl xs:text-2xl sm:text-3xl font-foundation-black text-white mb-3 xs:mb-4 leading-tight">
                  {projects[currentImage].title}
                </h3>

                {/* Description */}
                <p className="text-dk-gray-300 mb-6 xs:mb-8 text-sm xs:text-base leading-relaxed max-w-2xl">
                  {projects[currentImage].description}
                </p>

                {/* Bouton CTA principal */}
                <div className="flex justify-center">
                  <button 
                    onClick={handleStartProject}
                    className="btn btn-primary btn--lg touch-target font-foundation-black shadow-[0_10px_30px_rgba(243,231,25,0.25)] hover:shadow-[0_15px_40px_rgba(243,231,25,0.35)] transition-all duration-300"
                  >
                    Démarrer mon projet
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Portfolio;
