import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from '../components/admin/AdminPanel';
import AdminLogin from '../components/admin/AdminLogin';
import { Toaster } from 'react-hot-toast';
import { isAdminSubdomain } from '../utils/subdomainDetector';

const API_BASE_URL = import.meta.env.API_BASE_URL || 'http://localhost:3001';

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
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
          method: 'POST',
          credentials: 'include',
        });

        if (response.ok) {
          const result = await response.json();
          if (result.valid) {
            setIsAuthenticated(true);
          }
        } else {
          // Token invalide ou absent
          if (!isAdminDomain) {
            navigate('/');
            return;
          }
        }
      } catch (error) {
        // Erreur réseau ou serveur inaccessible
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
