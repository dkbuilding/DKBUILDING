import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import { Hammer, Shield, Home, Sun, Thermometer, Tractor } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Styles CSS pour la grille responsive des Services
const servicesGridStyles = `
  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 375px) {
    .services-grid {
      gap: 1.5rem;
    }
  }
  @media (min-width: 640px) {
    .services-grid {
      gap: 2rem;
    }
  }
  @media (min-width: 768px) {
    .services-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (min-width: 1024px) {
    .services-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  @media (min-width: 1280px) {
    .services-grid {
      grid-template-columns: repeat(5, minmax(0, 1fr));
    }
  }
  .service-card {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 767px) {
    .service-card {
      max-width: 100%;
    }
  }
`;

const Services = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const services = [
    {
      icon: Hammer,
      title: "Charpente",
      description: "Construction et installation de charpentes métalliques sur mesure pour tous types de bâtiments.",
      features: [
        "Charpentes métalliques industrielles",
        "Charpentes pour bâtiments commerciaux",
        "Renforcement et réparation",
        "Calculs structurels certifiés"
      ],
      color: "from-dk-yellow to-yellow-400"
    },
    {
      icon: Shield,
      title: "Bardage",
      description: "Pose de bardages métalliques et composites pour protéger et embellir vos façades.",
      features: [
        "Bardage métallique (acier, aluminium)",
        "Bardage composite",
        "Isolation thermique intégrée",
        "Finitions sur mesure"
      ],
      color: "from-dk-yellow to-yellow-400"
    },
    {
      icon: Home,
      title: "Couverture",
      description: "Installation et réparation de couvertures métalliques avec garantie qualité.",
      features: [
        "Couvertures métalliques",
        "Étanchéité parfaite",
        "Ventilation intégrée",
        "Maintenance préventive"
      ],
      color: "from-dk-yellow to-yellow-400"
    },
    {
      icon: Sun,
      title: "Photovoltaïque",
      description: "Installation de systèmes photovoltaïques pour produire votre propre électricité verte.",
      features: [
        "Panneaux solaires photovoltaïques",
        "Installation sur toiture métallique",
        "Onduleurs et systèmes de monitoring",
        "Maintenance et SAV"
      ],
      color: "from-dk-yellow to-yellow-400"
    },
    // Service Climatisation mis en pause temporairement
    // {
    //   icon: Thermometer,
    //   title: "Climatisation",
    //   description: "Installation et maintenance de systèmes de climatisation pour votre confort.",
    //   features: [
    //     "Climatisation réversible",
    //     "Pompes à chaleur",
    //     "Installation et raccordement",
    //     "Maintenance préventive"
    //   ],
    //   color: "from-dk-yellow to-yellow-400"
    // },
    {
      icon: Tractor,
      title: "Terrassement",
      description: "Préparation des terrains et travaux de terrassement pour vos projets de construction.",
      features: [
        "Déblaiement et remblaiement",
        "Nivellement de terrain",
        "Tranchées et fouilles",
        "Préparation de fondations"
      ],
      color: "from-dk-yellow to-yellow-400"
    }
  ];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Animation du titre
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
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

      // Animation des cartes avec stagger
      cardsRef.current.forEach((card, index) => {
        if (card) {
          gsap.fromTo(card,
            gsapUtils.fadeInUp(card, index * motionTokens.stagger.normal),
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: card,
                ...scrollTriggerDefaults
              }
            }
          );

          // Animation hover
          const handleMouseEnter = () => {
            gsap.to(card, gsapUtils.hoverScale(card));
          };
          
          const handleMouseLeave = () => {
            gsap.to(card, gsapUtils.hoverReset(card));
          };

          card.addEventListener('mouseenter', handleMouseEnter);
          card.addEventListener('mouseleave', handleMouseLeave);

          return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
          };
        }
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-40 bg-dk-gray-900-animated">
      <style>{servicesGridStyles}</style>
      <div className="container-custom section-padding">
        {/* Titre de section */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-white text-clamp-3xl xs:text-clamp-4xl sm:text-clamp-5xl lg:text-clamp-6xl font-foundation-black mb-4 xs:mb-6">
            NOS <span className="text-gradient">SERVICES</span>
          </h2>
          <p className="text-clamp-lg xs:text-clamp-xl text-dk-gray-300 max-w-3xl mx-auto">
            Expertise technique et savoir-faire artisanal pour tous vos projets de construction métallique
          </p>
        </div>

        {/* Grid des services */}
        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={service.title}
                ref={el => cardsRef.current[index] = el}
                className="service-card group bg-dk-gray-900/50 backdrop-blur-sm rounded-2xl p-4 xs:p-6 sm:p-8 border border-dk-gray-800 card-hover"
              >
                {/* Icône avec gradient */}
                <div className={`w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 rounded-lg xs:rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 xs:mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-dk-black" />
                </div>

                {/* Titre */}
                <h3 className="text-lg xs:text-xl sm:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-dk-gray-300 mb-4 xs:mb-6 leading-relaxed text-sm xs:text-base">
                  {service.description}
                </p>

                {/* Liste des fonctionnalités */}
                <ul className="space-y-2 xs:space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className={`w-1.5 h-1.5 xs:w-2 xs:h-2 rounded-full bg-gradient-to-r ${service.color} mt-2 mr-2 xs:mr-3 flex-shrink-0`}></div>
                      <span className="text-dk-gray-400 text-xs xs:text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

              </div>
            );
          })}
        </div>

        {/* Section CTA globale */}
        <div className="text-center mt-12 xs:mt-14 sm:mt-16">
          <div className="bg-gradient-to-r from-dk-yellow/10 to-yellow-300/10 rounded-2xl p-6 xs:p-8 border border-dk-yellow/20">
            <h3 className="text-xl xs:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white">
              BESOIN D'UN PROJET SUR MESURE ?
            </h3>
            <p className="text-dk-gray-300 mb-4 xs:mb-6 text-sm xs:text-base">
              Notre équipe d'experts vous accompagne de la conception à la réalisation pour garantir un résultat à la hauteur de vos attentes.
            </p>
            <p className="text-dk-gray-400 mb-4 xs:mb-6 text-xs xs:text-sm">
              Réponse sous 24h. Devis gratuit et sans engagement. Aucune obligation de votre part.
            </p>
            <button className="btn-primary touch-target font-foundation-black">
              Demander mon devis gratuit
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
