import React, { useState } from 'react';
import { Lock, AlertCircle, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3001';

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Obtenir un token JWT via l'endpoint health
      const response = await fetch(`${API_BASE_URL}/api/auth/health`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Mot de passe incorrect');
      }

      const result = await response.json();
      
      if (result.token) {
        localStorage.setItem('jwt_token', result.token);
        toast.success('Connexion réussie');
        if (onLogin) onLogin();
        // Recharger pour afficher le dashboard
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        throw new Error('Token non reçu');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error(error.message || 'Erreur de connexion. Vérifiez votre mot de passe.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#F3E719]/10 rounded-full mb-4">
            <Shield className="w-8 h-8 text-[#F3E719]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard Administrateur</h1>
          <p className="text-gray-400">DK BUILDING</p>
          <p className="text-xs text-gray-500 mt-2">admin.dkbuilding.fr</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-white mb-2 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Entrez le mot de passe d'administration"
              className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719] transition-colors"
              autoFocus
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full px-6 py-3 bg-[#F3E719] text-[#0E0E0E] rounded-lg font-semibold hover:bg-[#e6d416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0E0E0E] border-t-transparent rounded-full animate-spin"></div>
                <span>Connexion...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Se connecter</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-yellow-400 font-semibold mb-1">Accès sécurisé</p>
              <p className="text-xs text-gray-400">
                Ce dashboard est protégé par authentification JWT niveau NSA. 
                Contactez l'administrateur pour obtenir les identifiants.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
