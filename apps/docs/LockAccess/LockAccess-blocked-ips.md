# Configuration LockAccess - Système Unifié Production

## Variables d'environnement

### LOCKACCESS

Active ou désactive le système LockAccess complet.

### LOCKACCESS_LOCKED

Verrouille le site entier pour tous les utilisateurs (même IPs autorisées).

### LOCKACCESS_MAINTENANCE_MODE

Affiche la page de maintenance pour tous les utilisateurs.

### LOCKACCESS_ALLOWED_IPS

Liste des IPs autorisées à accéder au site sans restriction.

### LOCKACCESS_BLOCKED_IPS

Liste des IPs bloquées qui ne peuvent pas accéder au site.

## Logique mathématique impartiale

### Priorité d'affichage

1. **MAINTENANCE_MODE = true** → Page de maintenance
2. **LOCKED = true** → Page de verrouillage global
3. **IP in BLOCKED_IPS** → Page IP bloquée
4. **Sinon** → Accès normal

### Accès autorisé uniquement si

```
MAINTENANCE_MODE = false 
AND LOCKED = false 
AND IP NOT IN BLOCKED_IPS
```

## Types d'écrans

### 1. Page de Maintenance (`maintenance`)

- **Déclencheur** : `LOCKACCESS_MAINTENANCE_MODE=true`
- **Affichage** : Pour tous les utilisateurs
- **Fonctionnalités** :
  - Message de maintenance
  - Informations de contact
  - Bouton de rafraîchissement
  - Estimation de retour

### 2. Page de Verrouillage Global (`locked`)

- **Déclencheur** : `LOCKACCESS_LOCKED=true`
- **Affichage** : Pour tous les utilisateurs
- **Fonctionnalités** :
  - Formulaire de connexion
  - Authentification requise
  - Gestion des sessions
  - Déconnexion

### 3. Page IP Bloquée (`ip-blocked`)

- **Déclencheur** : IP dans `LOCKACCESS_BLOCKED_IPS`
- **Affichage** : Pour les IPs bloquées uniquement
- **Fonctionnalités** :
  - Message d'accès refusé
  - Affichage de l'IP bloquée
  - Informations de contact
  - Raisons possibles

### 4. Accès Normal (`none`)

- **Déclencheur** : Aucune restriction
- **Affichage** : Site normal
- **Fonctionnalités** : Navigation complète

### Exemples de configuration

#### Développement

```env
LOCKACCESS=false
LOCKACCESS_ALLOWED_IPS=127.0.0.1,::1
LOCKACCESS_BLOCKED_IPS=
```

#### Production avec restrictions

```env
LOCKACCESS=true
LOCKACCESS_ALLOWED_IPS=192.168.1.0/24,10.0.0.0/8
LOCKACCESS_BLOCKED_IPS=203.0.113.100,198.51.100.0/24
```

#### Maintenance avec accès restreint

```env
LOCKACCESS=true
LOCKACCESS_MAINTENANCE_MODE=true
LOCKACCESS_ALLOWED_IPS=192.168.1.10,192.168.1.20
LOCKACCESS_BLOCKED_IPS=0.0.0.0/0
```

### API Endpoints

#### GET /api/lockAccess/config

Retourne la configuration complète incluant les IPs bloquées :

```json
{
  "success": true,
  "data": {
    "enabled": true,
    "maintenanceMode": false,
    "allowedIPs": ["127.0.0.1", "::1"],
    "blockedIPs": ["192.168.1.100", "203.0.113.0/24"],
    "timestamp": "2024-01-01T00:00:00.000Z",
    "environment": "production"
  }
}
```

#### GET /api/lockAccess/check-access

Vérifie l'accès avec gestion des IPs bloquées :

```json
{
  "success": true,
  "data": {
    "clientIP": "192.168.1.100",
    "isAllowed": false,
    "isBlocked": true,
    "lockAccessEnabled": true,
    "maintenanceMode": false,
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

#### GET /api/lockAccess/status

Statut complet avec informations d'accès :

```json
{
  "success": true,
  "data": {
    "system": {
      "enabled": true,
      "maintenanceMode": false,
      "environment": "production"
    },
    "access": {
      "clientIP": "192.168.1.100",
      "isAllowed": false,
      "isBlocked": true,
      "allowedIPs": ["127.0.0.1", "::1"],
      "blockedIPs": ["192.168.1.100", "203.0.113.0/24"]
    },
    "security": {
      "shouldShowLockScreen": true,
      "shouldShowMaintenance": false
    },
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
}
```

### Sécurité

- Les IPs bloquées ont la priorité absolue
- Support des réseaux CIDR pour bloquer des plages d'IPs
- Logs automatiques des tentatives d'accès bloquées
- Réponse HTTP 403 pour les IPs bloquées

### Frontend

Le composant LockAccess détecte automatiquement les IPs bloquées via l'API et affiche le message approprié.
