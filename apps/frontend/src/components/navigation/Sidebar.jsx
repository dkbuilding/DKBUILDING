import { useLayoutEffect, useRef, useEffect, useCallback } from 'react';
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

  // Fermeture avec la touche Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap pour le dialog modal (WCAG 2.4.3 / 2.1.2)
  const handleFocusTrap = useCallback((e) => {
    if (!isOpen || !sidebarRef.current) return;
    
    const focusableElements = sidebarRef.current.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        // Shift+Tab : si on est sur le premier élément, aller au dernier
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab : si on est sur le dernier élément, aller au premier
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleFocusTrap);
      // Donner le focus au premier lien du menu après ouverture
      const timer = setTimeout(() => {
        const firstLink = sidebarRef.current?.querySelector('a[href], button:not([disabled])');
        if (firstLink) firstLink.focus();
      }, 300);
      return () => {
        document.removeEventListener('keydown', handleFocusTrap);
        clearTimeout(timer);
      };
    }
    return () => document.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen, handleFocusTrap]);

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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (isOpen) {
        gsap.set(overlayRef.current, { opacity: 1, pointerEvents: 'auto' });
        gsap.set(sidebarRef.current, { x: 0, opacity: 1 });
        gsap.set(sidebarRef.current.querySelectorAll('.sidebar-menu-item'), { x: 0, opacity: 1 });
        gsap.set(sidebarRef.current.querySelectorAll('.sidebar-contact-item'), { y: 0, opacity: 1 });
      } else {
        gsap.set(overlayRef.current, { opacity: 0, pointerEvents: 'none' });
        const sidebarWidth = window.innerWidth >= 1280 ? 512 : window.innerWidth >= 1024 ? 448 : window.innerWidth >= 768 ? 384 : 320;
        gsap.set(sidebarRef.current, { x: sidebarWidth, opacity: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      gsap.killTweensOf([sidebarRef.current, overlayRef.current]);
      const sidebarWidth = window.innerWidth >= 1280 ? 512 : window.innerWidth >= 1024 ? 448 : window.innerWidth >= 768 ? 384 : 320;
      gsap.set(sidebarRef.current, { x: isOpen ? 0 : sidebarWidth, opacity: isOpen ? 1 : 0 });
      gsap.set(overlayRef.current, { opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none' });

      if (isOpen) {
        gsap.to(overlayRef.current, {
          opacity: 1,
          pointerEvents: 'auto',
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });

        gsap.fromTo(sidebarRef.current,
          { x: sidebarWidth, opacity: 0 },
          { 
            x: 0, 
            opacity: 1, 
            duration: motionTokens.durations.normal,
            ease: motionTokens.easing.smooth
          }
        );

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
        gsap.to(overlayRef.current, {
          opacity: 0,
          pointerEvents: 'none',
          duration: motionTokens.durations.fast,
          ease: motionTokens.easing.smooth
        });

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
    if (e.target === overlayRef.current) {
      onClose();
    }
  };

  const handleSidebarClick = (e) => {
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
      
      {/* Sidebar dialog */}
      <aside
        id="sidebar-navigation"
        ref={sidebarRef}
        onClick={handleSidebarClick}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navigation"
        aria-hidden={!isOpen}
        className={`fixed right-0 h-screen w-full max-w-full xs:w-[85vw] lg:w-[28rem] xl:w-[32rem] bg-dk-black/95 backdrop-blur-md z-40 will-change-transform overflow-x-hidden ${
          !isOpen ? 'pointer-events-none' : 'pointer-events-auto'
        }`}
        style={{ maxWidth: '100vw', top: 0 }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* Contenu scrollable */}
          <div className="flex-1 overflow-y-auto overscroll-contain min-h-0 flex items-center justify-center">
            <div className="w-full p-8 xs:p-12 sm:p-16 pb-8 xs:pb-12 sm:pb-16">
              {/* Navigation */}
              <nav className="w-full max-w-sm xs:max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto" aria-label="Menu principal">
                <div className="space-y-2" role="list">
                  {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.href.replace('#', '');
                    
                    return (
                      <a
                        key={index}
                        href={item.href}
                        onClick={() => handleMenuClick(item.href)}
                        aria-current={isActive ? 'page' : undefined}
                        role="listitem"
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
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs text-dk-yellow-500/50 group-hover:text-dk-gray-400">
                            {item.description && <span> - {item.description}</span>}
                          </div>
                        </div>
                        <ChevronRight className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'text-dk-yellow' : 'text-dk-gray-600 group-hover:text-dk-gray-400'
                        }`} aria-hidden="true" />
                      </a>
                    );
                  })}
                </div>

                {/* CTA — lien vers la section contact (WCAG 2.4.4 : texte descriptif) */}
                <div className="mt-8 pb-8">
                  <a 
                    href="#contact"
                    onClick={handleMenuClick}
                    className="btn-primary w-full text-center font-foundation-black uppercase block"
                  >
                    Demander un devis gratuit
                  </a>
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
