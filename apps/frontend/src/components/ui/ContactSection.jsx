import { useLayoutEffect, useRef, forwardRef } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapConfig';
import { motionTokens, gsapUtils, scrollTriggerDefaults } from '../../utils/motion';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock 
} from 'lucide-react';

const ContactSection = forwardRef(({ className, ...props }, ref) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  // Combiner les refs
  const combinedRef = (node) => {
    sectionRef.current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

  const contactCards = [
    {
      icon: MapPin,
      title: 'ADRESSE',
      content: '59 Rue Pierre Cormary\n81000 Albi, Tarn\nOccitanie, France',
      href: 'https://maps.google.com/?q=59+Rue+Pierre+Cormary+81000+Albi',
      ariaLabel: 'Voir l\'adresse DK BUILDING sur Google Maps'
    },
    {
      icon: Phone,
      title: 'TÉLÉPHONE',
      content: '+33 7 68 11 38 39',
      href: 'tel:+33768113839',
      ariaLabel: 'Appeler DK BUILDING au 07 68 11 38 39'
    },
    {
      icon: Mail,
      title: 'EMAIL',
      content: 'contact@dkbuilding.fr',
      href: 'mailto:contact@dkbuilding.fr',
      ariaLabel: 'Envoyer un email à contact@dkbuilding.fr'
    },
    {
      icon: Clock,
      title: 'HORAIRES',
      content: 'Lun-Ven : 8h-18h\nSam : 9h-12h',
      href: null,
      ariaLabel: null
    }
  ];

  useLayoutEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Vérifier si les éléments existent avant de les animer
      const elements = [
        { ref: titleRef, delay: 0 },
        { ref: cardsRef, delay: 0.2 }
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

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={combinedRef}
      className={`bg-dk-gray-900 py-12 md:py-16 lg:py-20 ${className || ''}`}
      role="region"
      aria-label="Section de contact"
      {...props}
    >
      <div className="container-custom section-padding">
        <h2 
          ref={titleRef}
          className="font-foundation-bold text-2xl md:text-3xl lg:text-4xl text-white mb-8 lg:mb-12 text-center"
        >
          CONTACTEZ-NOUS
        </h2>
        
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {contactCards.map((card, index) => {
            const IconComponent = card.icon;
            const isClickable = card.href !== null;
            
            const CardContent = () => (
              <div className="flex flex-col items-center text-center p-6 bg-dk-black/50 rounded-xl border border-dk-gray-800 hover:border-dk-yellow/30 transition-all duration-300 group">
                <div className="w-12 h-12 mb-4 flex items-center justify-center">
                  <IconComponent 
                    className="w-8 h-8 text-dk-yellow group-hover:text-white transition-colors duration-300" 
                    aria-hidden="true"
                  />
                </div>
                
                <h3 className="font-foundation-bold text-lg text-white mb-3">
                  {card.title}
                </h3>
                
                <div className="text-dk-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {card.content}
                </div>
              </div>
            );

            if (isClickable) {
              return (
                <a
                  key={index}
                  href={card.href}
                  target={card.href.startsWith('http') ? '_blank' : undefined}
                  rel={card.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="block no-underline hover:transform hover:scale-105 transition-transform duration-300"
                  aria-label={card.ariaLabel}
                >
                  <CardContent />
                </a>
              );
            }

            return (
              <div key={index}>
                <CardContent />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

ContactSection.displayName = 'ContactSection';

export default ContactSection;

