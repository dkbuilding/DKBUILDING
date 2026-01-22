import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import { Award, Users, Calendar, MapPin, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

// Styles CSS pour les grilles responsive de la section About
const aboutGridStyles = `
  .about-stats-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    justify-items: center;
    margin-bottom: 3rem;
  }
  @media (min-width: 375px) {
    .about-stats-grid {
      gap: 1.5rem;
      margin-bottom: 4rem;
    }
  }
  @media (min-width: 640px) {
    .about-stats-grid {
      margin-bottom: 5rem;
    }
  }
  @media (min-width: 768px) {
    .about-stats-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-items: stretch;
    }
  }
  @media (min-width: 1024px) {
    .about-stats-grid {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
  }
  .about-stat-card {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 767px) {
    .about-stat-card {
      width: 100%;
      max-width: 100%;
      padding: 1.5rem;
      background: rgba(14, 14, 14, 0.5);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
    }
  }
  .about-values-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    justify-items: center;
  }
  @media (min-width: 375px) {
    .about-values-grid {
      gap: 1.5rem;
    }
  }
  @media (min-width: 768px) {
    .about-values-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      justify-items: stretch;
    }
  }
  @media (min-width: 1024px) {
    .about-values-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  .about-value-card {
    width: 100%;
    max-width: 100%;
  }
  @media (max-width: 767px) {
    .about-value-card {
      width: 100%;
      max-width: 100%;
      padding: 1.5rem;
      background: rgba(14, 14, 14, 0.5);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 1rem;
    }
  }
`;

const About = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);

  const stats = [
    { icon: Calendar, label: "Années d'expérience", value: "20+", description: "Expérience familial" },
    { icon: Users, label: "Équipe experte", value: "20+", description: "Personnes qualifiées, équipe sur-mesure en fonction des projets" },
    { icon: Award, label: "Projets réalisés", value: "50+", description: "Chantiers réussis" },
    { icon: MapPin, label: "Zone d'intervention", value: "France", description: "Intervention nationale" }
  ];

  const values = [
    {
      title: "Expertise Technique",
      description: "Maîtrise des techniques de construction métallique et des normes en vigueur",
      icon: Award
    },
    {
      title: "Qualité Garantie",
      description: "Engagement sur la qualité des matériaux et la finition de nos réalisations",
      icon: CheckCircle
    },
    {
      title: "Proximité",
      description: "Basés à Albi, nous intervenons rapidement dans toute la France",
      icon: MapPin
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

      // Animation du contenu principal
      if (contentRef.current) {
        gsap.fromTo(contentRef.current,
          gsapUtils.slideInLeft(contentRef.current, 0.2),
          { 
            x: 0, 
            opacity: 1,
            scrollTrigger: {
              trigger: contentRef.current,
              ...scrollTriggerDefaults
            }
          }
        );
      }

      // Animation des statistiques
      const statElements = statsRef.current?.children;
      if (statElements) {
        Array.from(statElements).forEach((stat, index) => {
          gsap.fromTo(stat,
            gsapUtils.scaleIn(stat, index * motionTokens.stagger.fast),
            {
              scale: 1,
              opacity: 1,
              scrollTrigger: {
                trigger: stat,
                ...scrollTriggerDefaults
              }
            }
          );
        });
      }

      // Animation des valeurs
      const valueElements = valuesRef.current?.children;
      if (valueElements) {
        Array.from(valueElements).forEach((value, index) => {
          gsap.fromTo(value,
            gsapUtils.fadeInUp(value, index * motionTokens.stagger.normal),
            {
              y: 0,
              opacity: 1,
              scrollTrigger: {
                trigger: value,
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
    <section ref={sectionRef} className="py-40 bg-dk-gray-900-animated">
      <style>{aboutGridStyles}</style>
      <div className="container-custom section-padding">
        {/* Titre de section */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-white text-clamp-3xl xs:text-clamp-4xl sm:text-clamp-5xl lg:text-clamp-6xl font-foundation-black mb-4 xs:mb-6">
            À PROPOS DE <span className="text-gradient">DK BUILDING</span>
          </h2>
          <p className="text-clamp-lg xs:text-clamp-xl text-dk-gray-300 max-w-3xl mx-auto">
            Votre partenaire de confiance pour tous vos projets de construction métallique en France
          </p>
        </div>

        {/* Sections principales - Layout responsive optimisé mobile */}
        <div ref={contentRef} className="space-y-6 xs:space-y-8 sm:space-y-10 mb-12 xs:mb-16 sm:mb-20">
          {/* 1. NOTRE HISTOIRE - Pleine largeur sur mobile */}
          <div className="bg-dk-gray-900/50 backdrop-blur-sm rounded-2xl p-4 xs:p-6 sm:p-8 border border-dk-gray-800">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white uppercase">
              NOTRE HISTOIRE
            </h3>
            <p className="text-dk-gray-300 leading-relaxed mb-3 xs:mb-4 text-sm xs:text-base">
              <strong className="font-foundation-black hover:text-dk-yellow">DK BUILDING</strong> créée en janvier 2023 par <strong className="text-dk-yellow">Dicalou KHAMIDOV</strong> avec 
              une vision claire : apporter expertise et qualité dans le domaine de la construction métallique.
            </p>
            <p className="text-dk-gray-300 leading-relaxed text-sm xs:text-base break-anywhere">
              Basée à <strong>Albi</strong> dans Sud-Ouest de la France dans le département du Tarn en Occitanie, notre entreprise 
              intervient dans toute la France pour tous types de projets : charpentes métalliques, 
              bardages et couvertures. Nous sommes spécialisés dans la construction de bâtiments industriels, 
              commerciaux et résidentiels.
            </p>
          </div>

          {/* Statistiques */}
          <div ref={statsRef} className="about-stats-grid">
            {stats.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div key={stat.label} className="about-stat-card text-center">
                  <div className="w-12 h-12 xs:w-14 xs:h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-dk-yellow to-yellow-300 rounded-xl xs:rounded-2xl flex items-center justify-center mx-auto mb-3 xs:mb-4">
                    <IconComponent className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 text-dk-black" />
                  </div>
                  <div className="text-2xl xs:text-3xl font-foundation-black text-white mb-1 xs:mb-2">
                    {stat.value}
                  </div>
                  <div className="text-dk-gray-300 font-medium mb-1 text-sm xs:text-base">
                    {stat.label}
                  </div>
                  <div className="text-dk-gray-500 text-xs xs:text-sm">
                    {stat.description}
                  </div>
                </div>
              );
            })}
          </div>

          {/* 2. NOS SPÉCIALITÉS - Pleine largeur sur mobile */}
          <div className="bg-dk-gray-900/50 backdrop-blur-sm rounded-2xl p-4 xs:p-6 sm:p-8 border border-dk-gray-800">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white uppercase">
              NOS SPÉCIALITÉS
            </h3>
            <ul className="space-y-2 xs:space-y-3">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-dk-yellow mt-1 mr-2 xs:mr-3 flex-shrink-0" />
                <span className="text-dk-gray-300 text-sm xs:text-base">
                  <strong>Travaux de construction métallique</strong> - Charpentes industrielles et commerciales
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-dk-yellow mt-1 mr-2 xs:mr-3 flex-shrink-0" />
                <span className="text-dk-gray-300 text-sm xs:text-base">
                  <strong>Bardage</strong> - Pose de bardages métalliques et composites
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-dk-yellow mt-1 mr-2 xs:mr-3 flex-shrink-0" />
                <span className="text-dk-gray-300 text-sm xs:text-base">
                  <strong>Couverture</strong> - Installation et réparation de couvertures métalliques
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 xs:w-5 xs:h-5 text-dk-yellow mt-1 mr-2 xs:mr-3 flex-shrink-0" />
                <span className="text-dk-gray-300 text-sm xs:text-base">
                  <strong>Climatisation et froid</strong> - Services complémentaires
                </span>
              </li>
            </ul>
          </div>

          {/* 3. INFORMATIONS LÉGALES - Pleine largeur sur mobile */}
          <div className="bg-gradient-to-br from-dk-yellow/10 to-yellow-300/10 rounded-2xl p-4 xs:p-6 sm:p-8 border border-dk-yellow/20">
            <h3 className="text-lg xs:text-xl sm:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white uppercase">
              INFORMATIONS LÉGALES
            </h3>
            <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 xs:gap-4">
              <div>
                <span className="text-dk-gray-400 text-xs xs:text-sm">SIREN</span>
                <p className="text-white font-medium text-sm xs:text-base">947 998 555</p>
              </div>
              <div>
                <span className="text-dk-gray-400 text-xs xs:text-sm">RCS</span>
                <p className="text-white font-medium text-sm xs:text-base">Albi B 947998555</p>
              </div>
              <div>
                <span className="text-dk-gray-400 text-xs xs:text-sm">Forme juridique</span>
                <p className="text-white font-medium text-sm xs:text-base">SAS</p>
              </div>
              <div>
                <span className="text-dk-gray-400 text-xs xs:text-sm">Capital social</span>
                <p className="text-white font-medium text-sm xs:text-base">1 000 €</p>
              </div>
              <div className="xs:col-span-2">
                <span className="text-dk-gray-400 text-xs xs:text-sm">Création</span>
                <p className="text-white font-medium text-sm xs:text-base">9 janvier 2023</p>
              </div>
            </div>
          </div>
        </div>

        {/* Valeurs */}
        <div ref={valuesRef} className="about-values-grid">
          {values.map((value) => {
            const IconComponent = value.icon;
            return (
              <div key={value.title} className="about-value-card text-center">
                <div className="w-16 h-16 xs:w-18 xs:h-18 sm:w-20 sm:h-20 bg-gradient-to-br from-dk-yellow/20 to-yellow-300/20 rounded-2xl xs:rounded-3xl flex items-center justify-center mx-auto mb-4 xs:mb-6">
                  <IconComponent className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 text-dk-yellow" />
                </div>
                <h3 className="text-lg xs:text-xl font-foundation-bold mb-3 xs:mb-4 text-white">
                  {value.title}
                </h3>
                <p className="text-dk-gray-300 leading-relaxed text-sm xs:text-base">
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
