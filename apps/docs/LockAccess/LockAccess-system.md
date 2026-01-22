# LockAccess.tsx - Système de Verrouillage Sécurisé

## Description

Le composant `LockAccess.tsx` est un système de sécurité avancé permettant de verrouiller/déverrouiller l'accès au site web DK BUILDING avec des middleware sévères, un firewall intégré et des restrictions strictes.

## Fonctionnalités Principales

### 🔒 Verrouillage Conditionnel

- **Contrôle total** : Le site peut être verrouillé/déverrouillé à volonté
- **Configuration dynamique** : Interface de configuration en temps réel
- **Persistance** : Les paramètres sont sauvegardés dans le localStorage

### 🛡️ Middleware de Sécurité

- **Firewall intégré** : Protection contre les accès non autorisés
- **Tracking d'appareils** : Identification unique de chaque appareil
- **Géolocalisation** : Blocage par pays (optionnel)
- **Liste noire IP** : Blocage d'adresses IP spécifiques

### 🔐 Authentification Sécurisée

- **Sessions temporaires** : Expiration automatique des sessions
- **Tokens sécurisés** : Génération de tokens uniques par session
- **Limitation des tentatives** : Blocage après échecs répétés
- **Timeout de blocage** : Période d'attente après trop de tentatives

### 📱 Détection d'Appareils

- **Fingerprinting** : Identification unique basée sur les caractéristiques de l'appareil
- **Type d'appareil** : Détection automatique (desktop/mobile/tablet)
- **Informations système** : OS, navigateur, résolution d'écran
- **Liste blanche** : Autorisation d'appareils spécifiques

## Configuration par Défaut

```typescript
const DEFAULT_SECURITY_CONFIG = {
  isLocked: false,                    // Site verrouillé par défaut
  masterPassword: 'dkbuilding2025',   // Mot de passe maître
  sessionTimeout: 30,                 // 30 minutes de session
  maxAttempts: 3,                     // Maximum 3 tentatives
  lockoutDuration: 15,                // 15 minutes de blocage
  enableFirewall: true,               // Firewall activé
  enableDeviceTracking: true,         // Tracking d'appareils activé
  enableGeoBlocking: false,           // Blocage géographique désactivé
  allowedCountries: ['FR', 'BE', 'CH', 'CA', 'US'],
  blockedIPs: [],
  allowedDevices: []
};
```

## Utilisation

### 1. Import du Composant

```tsx
import LockAccess from './components/LockAccess';
```

### 2. Intégration dans l'Application

```tsx
function App() {
  return (
    <div className="App">
      {/* Autres composants */}
      <LockAccess />
    </div>
  );
}
```

### 3. Configuration du Verrouillage

Pour verrouiller le site, modifiez la configuration :

```typescript
// Via l'interface de configuration (bouton Settings)
// Ou programmatiquement :
securityMiddleware.updateConfig({ isLocked: true });
```

## Interface Utilisateur

### 🔴 État Verrouillé

- **Écran de connexion** avec formulaire sécurisé
- **Détection d'appareil** avec informations système
- **Compteur de tentatives** avec limitation
- **Temps de blocage** avec décompte en temps réel
- **Messages d'erreur** avec animations GSAP

### 🟢 État Déverrouillé

- **Dashboard de sécurité** avec statut en temps réel
- **Informations d'appareil** et session active
- **Actions disponibles** (déconnexion, actualisation)
- **Panel de configuration** accessible

### ⚙️ Panel de Configuration

- **Toggle de verrouillage** : Activer/désactiver le verrouillage
- **Paramètres firewall** : Contrôler les protections
- **Timeout de session** : Durée des sessions autorisées
- **Limite de tentatives** : Nombre d'essais autorisés
- **Réinitialisation** : Remettre à zéro la sécurité

## Sécurité Avancée

### 🔍 Fingerprinting d'Appareil

```typescript
// Génération d'un ID unique basé sur :
- User Agent
- Langue du navigateur
- Résolution d'écran
- Fuseau horaire
- Canvas fingerprinting
```

### 🎯 Tracking des Tentatives

```typescript
// Surveillance par appareil :
- Nombre de tentatives échouées
- Timestamp de la dernière tentative
- Durée de blocage calculée
- Réinitialisation après succès
```

### 🔐 Gestion des Sessions

```typescript
// Session sécurisée avec :
- Token unique généré
- Expiration automatique
- Vérification d'appareil
- Validation de token
```

## Animations GSAP

Le composant utilise GSAP pour des animations fluides :

- **Entrée des éléments** : Animations d'apparition progressives
- **Messages d'erreur** : Effets de shake et scale
- **Transitions** : Animations de transition entre états
- **Feedback visuel** : Animations de confirmation

## Personnalisation

### Couleurs et Thème

```css
/* Variables CSS personnalisables */
--dk-black: #0a0a0a;
--dk-gray: #1a1a1a;
--dk-blue: #3b82f6;
--red-500: #ef4444;
--green-500: #10b981;
```

### Durées d'Animation

```typescript
// Utilisation des motion tokens existants
duration: motionTokens.durations.normal,
ease: motionTokens.easing.smooth
```

## Sécurité en Production

### ⚠️ Recommandations

1. **Changer le mot de passe par défaut**
2. **Activer le HTTPS** pour toutes les communications
3. **Configurer les IPs autorisées** si nécessaire
4. **Surveiller les logs** de tentatives de connexion
5. **Mettre à jour régulièrement** les paramètres de sécurité

### 🔧 Configuration Serveur

```typescript
// Pour une sécurité maximale, implémenter côté serveur :
- Validation des tokens côté serveur
- Rate limiting par IP
- Logs de sécurité centralisés
- Notifications d'intrusion
```

## Dépannage

### Problèmes Courants

1. **Session expirée** : Reconnexion automatique requise
2. **Appareil bloqué** : Attendre la fin du timeout ou réinitialiser
3. **Configuration perdue** : Vérifier le localStorage
4. **Animations cassées** : Vérifier l'import de GSAP

### Commandes de Debug

```javascript
// Console du navigateur :
localStorage.getItem('dk_security_config')  // Voir la config
localStorage.getItem('dk_security_session') // Voir la session
localStorage.clear()                        // Réinitialiser tout
```

## Support

Pour toute question ou problème avec le système LockAccess, consultez :

- La documentation technique du projet
- Les logs de la console du navigateur
- Les paramètres de configuration dans le localStorage

---

**Note** : Ce système est conçu pour une sécurité maximale. Testez toujours en environnement de développement avant de déployer en production.
