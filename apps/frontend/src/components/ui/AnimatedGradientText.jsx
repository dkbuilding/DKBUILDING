import { useLayoutEffect, useRef, forwardRef } from 'react';
import { gsap } from '../../utils/gsapConfig';

/**
 * Composant AnimatedGradientText
 * 
 * Affiche un texte avec un effet de gradient animé qui traverse le texte de gauche à droite.
 * L'animation respecte les préférences d'accessibilité (prefers-reduced-motion).
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Le contenu texte à animer
 * @param {string} props.className - Classes CSS supplémentaires
 * @param {string} props.baseColor - Couleur de base du gradient (défaut: #FFFFFF)
 * @param {string} props.accentColor - Couleur d'accent du gradient (défaut: #F3E719 - jaune DK BUILDING)
 * @param {number} props.duration - Durée de l'animation en secondes (défaut: 1.2)
 * @param {number} props.speedVariation - Variation de vitesse (défaut: 2)
 * @param {number} props.speedDuration - Durée de la variation de vitesse (défaut: 3)
 * @param {string} props.fallbackColor - Couleur de fallback si animation désactivée (défaut: #FFFFFF)
 * @param {Object} props.style - Styles inline supplémentaires
 * 
 * @example
 * <AnimatedGradientText className="text-4xl font-bold">
 *   DK BUILDING
 * </AnimatedGradientText>
 */
const AnimatedGradientText = forwardRef(({
  children,
  className = '',
  baseColor = '#FFFFFF',
  accentColor = '#F3E719',
  duration = 1.2,
  speedVariation = 2,
  speedDuration = 3,
  fallbackColor = '#FFFFFF',
  style = {},
  ...props
}, ref) => {
  const textRef = useRef(null);
  const combinedRef = (node) => {
    textRef.current = node;
    if (ref) {
      if (typeof ref === 'function') {
        ref(node);
      } else {
        ref.current = node;
      }
    }
  };

  useLayoutEffect(() => {
    if (!textRef.current) return;

    // Vérifier si l'utilisateur préfère réduire les animations
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let gradientTween = null;
    let speedTween = null;

    if (!prefersReducedMotion) {
      // Initialiser la position du gradient à gauche
      gsap.set(textRef.current, {
        backgroundPosition: '-200% 0%'
      });

      // Animation en boucle continue
      gradientTween = gsap.to(textRef.current, {
        backgroundPosition: '200% 0%',
        duration,
        ease: 'none',
        repeat: -1
      });

      // Animation de la vitesse qui se modifie automatiquement de manière fluide
      // Variation de vitesse pour créer un effet dynamique et naturel
      speedTween = gsap.to(gradientTween, {
        timeScale: speedVariation,
        duration: speedDuration,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      });
    } else {
      // Fallback : texte avec couleur solide si l'animation est désactivée
      gsap.set(textRef.current, {
        WebkitTextFillColor: fallbackColor,
        color: fallbackColor
      });
    }

    // Cleanup : arrêter les animations lors du démontage
    return () => {
      if (gradientTween) {
        gradientTween.kill();
      }
      if (speedTween) {
        speedTween.kill();
      }
    };
  }, [duration, speedVariation, speedDuration, fallbackColor]);

  // Construire le gradient linéaire
  const gradientStyle = {
    backgroundImage: `linear-gradient(90deg, ${baseColor} 0%, ${baseColor} 30%, ${accentColor} 50%, ${baseColor} 70%, ${baseColor} 100%)`,
    backgroundSize: '200% 100%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    color: 'transparent',
    display: 'inline-block',
    ...style
  };

  return (
    <span
      ref={combinedRef}
      className={`inline-block ${className}`}
      style={gradientStyle}
      {...props}
    >
      {children}
    </span>
  );
});

AnimatedGradientText.displayName = 'AnimatedGradientText';

export default AnimatedGradientText;

