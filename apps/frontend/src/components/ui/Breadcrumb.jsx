import { useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ChevronRight } from 'lucide-react';

/**
 * Composant Breadcrumb - Fil d'Ariane pour la navigation
 * Affiche le chemin de navigation avec liens cliquables
 */
const Breadcrumb = ({ items, className = '' }) => {
  const breadcrumbRef = useRef(null);

  useLayoutEffect(() => {
    if (!breadcrumbRef.current) return;

    // Respect de prefers-reduced-motion (WCAG 2.3.3)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
      gsap.set(breadcrumbRef.current, { y: 0, opacity: 1 });
      return;
    }

    gsap.fromTo(
      breadcrumbRef.current,
      {
        y: 20,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: 'power3.out',
      }
    );
  }, []);

  if (!items || items.length === 0) return null;

  return (
    <nav
      ref={breadcrumbRef}
      aria-label="Fil d'Ariane"
      className={`flex items-center flex-wrap gap-2 ${className}`}
    >
      <ol className="flex items-center flex-wrap gap-2 list-none m-0 p-0">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center gap-2">
              {isLast ? (
                <span
                  className="text-white text-sm md:text-base font-medium"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-dk-yellow transition-colors duration-200 text-sm md:text-base font-medium rounded"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;
