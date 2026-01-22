import { useLayoutEffect, useRef, useState, useEffect, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../utils/gsapConfig';
import { motionTokens } from '../../utils/motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle, 
  Server, 
  Clock, 
  Database, 
  Cpu, 
  HardDrive, 
  Globe, 
  Mail, 
  Activity,
  RefreshCw,
  ExternalLink,
  ArrowLeft,
  LogOut
} from 'lucide-react';

// Composant de connexion intégré
const HealthLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const formRef = useRef(null);
  const errorRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Animation de l'erreur si elle existe
    if (errorRef.current) {
      gsap.fromTo(errorRef.current, 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
      );
    }

    try {
      // Authentification sécurisée côté serveur
      // Utiliser le proxy Vite pour éviter les problèmes de contenu mixte (HTTPS -> HTTP)
      const response = await fetch('/api/auth/health', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        // Stocker le token JWT dans localStorage
        const sessionData = {
          authenticated: true,
          token: data.token,
          expires: Date.now() + (30 * 60 * 1000), // 30 minutes
          permissions: data.permissions,
          security_level: data.security_level,
          timestamp: Date.now()
        };
        localStorage.setItem('health_session', JSON.stringify(sessionData));
        onLogin(true);
      } else {
        setError(data.error || 'Mot de passe incorrect');
        setIsLoading(false);
        
        // Animation d'erreur
        if (errorRef.current) {
          gsap.fromTo(errorRef.current, 
            { x: -10, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
          );
        }
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      setIsLoading(false);
      console.error('Erreur d\'authentification:', err);
      
      // Animation d'erreur
      if (errorRef.current) {
        gsap.fromTo(errorRef.current, 
          { x: -10, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-dk-black flex items-center justify-center py-20">
      <div className="w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-dk-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-dk-blue" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Accès Sécurisé
          </h1>
          <p className="text-gray-400">
            Page de monitoring système <span className="text-gradient hover:font-foundation-black">DK BUILDING</span>
          </p>
        </div>

        {/* Formulaire de connexion */}
        <div ref={formRef} className="bg-dk-gray/30 rounded-2xl p-8 border border-gray-800/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Champ mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 pl-12 pr-12 bg-dk-gray/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-dk-blue focus:border-transparent transition-all"
                  placeholder="Entrez le mot de passe"
                  required
                  disabled={isLoading}
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Message d'erreur */}
            {error && (
              <div ref={errorRef} className="flex items-center space-x-2 text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full flex items-center justify-center px-6 py-3 bg-dk-blue text-white rounded-lg hover:bg-dk-blue/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Vérification...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5 mr-2" />
                  Accéder au monitoring
                </>
              )}
            </button>
          </form>

          {/* Informations de sécurité */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-dk-yellow flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-400">
                <p className="font-medium text-dk-yellow mb-1">Accès restreint</p>
                <p>Cette page contient des informations sensibles sur le système. L'accès est limité aux administrateurs autorisés.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <a 
            href="/" 
            className="text-gray-400 hover:text-white transition-colors text-sm"
          >
            ← Retour au site principal
          </a>
        </div>
      </div>
    </div>
  );
};
// Composant principal de la page de santé
const HealthPage = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef([]);
  const statusRef = useRef(null);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [healthData, setHealthData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [error, setError] = useState(null);

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      const sessionData = localStorage.getItem('health_session');
      if (sessionData) {
        try {
          const session = JSON.parse(sessionData);
          const now = Date.now();
          
          // Vérifier si la session n'a pas expiré
          if (session.authenticated && now < session.expires) {
            setIsAuthenticated(true);
            return;
          } else {
            // Session expirée, la supprimer
            localStorage.removeItem('health_session');
          }
        } catch (error) {
          console.error('Erreur lors de la vérification de la session:', error);
          localStorage.removeItem('health_session');
        }
      }
      setIsAuthenticated(false);
    };

    checkAuth();
  }, []);

  // Fonction pour gérer la déconnexion
  const handleLogout = useCallback(() => {
    localStorage.removeItem('health_session');
    setIsAuthenticated(false);
    setHealthData(null);
  }, []);

  // Fonction pour récupérer les données de santé avec authentification JWT
  const fetchHealthData = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // Récupération du token JWT depuis localStorage
      const sessionData = localStorage.getItem('health_session');
      if (!sessionData) {
        throw new Error('Session non trouvée');
      }
      
      const session = JSON.parse(sessionData);
      if (!session.token) {
        throw new Error('Token JWT manquant');
      }
      
      // Vérification de l'expiration du token
      if (Date.now() > session.expires) {
        throw new Error('Token expiré');
      }
      
      // Utiliser le proxy Vite pour éviter les problèmes de contenu mixte (HTTPS -> HTTP)
      // Note: /health n'est pas sous /api, donc on utilise directement le proxy
      const response = await fetch('/api/health', {
        headers: {
          'Authorization': `Bearer ${session.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token invalide ou expiré
          localStorage.removeItem('health_session');
          setIsAuthenticated(false);
          throw new Error('Session expirée - Veuillez vous reconnecter');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setHealthData(data);
      setLastUpdate(new Date());
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Erreur lors de la récupération des données de santé:', err);
      
      // Si erreur d'authentification, déconnecter l'utilisateur
      if (err.message.includes('Session') || err.message.includes('Token')) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  // Récupération initiale des données (seulement si authentifié)
  useEffect(() => {
    if (isAuthenticated) {
      fetchHealthData();
      
      // Auto-refresh toutes les 30 secondes
      const interval = setInterval(fetchHealthData, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, fetchHealthData]);

  // Animation GSAP
  useLayoutEffect(() => {
    if (!sectionRef.current) return;
    
    const ctx = gsap.context(() => {
      // Animation du titre
      if (titleRef.current) {
        gsap.fromTo(titleRef.current, 
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: motionTokens.durations.normal,
            ease: motionTokens.easing.smooth
          }
        );
      }

      // Animation des cartes
      if (cardsRef.current) {
        gsap.fromTo(cardsRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: motionTokens.durations.normal,
            ease: motionTokens.easing.smooth,
            stagger: 0.1,
            delay: 0.2
          }
        );
      }

      // Animation du statut
      if (statusRef.current) {
        gsap.fromTo(statusRef.current,
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: motionTokens.durations.fast,
            ease: "back.out(1.7)",
            delay: 0.4
          }
        );
      }

    }, sectionRef);
    
    return () => ctx.revert();
  }, [healthData]);

  // Fonction pour obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status) {
      case 'OK':
        return 'text-green-400';
      case 'WARNING':
        return 'text-dk-yellow';
      case 'ERROR':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  // Fonction pour obtenir l'icône du statut
  const getStatusIcon = (status) => {
    switch (status) {
      case 'OK':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'WARNING':
        return <Activity className="w-6 h-6 text-dk-yellow" />;
      case 'ERROR':
        return <Activity className="w-6 h-6 text-red-400" />;
      default:
        return <Activity className="w-6 h-6 text-gray-400" />;
    }
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  // Afficher la page de connexion si non authentifié
  if (!isAuthenticated) {
    return <HealthLogin onLogin={setIsAuthenticated} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dk-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Activity className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Erreur de connexion</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <div className="space-x-4">
            <button 
              onClick={fetchHealthData}
              className="px-6 py-2 bg-dk-blue text-white rounded-lg hover:bg-dk-blue/80 transition-colors"
            >
              Réessayer
            </button>
            <button 
              onClick={handleLogout}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-dk-black py-20">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <a 
              href="/" 
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour au site
            </a>
            <a 
              href="http://localhost:3001/health" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-gray-400 hover:text-white transition-colors mr-4"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              API JSON
            </a>
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-400 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
          
          <h1 ref={titleRef} className="text-4xl md:text-6xl font-bold text-white mb-4">
            État du Système
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Monitoring en temps réel de l'API <span className="text-gradient hover:font-foundation-black">DK BUILDING</span>
          </p>
          
          {/* Statut principal */}
          {healthData && (
            <div ref={statusRef} className="inline-flex items-center bg-dk-gray/50 rounded-2xl px-6 py-3 mb-8">
              {getStatusIcon(healthData.status)}
              <span className={`ml-3 text-lg font-semibold ${getStatusColor(healthData.status)}`}>
                {healthData.status}
              </span>
              <span className="ml-3 text-gray-400">•</span>
              <span className="ml-3 text-gray-400">{healthData.message}</span>
            </div>
          )}
          
          {/* Dernière mise à jour et statut de session */}
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center">
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Dernière mise à jour: {lastUpdate ? formatDate(lastUpdate.toISOString()) : 'Jamais'}
            </div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2 text-green-400" />
              Session JWT active
            </div>
            {healthData?.security && (
              <div className="flex items-center">
                <Lock className="w-4 h-4 mr-2 text-dk-blue" />
                {healthData.security.level}
              </div>
            )}
          </div>
        </div>

        {/* Cartes d'informations */}
        {healthData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Informations générales */}
            <div ref={el => cardsRef.current[0] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Server className="w-6 h-6 text-dk-blue mr-3" />
                <h3 className="text-lg font-semibold text-white">Informations Générales</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white font-mono">{healthData.version}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environnement:</span>
                  <span className="text-white">{healthData.environment}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Port:</span>
                  <span className="text-white font-mono">{healthData.port}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Timestamp:</span>
                  <span className="text-white text-sm">{formatDate(healthData.timestamp)}</span>
                </div>
              </div>
            </div>

            {/* Temps de fonctionnement */}
            <div ref={el => cardsRef.current[1] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Clock className="w-6 h-6 text-green-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Temps de Fonctionnement</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Durée:</span>
                  <span className="text-white font-mono">{healthData.uptime.human}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Secondes:</span>
                  <span className="text-white font-mono">{healthData.uptime.seconds}</span>
                </div>
              </div>
            </div>

            {/* Système */}
            <div ref={el => cardsRef.current[2] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Cpu className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Système</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Plateforme:</span>
                  <span className="text-white">{healthData.system.platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Node.js:</span>
                  <span className="text-white font-mono">{healthData.system.nodeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">PID:</span>
                  <span className="text-white font-mono">{healthData.system.pid}</span>
                </div>
              </div>
            </div>

            {/* Mémoire */}
            <div ref={el => cardsRef.current[3] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Mémoire</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">RSS:</span>
                  <span className="text-white font-mono">{healthData.system.memory.rss}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heap Total:</span>
                  <span className="text-white font-mono">{healthData.system.memory.heapTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heap Used:</span>
                  <span className="text-white font-mono">{healthData.system.memory.heapUsed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">External:</span>
                  <span className="text-white font-mono">{healthData.system.memory.external}</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div ref={el => cardsRef.current[4] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Shield className="w-6 h-6 text-dk-yellow mr-3" />
                <h3 className="text-lg font-semibold text-white">Services</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Email:</span>
                  <div className="flex items-center">
                    {healthData.services.email === 'Configured' ? (
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    ) : (
                      <Activity className="w-4 h-4 text-red-400 mr-2" />
                    )}
                    <span className="text-white">{healthData.services.email}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">CORS:</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-white">{healthData.services.cors}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Helmet:</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-white">{healthData.services.helmet}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Morgan:</span>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-white">{healthData.services.morgan}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sécurité */}
            {healthData?.security && (
              <div ref={el => cardsRef.current[5] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
                <div className="flex items-center mb-4">
                  <Lock className="w-6 h-6 text-dk-blue mr-3" />
                  <h3 className="text-lg font-semibold text-white">Sécurité</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Niveau:</span>
                    <span className="text-white font-mono">{healthData.security.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Algorithme:</span>
                    <span className="text-white font-mono">{healthData.security.algorithm}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Longueur clé:</span>
                    <span className="text-white font-mono">{healthData.security.key_length} bits</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Itérations:</span>
                    <span className="text-white font-mono">{healthData.security.iterations}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div ref={el => cardsRef.current[6] = el} className="bg-dk-gray/30 rounded-2xl p-6 border border-gray-800/50">
              <div className="flex items-center mb-4">
                <Globe className="w-6 h-6 text-cyan-400 mr-3" />
                <h3 className="text-lg font-semibold text-white">Actions</h3>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={fetchHealthData}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center px-4 py-2 bg-dk-blue text-white rounded-lg hover:bg-dk-blue/80 transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Actualiser
                </button>
                <a 
                  href="http://localhost:3001/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  API Root
                </a>
                <a 
                  href="http://localhost:3001/health" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  JSON Raw
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && !healthData && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-dk-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="w-8 h-8 text-dk-blue animate-spin" />
            </div>
            <p className="text-gray-400">Chargement des données de santé...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthPage;