import { useLayoutEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import { useNewsAPI } from '../../hooks/useNewsAPI';
import { Calendar, ArrowRight, ExternalLink, Loader2, AlertCircle, Mail } from 'lucide-react';
import { ImagePlaceholder } from '../ui';
import { calculateArticleReadingTime } from '../../utils/readingTime';

gsap.registerPlugin(ScrollTrigger);

// Styles CSS pour la grille responsive des News
const newsGridStyles = `
  .news-articles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  @media (min-width: 375px) {
    .news-articles-grid {
      gap: 1.5rem;
    }
  }
  @media (min-width: 640px) {
    .news-articles-grid {
      gap: 2rem;
    }
  }
  @media (min-width: 768px) {
    .news-articles-grid {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (min-width: 1024px) {
    .news-articles-grid {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }
  .news-article-card {
    width: 100%;
    max-width: 100%;
  }
  @media (min-width: 1024px) {
    .news-article-card.featured {
      grid-column: span 2;
    }
  }
`;

const News = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const navigate = useNavigate();

  // Récupération des actualités depuis l'API réelle
  const { news, loading, error, refetch } = useNewsAPI();

  // Handler pour le bouton Newsletter
  const handleNewsletterClick = () => {
    // Redirection vers la section contact avec pré-remplissage
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Optionnel : pré-remplir le formulaire avec "newsletter" comme sujet
      setTimeout(() => {
        const subjectInput = document.querySelector('[name="subject"], [name="projectType"]');
        if (subjectInput) {
          subjectInput.value = 'newsletter';
          subjectInput.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    } else {
      // Fallback : redirection vers contact
      window.location.href = '/#contact?subject=newsletter';
    }
  };

  // Handler pour "Voir toutes les actualités"
  const handleViewAllClick = () => {
    // Pour l'instant, on scroll vers le bas de la section actualités
    // ou on peut créer une page dédiée plus tard
    const newsSection = document.getElementById('news');
    if (newsSection) {
      newsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handler pour le lien "Lire la suite"
  const handleReadMore = (articleId, e) => {
    e.preventDefault();
    // Redirection vers la page de détail de l'article
    navigate(`/news/${articleId}`);
  };

  useLayoutEffect(() => {
    if (!sectionRef.current || loading) return;

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
  }, [loading, news]);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Date invalide';
      }
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Erreur de formatage de date:', error);
      return dateString;
    }
  };

  return (
    <section ref={sectionRef} className="py-40 bg-dk-black-animated">
      <style>{newsGridStyles}</style>
      <div className="container-custom section-padding">
        {/* Titre de section */}
        <div ref={titleRef} className="text-center mb-16">
          <h2 className="text-white text-clamp-3xl xs:text-clamp-4xl sm:text-clamp-5xl lg:text-clamp-6xl font-foundation-black mb-4 xs:mb-6">
            <span className="text-gradient">ACTUALITÉS</span> DE DK BUILDING
          </h2>
          <p className="text-clamp-lg xs:text-clamp-xl text-dk-gray-300 max-w-3xl mx-auto">
            Restez informé des dernières nouveautés, réglementations et innovations dans le secteur de la construction métallique
          </p>
        </div>

        {/* État de chargement */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-dk-yellow animate-spin mb-4" />
            <p className="text-dk-gray-300 text-lg">Chargement de nos dernières actualités...</p>
            <p className="text-dk-gray-400 text-sm mt-2">Cela ne prendra que quelques instants</p>
          </div>
        )}

        {/* État d'erreur */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-dk-gray-300 text-xl font-foundation-bold mb-2 text-center max-w-md">Impossible de charger les actualités</h3>
            <p className="text-dk-gray-300 text-lg mb-4 text-center max-w-md">{error}</p>
            <p className="text-dk-gray-400 text-sm mb-6 text-center max-w-md">
              Vérifiez votre connexion internet et réessayez. Si le problème persiste, notre équipe est là pour vous aider au <a href="tel:+33768113839" className="text-dk-yellow hover:text-yellow-300">+33 7 68 11 38 39</a> ou par e-mail à <a href="mailto:contact@dkbuilding.fr" className="text-dk-yellow hover:text-yellow-300">contact@dkbuilding.fr</a>.
            </p>
            <button 
              onClick={refetch}
              className="btn-primary touch-target font-foundation-black"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* État vide */}
        {!loading && !error && (!news || news.length === 0) && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 bg-dk-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-dk-gray-400" />
            </div>
            <h3 className="text-dk-gray-300 text-xl font-foundation-bold mb-3">Aucune actualité pour le moment</h3>
            <p className="text-dk-gray-400 text-sm mb-6 text-center max-w-md">
              Nous préparons de nouveaux contenus pour vous tenir informé. Revenez bientôt ou abonnez-vous à notre newsletter pour être informé en premier de nos actualités.
            </p>
            <button 
              onClick={handleNewsletterClick}
              className="btn-primary touch-target font-foundation-black"
            >
              S'abonner à la newsletter
            </button>
          </div>
        )}

        {/* Grid des actualités */}
        {!loading && !error && news && news.length > 0 && (
          <div className="news-articles-grid">
            {news.map((article, index) => (
              <article
                key={article.id}
                ref={el => cardsRef.current[index] = el}
                className={`news-article-card group bg-dk-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-dk-gray-800 card-hover flex flex-col ${
                  article.featured ? 'featured' : ''
                }`}
              >
                {/* Image avec gestion d'erreur */}
                <div className="relative h-48 xs:h-56 sm:h-64 overflow-hidden aspect-[4/3] flex-shrink-0 bg-dk-gray-800">
                  {/* Conteneur pour placeholder et image */}
                  <div className="absolute inset-0 w-full h-full">
                    <ImagePlaceholder
                      src={article.image && (typeof article.image === 'string' ? article.image.trim() : article.image) ? article.image : null}
                      alt={article.title}
                      placeholderText="Image à venir"
                      imageProps={{
                        className: "group-hover:scale-110 transition-transform duration-500"
                      }}
                    />
                  </div>
                  
                  {/* Overlay gradient pour améliorer la lisibilité */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dk-black/60 via-transparent to-transparent z-30 pointer-events-none" />
                  
                  {/* Badges et overlays */}
                  <div className="absolute inset-0 pointer-events-none z-40">
                    {article.featured && (
                      <div className="absolute top-4 left-4 z-50">
                        <span className="bg-gradient-to-r from-dk-yellow to-yellow-400 text-dk-black px-3 py-1 rounded-full text-xs font-foundation-bold">
                          À LA UNE
                        </span>
                      </div>
                    )}
                    {/* Dégradé en bas pour la lisibilité */}
                    <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dk-black/80 via-dk-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4 xs:p-6 sm:p-8 flex flex-col flex-1">
                  {/* Catégorie et date */}
                  <div className="flex items-center justify-between mb-3 xs:mb-4">
                    <span className="text-dk-yellow text-xs xs:text-sm font-foundation-bold uppercase tracking-wider">
                      {article.category || 'Actualité'}
                    </span>
                    <div className="flex items-center text-dk-gray-400 text-xs">
                      <Calendar className="w-3 h-3 mr-1" />
                      {formatDate(article.date)}
                    </div>
                  </div>

                  {/* Contenu principal - prend l'espace disponible */}
                  <div className="flex-1">
                    {/* Titre */}
                    <h3 className="text-lg xs:text-xl sm:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white group-hover:text-dk-yellow transition-colors duration-300">
                      {article.title}
                    </h3>

                    {/* Extrait */}
                    <p className="text-dk-gray-300 mb-4 xs:mb-6 leading-relaxed text-sm xs:text-base">
                      {article.excerpt}
                    </p>
                  </div>

                  {/* Footer de l'article - toujours en bas */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-gradient-top">
                    {/* Temps de lecture */}
                    <span className="text-dk-gray-400 text-xs">
                      {calculateArticleReadingTime(article)} de lecture
                    </span>
                    {/* Lien vers l'article */}
                    {article.isPublished !== false ? (
                      <button
                        onClick={(e) => handleReadMore(article.id, e)}
                        className="flex items-center text-dk-yellow hover:text-yellow-300 transition-colors duration-300 group/btn"
                      >
                        <span className="text-sm font-foundation-bold mr-2">Lire la suite</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                      </button>
                    ) : (
                      <span className="flex items-center text-dk-gray-500 text-sm">
                        <span className="text-xs font-foundation-bold mr-2">En cours de rédaction</span>
                        <Loader2 className="w-3 h-3 animate-spin" />
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Section CTA pour voir toutes les actualités */}
        {!loading && !error && news && news.length > 0 && (
          <div className="text-center mt-12 xs:mt-14 sm:mt-16">
            <div className="bg-gradient-to-r from-dk-yellow/10 to-yellow-300/10 rounded-2xl p-6 xs:p-8 border border-dk-yellow/20">
              <h3 className="text-xl xs:text-2xl font-foundation-bold mb-3 xs:mb-4 text-white">
                RESTEZ INFORMÉ DE NOS ACTUALITÉS
              </h3>
              <p className="text-dk-gray-300 mb-4 xs:mb-6 text-sm xs:text-base">
                Abonnez-vous à notre newsletter pour recevoir les dernières informations du secteur directement dans votre boîte mail.
              </p>
              <p className="text-dk-gray-400 mb-4 xs:mb-6 text-xs xs:text-sm">
                Un e-mail par semaine maximum. Désinscription en un clic.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 xs:gap-4 justify-center items-center">
                <button 
                  onClick={handleNewsletterClick}
                  className="btn-primary touch-target font-foundation-black"
                >
                  S'ABONNER À LA NEWSLETTER
                </button>
                <button 
                  onClick={handleViewAllClick}
                  className="btn-secondary touch-target flex items-center font-foundation-black"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  VOIR TOUTES LES ACTUALITÉS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default News;
