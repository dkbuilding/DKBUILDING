import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import AdminLogin from '../components/admin/AdminLogin';
import { isAdminSubdomain } from '../utils/subdomainDetector';
import { api } from '@/lib/api';

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isAdminDomain = isAdminSubdomain();

  useEffect(() => {
    // Vérifier l'authentification JWT via l'endpoint /auth/verify
    // Le token est dans un cookie HttpOnly, donc on ne peut pas le lire côté client
    const verifyAuth = async () => {
      try {
        const result = await api.post('/auth/verify');
        if (result.valid) {
          setIsAuthenticated(true);
        }
      } catch {
        // Token invalide ou absent — rediriger vers l'accueil si pas sur le sous-domaine admin
        if (!isAdminDomain) {
          navigate('/');
          return;
        }
      }

      setIsLoading(false);
    };

    verifyAuth();
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
        <AdminLogin onLogin={() => setIsAuthenticated(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0E0E0E]">
      <AdminPanel />
    </div>
  );
};

export default Admin;
