import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Wrench, Shield, Ban, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3001';

const LockAccessManager = () => {
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    enabled: false,
    locked: false,
    maintenanceMode: false,
    allowedIPs: '',
    blockedIPs: ''
  });

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/lockaccess/config`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la récupération');
      const result = await response.json();
      setConfig(result.data);
      setFormData({
        enabled: result.data.enabled || false,
        locked: result.data.locked || false,
        maintenanceMode: result.data.maintenanceMode || false,
        allowedIPs: Array.isArray(result.data.allowedIPs) ? result.data.allowedIPs.join(', ') : '',
        blockedIPs: Array.isArray(result.data.blockedIPs) ? result.data.blockedIPs.join(', ') : ''
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement de la configuration');
      setIsLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/lockaccess/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          enabled: formData.enabled,
          locked: formData.locked,
          maintenanceMode: formData.maintenanceMode,
          allowedIPs: formData.allowedIPs.split(',').map(ip => ip.trim()).filter(ip => ip),
          blockedIPs: formData.blockedIPs.split(',').map(ip => ip.trim()).filter(ip => ip)
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la sauvegarde');
      
      toast.success('Configuration LockAccess mise à jour');
      fetchConfig();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleQuickToggle = async (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    try {
      const token = localStorage.getItem('jwt_token');
      const response = await fetch(`${API_BASE_URL}/api/lockaccess/config`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          [field]: value
        })
      });

      if (!response.ok) throw new Error('Erreur lors de la mise à jour');
      
      toast.success(`${field === 'locked' ? 'Site' : field === 'maintenanceMode' ? 'Mode maintenance' : 'Système'} ${value ? 'activé' : 'désactivé'}`);
      fetchConfig();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
      setFormData(formData); // Revert on error
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gestion LockAccess</h1>
        <p className="text-gray-400">Contrôlez l'accès au site et configurez la sécurité</p>
      </div>

      {/* Statut rapide */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {config?.enabled ? (
                <CheckCircle className="w-6 h-6 text-green-400" />
              ) : (
                <XCircle className="w-6 h-6 text-gray-400" />
              )}
              <h3 className="text-lg font-semibold text-white">Système</h3>
            </div>
            <button
              onClick={() => handleQuickToggle('enabled', !formData.enabled)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                formData.enabled
                  ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                  : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
              }`}
            >
              {formData.enabled ? 'Activé' : 'Désactivé'}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {formData.enabled ? 'LockAccess est actif' : 'LockAccess est désactivé'}
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {formData.locked ? (
                <Lock className="w-6 h-6 text-red-400" />
              ) : (
                <Unlock className="w-6 h-6 text-green-400" />
              )}
              <h3 className="text-lg font-semibold text-white">Verrouillage</h3>
            </div>
            <button
              onClick={() => handleQuickToggle('locked', !formData.locked)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                formData.locked
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {formData.locked ? 'Verrouillé' : 'Déverrouillé'}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {formData.locked ? 'Site verrouillé pour tous' : 'Site accessible'}
          </p>
        </div>

        <div className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {formData.maintenanceMode ? (
                <Wrench className="w-6 h-6 text-yellow-400" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-400" />
              )}
              <h3 className="text-lg font-semibold text-white">Maintenance</h3>
            </div>
            <button
              onClick={() => handleQuickToggle('maintenanceMode', !formData.maintenanceMode)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                formData.maintenanceMode
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              }`}
            >
              {formData.maintenanceMode ? 'Actif' : 'Inactif'}
            </button>
          </div>
          <p className="text-sm text-gray-400">
            {formData.maintenanceMode ? 'Mode maintenance activé' : 'Site en production'}
          </p>
        </div>
      </div>

      {/* Formulaire de configuration */}
      <form onSubmit={handleSave} className="bg-[#1a1a1a] border border-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Shield className="w-6 h-6" />
          Configuration Avancée
        </h2>

        <div className="space-y-6">
          {/* IPs autorisées */}
          <div>
            <label className="block text-white mb-2 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              IPs Autorisées
            </label>
            <textarea
              value={formData.allowedIPs}
              onChange={(e) => setFormData({ ...formData, allowedIPs: e.target.value })}
              placeholder="127.0.0.1, ::1, 192.168.1.1"
              rows="3"
              className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Séparez les IPs par des virgules. Ces IPs auront toujours accès au site.
            </p>
          </div>

          {/* IPs bloquées */}
          <div>
            <label className="block text-white mb-2 flex items-center gap-2">
              <Ban className="w-4 h-4" />
              IPs Bloquées
            </label>
            <textarea
              value={formData.blockedIPs}
              onChange={(e) => setFormData({ ...formData, blockedIPs: e.target.value })}
              placeholder="192.168.1.100, 10.0.0.50"
              rows="3"
              className="w-full px-4 py-3 bg-[#0E0E0E] border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#F3E719]"
            />
            <p className="text-xs text-gray-500 mt-2">
              Séparez les IPs par des virgules. Ces IPs seront bloquées même si le site est déverrouillé.
            </p>
          </div>

          {/* Avertissement */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
              <div>
                <h3 className="text-yellow-400 font-semibold mb-1">Note importante</h3>
                <p className="text-sm text-gray-400">
                  Les modifications de configuration nécessitent un redémarrage du serveur pour être appliquées en production.
                  En développement, les changements sont appliqués immédiatement.
                </p>
              </div>
            </div>
          </div>

          {/* Boutons */}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={fetchConfig}
              className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-[#F3E719] text-[#0E0E0E] rounded-lg font-semibold hover:bg-[#e6d416] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LockAccessManager;

