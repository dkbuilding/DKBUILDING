import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, ArrowUp, ArrowDown, X } from 'lucide-react';
import { searchInIndex } from '../../utils/searchIndex';

/**
 * Composant SearchBar - Barre de recherche avec autocomplétion
 * Fonctionnalités : autocomplétion, fuzzy search, raccourci clavier /, accessibilité complète
 */
const SearchBar = ({ 
  onSearch, 
  placeholder = "Rechercher une page...", 
  className = "",
  maxResults = 5 
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  const debounceRef = useRef(null);
  
  // Debounce pour éviter trop de recherches
  const debouncedSearch = useCallback((searchQuery) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    debounceRef.current = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const searchResults = searchInIndex(searchQuery, maxResults);
        setResults(searchResults);
        setIsOpen(searchResults.length > 0);
      } else {
        setResults([]);
        setIsOpen(false);
      }
      setSelectedIndex(-1);
    }, 300);
  }, [maxResults]);
  
  // Gestion du changement de requête
  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };
  
  // Gestion de la sélection d'un résultat
  const handleResultSelect = (result) => {
    setQuery(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(result);
    }
  };
  
  // Gestion de la soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleResultSelect(results[selectedIndex]);
    } else if (query.trim()) {
      // Recherche directe si pas de sélection
      const searchResults = searchInIndex(query, 1);
      if (searchResults.length > 0) {
        handleResultSelect(searchResults[0]);
      }
    }
  };
  
  // Gestion des touches clavier
  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleResultSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };
  
  // Raccourci clavier "/" pour focus
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === '/' && !isFocused && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFocused]);
  
  // Fermer les résultats quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultsRef.current && !resultsRef.current.contains(e.target)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Scroll vers l'élément sélectionné
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: 'nearest',
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);
  
  // Cleanup du debounce
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);
  
  return (
    <div className={`relative w-full max-w-md ${className}`}>
      {/* Formulaire de recherche */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          {/* Icône de recherche */}
          <Search 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dk-gray-400 pointer-events-none" 
            strokeWidth={2}
          />
          
          {/* Input de recherche */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleQueryChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-dk-black border border-dk-gray-700 rounded-lg text-white placeholder-dk-gray-400 focus:outline-none focus:ring-2 focus:ring-dk-yellow focus:border-transparent transition-all duration-200 font-foundation-roman"
            aria-label="Rechercher une page"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            role="combobox"
            autoComplete="off"
          />
          
          {/* Bouton clear */}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setResults([]);
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dk-gray-400 hover:text-white transition-colors duration-200 rounded"
              aria-label="Effacer la recherche"
            >
              <X strokeWidth={2} />
            </button>
          )}
        </div>
        
        {/* Raccourci clavier */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <kbd className="px-2 py-1 text-xs text-dk-gray-400 bg-dk-gray-800 border border-dk-gray-600 rounded">
            /
          </kbd>
        </div>
      </form>
      
      {/* Résultats de recherche */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-dk-black border border-dk-gray-700 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
          role="listbox"
          aria-label="Résultats de recherche"
        >
          {results.map((result, index) => (
            <button
              key={`${result.path}-${index}`}
              onClick={() => handleResultSelect(result)}
              className={`w-full px-4 py-3 text-left hover:bg-dk-gray-800 focus:bg-dk-gray-800 focus:outline-none transition-colors duration-200 ${
                index === selectedIndex ? 'bg-dk-gray-800' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
            >
              <div className="flex items-center space-x-3">
                {/* Icône */}
                <div className="flex-shrink-0">
                  <Search className="w-4 h-4 text-dk-yellow" strokeWidth={2} />
                </div>
                
                {/* Contenu */}
                <div className="flex-1 min-w-0">
                  <div className="text-white font-foundation-bold truncate">
                    {result.title}
                  </div>
                  <div className="text-dk-gray-400 text-sm font-foundation-roman truncate">
                    {result.description}
                  </div>
                </div>
                
                {/* Indicateur de sélection */}
                {index === selectedIndex && (
                  <div className="flex-shrink-0">
                    <ArrowUp className="w-4 h-4 text-dk-yellow" strokeWidth={2} />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
      
      {/* Message d'état pour les lecteurs d'écran */}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {isOpen && results.length > 0 && (
          `${results.length} résultat${results.length > 1 ? 's' : ''} trouvé${results.length > 1 ? 's' : ''}`
        )}
        {query && !isOpen && results.length === 0 && (
          'Aucun résultat trouvé'
        )}
      </div>
    </div>
  );
};

export default SearchBar;
