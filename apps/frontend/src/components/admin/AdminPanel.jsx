import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, LayoutDashboard, FileText, FolderKanban, Image, Settings, LogOut, Shield } from 'lucide-react';
import Dashboard from './Dashboard';
import AnnoncesManager from './AnnoncesManager';
import ProjetsManager from './ProjetsManager';
import MediaManager from './MediaManager';
import LockAccessManager from './LockAccessManager';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    toast.success('Déconnexion réussie');
    navigate('/');
  };

  const tabs = [
    { id: 'dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { id: 'annonces', label: 'Annonces', icon: FileText },
    { id: 'projets', label: 'Projets', icon: FolderKanban },
    { id: 'media', label: 'Médias', icon: Image },
    { id: 'lockaccess', label: 'LockAccess', icon: Shield },
    { id: 'settings', label: 'Paramètres', icon: Settings }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'annonces':
        return <AnnoncesManager />;
      case 'projets':
        return <ProjetsManager />;
      case 'media':
        return <MediaManager />;
      case 'lockaccess':
        return <LockAccessManager />;
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Paramètres</h2>
            <p className="text-gray-400">Paramètres à venir...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#0E0E0E]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-white">DK BUILDING</h1>
          <p className="text-sm text-gray-400 mt-1">Administration</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#F3E719] text-[#0E0E0E]'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors mb-2"
          >
            <Home className="w-5 h-5" />
            <span>Retour au site</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel;

