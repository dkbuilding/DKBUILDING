import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import AdminLogin from '../components/admin/AdminLogin';
import { Toaster } from 'react-hot-toast';
import { isAdminSubdomain } from '../utils/subdomainDetector';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAdminDomain = isAdminSubdomain();

  useEffect(() => {
    // Vérifier l'authentification JWT
    const token = localStorage.getItem('jwt_token');
    
    if (!token) {
      // Si on est sur le sous-domaine admin, on affiche le formulaire de connexion
      // Sinon, rediriger vers la page d'accueil
      if (!isAdminDomain) {
        navigate('/');
        return;
      }
    } else {
      // Vérifier la validité du token (optionnel, peut être fait côté serveur)
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, [navigate, isAdminDomain]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] flex items-center justify-center">
        <div className="text-white text-xl">Chargement du dashboard administrateur...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E]">
        <Toaster position="top-right" />
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <Toaster position="top-right" />
      <AdminPanel />
    </div>
  );
};

export default Admin;

