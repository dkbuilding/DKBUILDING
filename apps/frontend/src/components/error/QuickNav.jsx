import React from 'react';
import { 
  Home, 
  Wrench, 
  Briefcase, 
  Users, 
  Mail, 
  FileText, 
  Shield,
  ArrowRight
} from 'lucide-react';

/**
 * Composant QuickNav - Navigation alternative complète
 * Grid responsive avec icônes Lucide et liens vers toutes sections principales
 */
const QuickNav = ({ className = "" }) => {
  // Configuration des liens de navigation
  const navigationItems = [
    {
      title: 'Accueil',
      path: '/',
      description: 'Retour à la page d\'accueil',
      icon: Home,
      color: 'text-blue-400',
      hoverColor: 'hover:text-blue-300'
    },
    {
      title: 'Services',
      path: '/#services',
      description: 'Charpente, bardage, couverture',
      icon: Wrench,
      color: 'text-green-400',
      hoverColor: 'hover:text-green-300'
    },
    {
      title: 'Réalisations',
      path: '/#portfolio',
      description: 'Nos projets et chantiers',
      icon: Briefcase,
      color: 'text-purple-400',
      hoverColor: 'hover:text-purple-300'
    },
    {
      title: 'À propos',
      path: '/#about',
      description: 'Notre équipe et histoire',
      icon: Users,
      color: 'text-orange-400',
      hoverColor: 'hover:text-orange-300'
    },
    {
      title: 'Contact',
      path: '/#contact',
      description: 'Devis et informations',
      icon: Mail,
      color: 'text-red-400',
      hoverColor: 'hover:text-red-300'
    },
    {
      title: 'Mentions légales',
      path: '/legal/mentions-legales',
      description: 'Informations légales',
      icon: FileText,
      color: 'text-gray-400',
      hoverColor: 'hover:text-gray-300'
    },
    {
      title: 'Politique de confidentialité',
      path: '/legal/politique-confidentialite',
      description: 'Protection des données',
      icon: Shield,
      color: 'text-gray-500',
      hoverColor: 'hover:text-gray-300'
    },
    {
      title: 'CGV',
      path: '/legal/cgv',
      description: 'Conditions générales',
      icon: Shield,
      color: 'text-dk-yellow',
      hoverColor: 'hover:text-yellow-300'
    }
  ];
  
  // Fonction pour gérer la navigation
  const handleNavigation = (item) => {
    if (item.path.startsWith('#')) {
      // Navigation vers une section de la page d'accueil
      window.location.href = item.path;
    } else {
      // Navigation vers une page spécifique
      window.location.href = item.path;
    }
  };
  
  return (
    <div className={`w-full max-w-4xl ${className}`}>
      {/* En-tête */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-foundation-bold text-white mb-2">
          Navigation rapide
        </h3>
        <p className="text-dk-gray-400 font-foundation-roman">
          Accédez rapidement aux sections principales du site
        </p>
      </div>
      
      {/* Grid responsive : 2 colonnes mobile → 3 colonnes desktop */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 xs:gap-6">
        {navigationItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <button
              key={`${item.path}-${index}`}
              onClick={() => handleNavigation(item)}
              className="group p-4 xs:p-6 bg-dk-gray-800 hover:bg-dk-gray-700 border border-dk-gray-700 hover:border-dk-yellow rounded-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1"
              aria-label={`Aller à ${item.title}`}
            >
              <div className="flex flex-col items-center text-center space-y-3">
                {/* Icône */}
                <div className={`p-3 rounded-full bg-dk-gray-700 group-hover:bg-dk-gray-600 transition-colors duration-300 ${item.color} ${item.hoverColor}`}>
                  <IconComponent className="w-6 h-6 xs:w-7 xs:h-7" strokeWidth={2} />
                </div>
                
                {/* Titre */}
                <div className="text-white font-foundation-bold text-sm xs:text-base group-hover:text-dk-yellow transition-colors duration-300">
                  {item.title}
                </div>
                
                {/* Description */}
                <div className="text-dk-gray-400 text-xs xs:text-sm font-foundation-roman leading-relaxed">
                  {item.description}
                </div>
                
                {/* Indicateur de navigation */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ArrowRight className="w-4 h-4 text-dk-yellow" strokeWidth={2} />
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Message d'aide */}
      <div className="mt-8 p-4 bg-dk-gray-800/50 border border-dk-gray-700 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-dk-yellow/20 rounded-full flex items-center justify-center">
              <span className="text-dk-yellow text-sm">💡</span>
            </div>
          </div>
          <div className="flex-1">
            <h4 className="text-white font-foundation-black text-sm mb-1">
              Besoin d'aide ?
            </h4>
            <p className="text-dk-gray-400 text-sm font-foundation-roman">
              Si vous ne trouvez pas ce que vous cherchez, utilisez la barre de recherche ou contactez-nous directement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Composant QuickNavCompact - Version compacte pour les petits espaces
 */
export const QuickNavCompact = ({ className = "" }) => {
  const compactItems = [
    { title: 'Accueil', path: '/', icon: Home },
    { title: 'Services', path: '/#services', icon: Wrench },
    { title: 'Réalisations', path: '/#portfolio', icon: Briefcase },
    { title: 'Contact', path: '/#contact', icon: Mail }
  ];
  
  const handleNavigation = (item) => {
    window.location.href = item.path;
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="text-center mb-4">
        <h4 className="text-lg font-foundation-black text-white mb-1">
          Navigation rapide
        </h4>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {compactItems.map((item, index) => {
          const IconComponent = item.icon;
          
          return (
            <button
              key={`${item.path}-${index}`}
              onClick={() => handleNavigation(item)}
              className="group p-3 bg-dk-gray-800 hover:bg-dk-gray-700 border border-dk-gray-700 hover:border-dk-yellow rounded-lg transition-all duration-200"
              aria-label={`Aller à ${item.title}`}
            >
              <div className="flex items-center space-x-3">
                <IconComponent className="w-5 h-5 text-dk-yellow group-hover:text-dk-yellow transition-colors duration-200" strokeWidth={2} />
                <span className="text-white font-foundation-bold text-sm group-hover:text-dk-yellow transition-colors duration-200">
                  {item.title}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickNav;
