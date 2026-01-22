# LockAccess - Exemple d'intégration

```tsx
// Exemple d'intégration du composant LockAccess
// Ce fichier montre comment intégrer le système de verrouillage dans l'application

import React from 'react';
import LockAccess from './components/LockAccess';

// Composant principal de l'application
const App = () => {
  return (
    <div className="App">
      {/*
        Le composant LockAccess doit être placé au niveau racine
        pour intercepter tous les accès au site
      */}
      <LockAccess />

      {/* 
        Le reste du contenu de l'application sera affiché
        seulement si le site n'est pas verrouillé ou si l'utilisateur
        est authentifié
      */}
    </div>
  );
};

export default App;

// Alternative : Intégration conditionnelle
const ConditionalApp = () => {
  const [isSiteLocked, setIsSiteLocked] = React.useState(false);
  
  // Vérifier l'état de verrouillage au chargement
  React.useEffect(() => {
    const config = localStorage.getItem('dk_security_config');
    if (config) {
      const parsedConfig = JSON.parse(config);
      setIsSiteLocked(parsedConfig.isLocked);
    }
  }, []);

  return (
    <div className="App">
      {/*Afficher le LockAccess seulement si le site est verrouillé*/}
      {isSiteLocked && <LockAccess />}

      {/* Contenu normal de l'application */}
      <div className="main-content">
        {/* Vos composants existants */}
      </div>
    </div>
  );
};

// Exemple d'utilisation avec React Router
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const RoutedApp = () => {
  return (
    <Router>
      <div className="App">
        {/*LockAccess intercepte toutes les routes*/}
        <LockAccess />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/health" element={<HealthPage />} />
        </Routes>
      </div>
    </Router>
  );
};

// Exemple de configuration programmatique
const SecurityManager = () => {
  const [securityConfig, setSecurityConfig] = React.useState(null);
  
  React.useEffect(() => {
    // Charger la configuration de sécurité
    const config = localStorage.getItem('dk_security_config');
    if (config) {
      setSecurityConfig(JSON.parse(config));
    }
  }, []);

  const toggleSiteLock = () => {
    const newConfig = {
      ...securityConfig,
      isLocked: !securityConfig.isLocked
    };

    localStorage.setItem('dk_security_config', JSON.stringify(newConfig));
    setSecurityConfig(newConfig);
    
    // Recharger la page pour appliquer les changements
    window.location.reload();
  };

  return (
    <div className="security-manager">
      <h2>Gestionnaire de Sécurité</h2>
      <button onClick={toggleSiteLock}>
        {securityConfig?.isLocked ? 'Déverrouiller le site' : 'Verrouiller le site'}
      </button>

      <div className="security-status">
        <p>État: {securityConfig?.isLocked ? '🔒 Verrouillé' : '🔓 Déverrouillé'}</p>
        <p>Firewall: {securityConfig?.enableFirewall ? '✅ Actif' : '❌ Inactif'}</p>
        <p>Tracking: {securityConfig?.enableDeviceTracking ? '✅ Actif' : '❌ Inactif'}</p>
      </div>
    </div>
  );
};

export { ConditionalApp, RoutedApp, SecurityManager };
```
