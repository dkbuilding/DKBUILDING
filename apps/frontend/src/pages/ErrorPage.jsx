import React, { useLayoutEffect, useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap, ScrollTrigger } from '../utils/gsapConfig';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';
import errorMessages from '../data/errorMessages.json';
import { motionTokens } from '../utils/motion';
import ErrorIcon, { ActionIcon } from '../components/error/ErrorIcon';
import SearchBar from '../components/error/SearchBar';
import Suggestions from '../components/error/Suggestions';
import QuickNav from '../components/error/QuickNav';
import ReportButton from '../components/error/ReportButton';

const ErrorPage = () => {
  // Utilisation directe des hooks React Router
  const params = useParams();
  const code = params?.code;
  const navigate = useNavigate();
  const [errorData, setErrorData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Refs pour les animations GSAP
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const codeRef = useRef(null);
  const titleRef = useRef(null);
  const messageRef = useRef(null);
  const descriptionRef = useRef(null);
  const actionsRef = useRef(null);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const quickNavRef = useRef(null);
  
  // Si aucun code n'est fourni (route catch-all), utiliser 404
  const errorCode = code || '404';
  
  // Fonctions de navigation
  const handleRetry = () => {
    window.location.reload();
  };
  
  const handleGoHome = () => {
    if (navigate) {
      navigate('/');
    } else {
      window.location.href = '/';
    }
  };
  
  const handleGoBack = () => {
    if (navigate) {
      navigate(-1);
    } else {
      window.history.back();
    }
  };
  
  const handleSearch = (result) => {
    if (result.path.startsWith('#')) {
      window.location.href = result.path;
    } else {
      window.location.href = result.path;
    }
  };
  
  // Chargement des données d'erreur
  useEffect(() => {
    // Simuler un délai de chargement pour les codes 1xx
    if (errorCode && errorCode.startsWith('1')) {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    } else {
      setIsLoading(false);
    }
  }, [errorCode]);
  
  useEffect(() => {
    if (errorCode && errorMessages[errorCode]) {
      setErrorData(errorMessages[errorCode]);
    } else {
      // Code d'erreur par défaut si non trouvé
      setErrorData({
        title: "Erreur inconnue",
        message: "Un problème inattendu s'est produit !",
        description: "Notre équipe technique a été informée et travaille à résoudre le problème.",
        category: "server",
        actions: ["retry", "home"]
      });
    }
  }, [errorCode]);
  
  // Animations GSAP avec cleanup et prefers-reduced-motion
  useLayoutEffect(() => {
    if (!containerRef.current || isLoading) return;
    
    const ctx = gsap.context(() => {
      // Vérifier prefers-reduced-motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (prefersReducedMotion) {
        // Animation instantanée pour l'accessibilité
        gsap.set([
          logoRef.current,
          codeRef.current,
          titleRef.current,
          messageRef.current,
          descriptionRef.current,
          actionsRef.current,
          searchRef.current,
          suggestionsRef.current,
          quickNavRef.current
        ], { 
          opacity: 1, 
          y: 0, 
          scale: 1,
          rotation: 0
        });
        return;
      }
      
      // Timeline principale avec animations orchestrées
      const tl = gsap.timeline({ 
        defaults: { 
          ease: motionTokens.easing.smooth,
          duration: motionTokens.durations.normal
        } 
      });
      
      // 1. Logo avec rotation et scale
      tl.fromTo(logoRef.current, 
        { scale: 0, rotation: -360, opacity: 0 },
        { scale: 1, rotation: 0, opacity: 1, duration: motionTokens.durations.hero }
      )
      
      // 2. Code d'erreur avec effet de glitch
      .fromTo(codeRef.current,
        { y: motionTokens.distances.medium, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.4"
      )
      
      // 3. Titre avec stagger
      .fromTo(titleRef.current,
        { y: motionTokens.distances.small, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.3"
      )
      
      // 4. Message avec slide depuis la gauche
      .fromTo(messageRef.current,
        { x: -motionTokens.distances.large, opacity: 0 },
        { x: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.2"
      )
      
      // 5. Description avec fade
      .fromTo(descriptionRef.current,
        { y: motionTokens.distances.small, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.1"
      )
      
      // 6. Actions avec scale en cascade
      .fromTo(actionsRef.current.children,
        { scale: 0.8, opacity: 0 },
        { 
          scale: 1, 
          opacity: 1, 
          duration: motionTokens.durations.fast,
          stagger: motionTokens.stagger.fast
        },
        "-=0.1"
      )
      
      // 7. Barre de recherche
      .fromTo(searchRef.current,
        { y: motionTokens.distances.medium, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.2"
      )
      
      // 8. Suggestions
      .fromTo(suggestionsRef.current,
        { y: motionTokens.distances.medium, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.1"
      )
      
      // 9. Navigation rapide
      .fromTo(quickNavRef.current,
        { y: motionTokens.distances.large, opacity: 0 },
        { y: 0, opacity: 1, duration: motionTokens.durations.normal },
        "-=0.1"
      );
      
    }, containerRef);
    
    return () => ctx.revert(); // Cleanup GSAP
  }, [isLoading, errorData]);
  
  // État de chargement
  if (isLoading) {
    return (
      <div className="min-h-screen bg-dk-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dk-yellow mx-auto mb-4"></div>
          <p className="text-white text-lg font-foundation-roman">Chargement en cours...</p>
        </div>
      </div>
    );
  }
  
  // Fonction pour obtenir les actions selon le code d'erreur
  const getActionButtons = () => {
    if (!errorData?.actions) return [];
    
    return errorData.actions.map((action, index) => {
      switch (action) {
        case 'refresh':
          return (
            <button
              key={index}
              onClick={handleRetry}
              className="bg-white text-dk-black px-6 py-3 rounded-lg font-foundation-bold hover:bg-dk-yellow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ActionIcon action="refresh" />
              Réessayer
            </button>
          );
        case 'home':
          return (
            <button
              key={index}
              onClick={handleGoHome}
              className="bg-white text-dk-black px-6 py-3 rounded-lg font-foundation-bold hover:bg-dk-yellow hover:text-dk-yellow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ActionIcon action="home" />
              Retourner à l'accueil
            </button>
          );
        case 'back':
          return (
            <button
              key={index}
              onClick={handleGoBack}
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-foundation-bold hover:bg-white hover:text-dk-yellow transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ActionIcon action="back" />
              Revenir en arrière
            </button>
          );
        case 'search':
          return (
            <button
              key={index}
              onClick={() => searchRef.current?.querySelector('input')?.focus()}
              className="bg-transparent border-2 border-dk-yellow text-dk-yellow px-6 py-3 rounded-lg font-foundation-bold hover:bg-dk-yellow hover:text-dk-black transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <ActionIcon action="search" />
              Rechercher une page
            </button>
          );
        default:
          return null;
      }
    });
  };
  
  return (
    <div 
      ref={containerRef}
      className="min-h-screen bg-dk-black flex items-center justify-center py-24 px-4"
    >
      <div className="max-w-4xl w-full text-center space-y-8">
        
        {/* Logo DK BUILDING */}
        <div ref={logoRef} className="mb-8">
          <img 
            src="/src/assets/images/logos/Logo — DK BUILDING — Structure 2.png" 
            alt="DK BUILDING Logo"
            className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 mx-auto cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={handleGoHome}
            aria-label="Retour à l'accueil"
          />
        </div>
        
        {/* Code d'erreur */}
        <div ref={codeRef} className="text-6xl xs:text-7xl sm:text-8xl font-bold text-dk-yellow mb-4 font-foundation-black">
          {errorCode}
        </div>
        
        {/* Titre */}
        <h1 ref={titleRef} className="text-2xl xs:text-3xl sm:text-4xl font-bold text-white mb-4 font-foundation-bold">
          {errorData?.title}
        </h1>
        
        {/* Message */}
        <p ref={messageRef} className="text-lg xs:text-xl text-dk-gray-300 mb-6 font-foundation-roman">
          {errorData?.message}
        </p>
        
        {/* Description */}
        <p ref={descriptionRef} className="text-base xs:text-lg text-dk-gray-400 mb-8 font-foundation-light max-w-2xl mx-auto">
          {errorData?.description}
        </p>
        
        {/* Actions principales */}
        <div ref={actionsRef} className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {getActionButtons()}
        </div>
        
        {/* Barre de recherche */}
        <div ref={searchRef} className="mb-8">
          <SearchBar 
            onSearch={handleSearch}
            placeholder="Rechercher une page..."
            className="mx-auto"
          />
        </div>
        
        {/* Suggestions intelligentes */}
        <div ref={suggestionsRef} className="mb-8">
          <Suggestions 
            brokenUrl={window.location.pathname}
            className="mx-auto"
          />
        </div>
        
        {/* Navigation rapide */}
        <div ref={quickNavRef} className="mb-8">
          <QuickNav className="mx-auto" />
        </div>
        
        {/* Bouton de signalement pour les erreurs serveur */}
        {errorCode && errorCode.startsWith('5') && (
          <div className="mt-8">
            <ReportButton 
              errorCode={errorCode}
              brokenUrl={window.location.pathname}
              variant="default"
            />
          </div>
        )}
        
        {/* Informations supplémentaires pour les erreurs 5xx */}
        {errorCode && errorCode.startsWith('5') && (
          <div className="mt-8 p-4 bg-dk-gray-800 rounded-lg border border-dk-gray-700">
            <p className="text-dk-gray-300 text-sm font-foundation-light">
              Si le problème persiste, n'hésitez pas à nous contacter au <a href="tel:+33768113839" className="text-dk-yellow hover:text-yellow-300">+33 7 68 11 38 39</a> ou par e-mail à <a href="mailto:contact@dkbuilding.fr" className="text-dk-yellow hover:text-yellow-300">contact@dkbuilding.fr</a>. Notre équipe technique travaille déjà sur la résolution.
            </p>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ErrorPage;
