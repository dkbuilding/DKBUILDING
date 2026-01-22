import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

/**
 * Composant BackButton - Bouton retour pour revenir à la page précédente
 * Utilise useNavigate(-1) de React Router
 * 
 * Style : Sans bordure, même style que le fil d'Ariane (Breadcrumb)
 * - Texte gris (text-gray-400) qui devient jaune au survol (hover:text-dk-yellow)
 * - Pas de bordure ni de background
 * - Transition fluide des couleurs
 * 
 * Note : L'animation est gérée par les pages parentes via GSAP timeline
 * pour éviter les conflits d'animations et assurer un affichage cohérent
 */
const BackButton = ({ className = '', label = 'Retour' }) => {
  const navigate = useNavigate();

  const handleBack = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('BackButton clicked');
    
    try {
      // Vérifier si on peut naviguer en arrière
      if (window.history.length > 1) {
        if (navigate && typeof navigate === 'function') {
          console.log('Navigation avec React Router');
          navigate(-1);
        } else {
          console.log('Navigation avec window.history.back()');
          window.history.back();
        }
      } else {
        // Pas d'historique, rediriger vers l'accueil
        console.log('Pas d\'historique, redirection vers l\'accueil');
        if (navigate && typeof navigate === 'function') {
          navigate('/');
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Erreur lors de la navigation:', error);
      // Fallback ultime
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = '/';
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
      }}
      className={`flex items-center gap-2 bg-transparent text-gray-400 hover:text-dk-yellow transition-colors duration-200 text-sm md:text-base font-medium rounded pointer-events-auto cursor-pointer relative z-[100] px-2 py-1 ${className}`}
      aria-label="Retour à la page précédente"
      style={{ 
        zIndex: 100,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation'
      }}
    >
      <ArrowLeft className="w-4 h-4 flex-shrink-0 pointer-events-none" />
      <span className="pointer-events-none select-none">{label}</span>
    </button>
  );
};

export default BackButton;

