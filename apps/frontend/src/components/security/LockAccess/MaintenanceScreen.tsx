import React from 'react';
import { 
  Wrench, 
  Clock, 
  Mail, 
  Phone,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';

interface MaintenanceScreenProps {
  className?: string;
}

const MaintenanceScreen: React.FC<MaintenanceScreenProps> = ({ className = "" }) => {
  const themeClasses = {
    background: 'bg-gradient-to-br from-dk-black via-dk-gray-900 to-dk-black',
    card: 'bg-dk-gray-800/50 backdrop-blur-sm',
    text: 'text-dk-gray-300',
    accent: 'text-dk-blue-400'
  };

  return (
    <div className={`fixed inset-0 z-[10000] ${themeClasses.background} flex items-center justify-center overflow-hidden ${className}`}>
      {/* Effet de particules animées */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
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

      <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
        {/* Logo et icône */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-dk-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wrench className="w-12 h-12 text-dk-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Maintenance en cours
          </h1>
          <p className="text-xl text-dk-gray-400 mb-8">
            Nous améliorons notre site pour vous offrir une meilleure expérience
          </p>
        </div>

        {/* Statut de maintenance */}
        <div className={`${themeClasses.card} rounded-2xl p-8 mb-8 border border-dk-gray-700/50`}>
          <div className="flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-dk-blue-400 mr-3" />
            <span className="text-lg font-semibold text-dk-blue-400">
              Site temporairement indisponible
            </span>
          </div>
          
          <div className="space-y-4 text-dk-gray-300">
            <p className="text-lg">
              Notre équipe technique travaille actuellement sur des améliorations importantes.
            </p>
            <p className="text-sm">
              Nous nous excusons pour la gêne occasionnée et vous remercions de votre patience.
            </p>
          </div>
        </div>

        {/* Informations de contact */}
        <div className={`${themeClasses.card} rounded-2xl p-6 mb-8 border border-dk-gray-700/50`}>
          <h3 className="text-xl font-semibold text-white mb-4">
            Besoin d'aide urgente ?
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
        </div>

        {/* Bouton de rafraîchissement */}
        <div className="flex justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center px-6 py-3 bg-dk-blue-600 hover:bg-dk-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Actualiser la page
          </button>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-dk-gray-500 text-sm">
            © 2024 DK BUILDING - Tous droits réservés
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
