import React from 'react';
import { Lightbulb, ArrowRight, ExternalLink } from 'lucide-react';
import { getUrlSuggestions } from '../../utils/urlMatcher';
import { getPopularPages } from '../../utils/searchIndex';

/**
 * Composant Suggestions - Suggestions d'URL intelligentes
 * Analyse l'URL cassée et affiche les 5 pages les plus pertinentes
 */
const Suggestions = ({ 
  brokenUrl, 
  className = "",
  maxSuggestions = 5 
}) => {
  // Obtenir les suggestions intelligentes basées sur l'URL cassée
  const urlSuggestions = getUrlSuggestions(brokenUrl, maxSuggestions);
  
  // Si pas de suggestions intelligentes, utiliser les pages populaires
  const suggestions = urlSuggestions.length > 0 
    ? urlSuggestions 
    : getPopularPages(maxSuggestions);
  
  // Fonction pour naviguer vers une suggestion
  const handleSuggestionClick = (suggestion) => {
    if (suggestion.path.startsWith('#')) {
      // Navigation vers une section de la page d'accueil
      window.location.href = suggestion.path;
    } else {
      // Navigation vers une page spécifique
      window.location.href = suggestion.path;
    }
  };
  
  // Fonction pour obtenir l'icône selon le type de suggestion
  const getSuggestionIcon = (suggestion) => {
    const iconMap = {
      home: '🏠',
      services: '🔧',
      portfolio: '💼',
      about: '👥',
      contact: '📧',
      'mentions-legales': '📄',
      'legalmentionslegales': '📄',
      'politique-confidentialite': '🔒',
      'legalpolitiqueconfidentialite': '🔒',
      cgv: '🛡️',
      'legalcgv': '🛡️'
    };
    
    // Essayer de trouver l'icône par le chemin
    const pathKey = suggestion.path.replace(/[#/]/g, '').toLowerCase();
    
    // Vérifier d'abord la clé exacte
    if (iconMap[pathKey]) {
      return iconMap[pathKey];
    }
    
    // Vérifier si le chemin contient des mots-clés
    if (pathKey.includes('mentions') || pathKey.includes('legal')) {
      return '📄';
    }
    if (pathKey.includes('politique') || pathKey.includes('confidentialite')) {
      return '🔒';
    }
    if (pathKey.includes('cgv') || pathKey.includes('conditions')) {
      return '🛡️';
    }
    
    return iconMap[pathKey] || '🔗';
  };
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className={`w-full max-w-2xl ${className}`}>
      {/* En-tête avec icône */}
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="w-5 h-5 text-dk-yellow" strokeWidth={2} />
        <h3 className="text-lg font-foundation-bold text-white">
          Vous cherchiez peut-être :
        </h3>
      </div>
      
      {/* Liste des suggestions */}
      <div className="space-y-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.path}-${index}`}
            onClick={() => handleSuggestionClick(suggestion)}
            className="w-full p-4 bg-dk-gray-800 hover:bg-dk-gray-700 border border-dk-gray-700 hover:border-dk-yellow rounded-lg transition-all duration-200 group"
            aria-label={`Aller à ${suggestion.title}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {/* Icône */}
                <div className="flex-shrink-0 text-lg">
                  {getSuggestionIcon(suggestion)}
                </div>
                
                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-foundation-bold truncate group-hover:text-dk-yellow transition-colors duration-200">
                    {suggestion.title}
                  </div>
                  <div className="text-dk-gray-400 text-sm font-foundation-roman truncate">
                    {suggestion.description || suggestion.reason}
                  </div>
                </div>
                
                {/* Indicateur de type de correspondance */}
                {suggestion.matchType && (
                  <div className="flex-shrink-0">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-foundation-bold bg-dk-yellow/20 text-dk-yellow border border-dk-yellow/30">
                      {suggestion.matchType === 'segment' && 'Correspondance'}
                      {suggestion.matchType === 'keyword' && 'Mot-clé'}
                      {suggestion.matchType === 'global' && 'Similaire'}
                      {suggestion.matchType === 'partial' && 'Partiel'}
                    </span>
                  </div>
                )}
              </div>
              
              {/* Icône de navigation */}
              <div className="flex-shrink-0 ml-3">
                {suggestion.path.startsWith('http') ? (
                  <ExternalLink className="w-4 h-4 text-dk-gray-400 group-hover:text-dk-yellow transition-colors duration-200" strokeWidth={2} />
                ) : (
                  <ArrowRight className="w-4 h-4 text-dk-gray-400 group-hover:text-dk-yellow transition-colors duration-200" strokeWidth={2} />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      {/* Message d'aide */}
      <div className="mt-4 p-3 bg-dk-gray-800/50 border border-dk-gray-700 rounded-lg">
        <p className="text-dk-gray-400 text-sm font-foundation-roman">
          💡 <strong>Astuce :</strong> Utilisez la barre de recherche ci-dessus pour trouver rapidement ce que vous cherchez.
        </p>
      </div>
    </div>
  );
};

/**
 * Composant SuggestionsCompact - Version compacte pour les petits espaces
 */
export const SuggestionsCompact = ({ 
  brokenUrl, 
  className = "",
  maxSuggestions = 3 
}) => {
  const urlSuggestions = getUrlSuggestions(brokenUrl, maxSuggestions);
  const suggestions = urlSuggestions.length > 0 
    ? urlSuggestions 
    : getPopularPages(maxSuggestions);
  
  const handleSuggestionClick = (suggestion) => {
    window.location.href = suggestion.path;
  };
  
  if (suggestions.length === 0) {
    return null;
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center space-x-2 mb-3">
        <Lightbulb className="w-4 h-4 text-dk-yellow" strokeWidth={2} />
        <span className="text-sm font-foundation-bold text-white">
          Suggestions :
        </span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={`${suggestion.path}-${index}`}
            onClick={() => handleSuggestionClick(suggestion)}
            className="px-3 py-2 bg-dk-gray-800 hover:bg-dk-gray-700 border border-dk-gray-700 hover:border-dk-yellow rounded-lg text-sm font-foundation-roman text-white hover:text-dk-yellow transition-all duration-200"
            aria-label={`Aller à ${suggestion.title}`}
          >
            {suggestion.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Suggestions;
