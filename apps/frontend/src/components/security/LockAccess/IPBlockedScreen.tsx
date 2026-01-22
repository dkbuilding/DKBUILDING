import React, { useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { 
  Ban, 
  ShieldX, 
  Mail, 
  Phone,
  AlertTriangle,
  Globe,
  Clock,
  RefreshCw
} from 'lucide-react';

interface IPBlockedScreenProps {
  clientIP: string;
  className?: string;
}

const IPBlockedScreen: React.FC<IPBlockedScreenProps> = ({ clientIP, className = "" }) => {
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
      
      tl.from(".blocked-icon", { 
        scale: 0, 
        rotation: 180, 
        opacity: 0 
      })
      .from(".blocked-title", { 
        y: 30, 
        opacity: 0 
      }, "-=0.4")
      .from(".blocked-subtitle", { 
        y: 20, 
        opacity: 0 
      }, "-=0.3")
      .from(".blocked-content", { 
        y: 20, 
        opacity: 0 
      }, "-=0.2");
      
    }, root);
    
    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className={`fixed inset-0 z-[10000] ${themeClasses.background} flex items-center justify-center overflow-hidden ${className}`}>
      {/* Effet de particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        {/* Logo et icône */}
        <div className="mb-8">
          <div className="blocked-icon w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Ban className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="blocked-title text-4xl md:text-6xl font-bold text-white mb-4">
            Accès refusé
          </h1>
          <p className="blocked-subtitle text-xl text-dk-gray-400 mb-8">
            Votre adresse IP n'est pas autorisée à accéder à ce site
          </p>
        </div>

        {/* Informations IP */}
        <div className={`blocked-content ${themeClasses.card} rounded-2xl p-8 mb-8 border border-red-500/30`}>
          <div className="flex items-center justify-center mb-6">
            <ShieldX className="w-8 h-8 text-red-400 mr-3" />
            <span className="text-2xl font-semibold text-red-400">
              IP bloquée détectée
            </span>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <Globe className="w-5 h-5 text-red-400 mr-3" />
              <div className="text-left">
                <div className="text-sm text-dk-gray-400">Votre adresse IP</div>
                <div className="text-white font-mono text-lg">{clientIP}</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-dk-gray-700/30 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3" />
              <div className="text-left">
                <div className="text-sm text-dk-gray-400">Statut</div>
                <div className="text-yellow-400 font-medium">Accès temporairement restreint</div>
              </div>
            </div>
          </div>
        </div>

        {/* Raisons possibles */}
        <div className={`blocked-content ${themeClasses.card} rounded-2xl p-6 mb-8 border border-dk-gray-700/50`}>
          <h3 className="text-xl font-semibold text-white mb-4">
            Raisons possibles
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start p-4 bg-dk-gray-700/30 rounded-lg">
              <Clock className="w-5 h-5 text-dk-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium mb-1">Maintenance</div>
                <div className="text-sm text-dk-gray-400">Le site est temporairement en maintenance</div>
              </div>
            </div>
            
            <div className="flex items-start p-4 bg-dk-gray-700/30 rounded-lg">
              <ShieldX className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-white font-medium mb-1">Restriction géographique</div>
                <div className="text-sm text-dk-gray-400">Accès limité à certaines régions</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className={`blocked-content ${themeClasses.card} rounded-2xl p-6 mb-8 border border-dk-gray-700/50`}>
          <h3 className="text-xl font-semibold text-white mb-4">
            Besoin d'aide ?
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-center p-4 bg-dk-gray-700/30 rounded-lg">
              <Mail className="w-5 h-5 text-dk-blue-400 mr-3" />
              <div className="text-left">
                <div className="text-sm text-dk-gray-400">Email</div>
                <div className="text-white font-medium">contact@dkbuilding.fr</div>
              </div>
            </div>
            
            <div className="flex items-center justify-center p-4 bg-dk-gray-700/30 rounded-lg">
              <Phone className="w-5 h-5 text-dk-blue-400 mr-3" />
              <div className="text-left">
                <div className="text-sm text-dk-gray-400">Téléphone</div>
                <div className="text-white font-medium">+33 7 68 11 38 39</div>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-dk-blue-500/10 border border-dk-blue-500/20 rounded-lg">
            <p className="text-dk-blue-300 text-sm">
              <strong>Note :</strong> Si vous pensez qu'il s'agit d'une erreur, 
              contactez-nous en mentionnant votre adresse IP : <code className="bg-dk-gray-700 px-2 py-1 rounded">{clientIP}</code>
            </p>
          </div>
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="blocked-content flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-6 py-3 bg-dk-gray-700 hover:bg-dk-gray-600 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Réessayer
          </button>
        </div>

        {/* Footer */}
        <div className="blocked-content mt-12 text-center">
          <p className="text-dk-gray-500 text-sm">
            © 2024 DK BUILDING - Système de sécurité activé
          </p>
        </div>
      </div>
    </div>
  );
};

export default IPBlockedScreen;
