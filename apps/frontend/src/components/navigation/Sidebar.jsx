import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motionTokens } from '../../utils/motion';
import { useActiveSection } from '../../hooks/useActiveSection';
import { 
  Home, 
  Wrench, 
  Briefcase, 
  Users, 
  Mail, 
  X, 
  ChevronRight,
  Phone,
  MapPin,
  Clock,
  Newspaper
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);
  
  // Définir les IDs des sections à surveiller
  const sectionIds = ['home', 'news', 'services', 'portfolio', 'about', 'contact'];
  const activeSection = useActiveSection(sectionIds, -100);

  const menuItems = [
    { 
      label: 'ACCUEIL', 
      href: '#home', 
      icon: Home,
      description: 'Retour à l\'accueil'
    },
    { 
      label: 'ACTUALITÉS', 
      href: '#news', 
      icon: Newspaper,
      description: 'Nos dernières actualités'
    },
    { 
      label: 'SERVICES', 
      href: '#services', 
      icon: Wrench,
      description: 'Nos services de construction'
    },
    { 
      label: 'RÉALISATIONS', 
      href: '#portfolio', 
      icon: Briefcase,
      description: 'Nos projets réalisés'
    },
    { 
      label: 'À PROPOS', 
      href: '#about', 
      icon: Users,
      description: 'Notre équipe et notre histoire'
    },
    { 
      label: 'CONTACT', 
      href: '#contact', 
      icon: Mail,
      description: 'Nous contacter'
    }
  ];

  useLayoutEffect(() => {
    if (!sidebarRef.current || !overlayRef.current) return;

    const ctx = gsap.context(() => {
      // Toujours stabiliser l'état initial et tuer d'éventuels tweens
      gsap.killTweensOf([sidebarRef.current, overlayRef.current]);
      const sidebarWidth = window.innerWidth >= 1280 ? 512 : window.innerWidth >= 1024 ? 448 : window.innerWidth >= 768 ? 384 : 320;
      gsap.set(sidebarRef.current, { x: isOpen ? 0 : sidebarWidth, opacity: isOpen ? 1 : 0 });
      gsap.set(overlayRef.current, { opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' });

      if (isOpen) {
        // Animation de l'overlay
        gsap.to(overlayRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });

        // Animation d'ouverture depuis la droite
        gsap.fromTo(sidebarRef.current,
          { x: sidebarWidth, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: motionTokens.durations.normal,
            ease: motionTokens.easing.smooth
          }
        );

        // Animation des éléments du menu
        gsap.fromTo(sidebarRef.current.querySelectorAll('.sidebar-menu-item'),
          { x: 50, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: motionTokens.durations.fast,
            ease: motionTokens.easing.smooth,
            stagger: 0.1
          }
        );

        // Animation des informations de contact
        gsap.fromTo(sidebarRef.current.querySelectorAll('.sidebar-contact-item'),
          { y: 20, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: motionTokens.durations.fast,
            ease: motionTokens.easing.smooth,
            stagger: 0.1,
            delay: 0.3
          }
        );
      } else {
        // Animation de fermeture de l'overlay
        gsap.to(overlayRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });

        // Animation de fermeture vers la droite
        gsap.to(sidebarRef.current,
          { 
            x: sidebarWidth, 
            opacity: 0, 
            duration: motionTokens.durations.fast,
            ease: motionTokens.easing.smooth
          }
        );
      }
    }, { scope: document.body });

    return () => {
      ctx.revert();
    };
  }, [isOpen]);

  const handleMenuClick = () => {
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Fermer le sidebar si on clique sur l'overlay (pas sur le sidebar lui-même)
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSidebarClick = (e) => {
    // Empêcher la propagation du clic pour éviter la fermeture lors d'un clic à l'intérieur
    e.stopPropagation();
  };

  return (
    <>
      {/* Overlay backdrop */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-30 will-change-transform ${
          !isOpen ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        aria-hidden="true"
      />
      
      {/* Sidebar */}
      <aside 
        ref={sidebarRef}
        onClick={handleSidebarClick}
        className={`fixed right-0 h-screen w-full max-w-full xs:w-[85vw] lg:w-[28rem] xl:w-[32rem] bg-dk-black/95 backdrop-blur-md z-40 will-change-transform overflow-x-hidden ${
          !isOpen ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{ maxWidth: '100vw' }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 flex items-center justify-center">
            <div className="w-full p-8 xs:p-12 sm:p-16 pb-8 xs:pb-12 sm:pb-16">
              {/* Navigation */}
              <nav className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                <div className="space-y-2">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.href.replace('#', '');
                    
                    return (
                      <a
                        key={index}
                        href={item.href}
                        onClick={() => handleMenuClick(item.href)}
                        className={`sidebar-menu-item group flex items-center p-4 rounded-xl transition-all duration-300 no-underline ${
                          isActive 
                            ? 'bg-dk-yellow/10 border border-dk-yellow/20 text-dk-yellow' 
                            : 'text-dk-gray-300 group-hover:text-white'
                        }`}
                      >
                        <div className={`p-2 rounded-lg mr-4 transition-colors duration-300 ${
                          isActive 
                            ? 'bg-dk-yellow/20 text-dk-yellow' 
                            : 'text-dk-gray-300 group-hover:text-white'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-dk-yellow-500/50 group-hover:text-dk-gray-400">
                            {item.description && <span className=""> - {item.description}</span>}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'text-dk-yellow' : 'text-dk-gray-600 group-hover:text-dk-gray-400'
                        }`} />
                      </a>
                    );
                  })}
                </div>

                {/* CTA */}
                <div className="mt-8 pb-8">
                  <button className="btn-primary w-full text-center font-foundation-black uppercase">
                    Demander un devis gratuit
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
