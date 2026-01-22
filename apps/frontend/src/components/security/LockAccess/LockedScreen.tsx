import React, { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle,
  Key,
  LogOut
} from 'lucide-react';
// motionTokens et gsapUtils non utilisés dans ce composant

interface LockedScreenProps {
  onLogin: (password: string) => Promise<boolean>;
  className?: string;
}

const LockedScreen: React.FC<LockedScreenProps> = ({ onLogin, className = "" }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const root = useRef<HTMLDivElement>(null);
  const themeClasses = {
    background: 'bg-gradient-to-br from-dk-black via-dk-gray-900 to-dk-black',
    card: 'bg-dk-gray-800/50 backdrop-blur-sm',
    text: 'text-dk-gray-300',
    accent: 'text-dk-blue-400'
  };

  // Animation d'entrée
  useLayoutEffect(() => {
    if (!root.current) return;
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 }});
      
      tl.from(".maintenance-icon", { 
        scale: 0, 
        rotation: -180, 
        opacity: 0 
      })
      .from(".maintenance-title", { 
        y: 30, 
        opacity: 0 
      }, "-=0.4")
      .from(".maintenance-subtitle", { 
        y: 20, 
        opacity: 0 
      }, "-=0.3")
      .from(".maintenance-form", { 
        y: 20, 
        opacity: 0 
      }, "-=0.2");
      
    }, root);
    
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await onLogin(password);
      if (success) {
        setIsAuthenticated(true);
        // Animation de succès
        gsap.to(".maintenance-form", {
          scale: 0.95,
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            gsap.to(".success-message", {
              scale: 1,
              opacity: 1,
              duration: 0.5,
              ease: "back.out(1.7)"
            });
          }
        });
      } else {
        setError('Mot de passe incorrect');
        // Animation d'erreur
        gsap.to(".maintenance-form", {
          x: -10,
          duration: 0.1,
          yoyo: true,
          repeat: 5,
          ease: "power2.inOut"
        });
      }
    } catch {
      setError('Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setError('');
    // Animation de retour
    gsap.to(".success-message", {
      scale: 0,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        gsap.to(".maintenance-form", {
          scale: 1,
          opacity: 1,
          duration: 0.5
        });
      }
    });
  };

  if (isAuthenticated) {
    return (
      <div ref={root} className={`fixed inset-0 z-[10000] py-20 overflow-hidden ${className}`} style={{
        background: 'linear-gradient(to bottom, rgba(14, 14, 14, 0.85), rgba(14, 14, 14, 0.95))',
        backdropFilter: 'blur(2px)'
      }}>
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <button 
                onClick={handleLogout}
                className="flex items-center text-dk-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Déconnexion
              </button>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              Site déverrouillé
            </h1>
            <p className="text-xl text-dk-gray-400 mb-8">
              Accès autorisé - Vous pouvez maintenant naviguer sur le site
            </p>
            
            {/* Statut de sécurité */}
            <div className="inline-flex items-center bg-green-500/20 border border-green-500/30 rounded-2xl px-6 py-3 mb-8">
              <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
              <span className="text-lg font-semibold text-green-400">
                Accès autorisé
              </span>
            </div>
          </div>

          {/* Message de succès */}
          <div className="success-message opacity-0 scale-0">
            <div className={`${themeClasses.card} rounded-2xl p-8 border border-green-500/30`}>
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">
                  Authentification réussie
                </h3>
                <p className="text-dk-gray-300">
                  Le site est maintenant déverrouillé et accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={root} className={`fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden ${className}`} style={{
      background: 'linear-gradient(to bottom, rgba(14, 14, 14, 0.85), rgba(14, 14, 14, 0.95))',
      backdropFilter: 'blur(2px)'
    }}>
      {/* Effet de particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-dk-blue-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="maintenance-icon w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="maintenance-title text-3xl font-bold text-white mb-2">
            Site verrouillé
          </h1>
          <p className="maintenance-subtitle text-dk-gray-400">
            Entrez le mot de passe pour accéder au site
          </p>
        </div>

        {/* Formulaire */}
        <div className={`maintenance-form ${themeClasses.card} rounded-2xl p-8 border border-dk-gray-700/50`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ mot de passe */}
            <div>
              <label className="block text-sm font-medium text-dk-gray-300 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-dk-gray-700/50 border border-dk-gray-600 rounded-lg text-white placeholder-dk-gray-400 focus:outline-none focus:ring-2 focus:ring-dk-blue-500 focus:border-transparent"
                  placeholder="Entrez le mot de passe"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-dk-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div className="flex items-center p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="w-full flex items-center justify-center px-6 py-3 bg-dk-blue-600 hover:bg-dk-blue-700 disabled:bg-dk-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Connexion...
                </>
              ) : (
                <>
                  <Key className="w-5 h-5 mr-2" />
                  Déverrouiller le site
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-dk-gray-500 text-sm">
            © 2024 DK BUILDING - Accès sécurisé
          </p>
        </div>
      </div>
    </div>
  );
};

export default LockedScreen;
