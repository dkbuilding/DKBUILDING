# Configuration Backend — DK BUILDING

## Variables d'environnement

Le backend nécessite un fichier `.env` à la racine du dossier `backend/` pour fonctionner correctement.

### Création du fichier .env

1. Copier le fichier d'exemple :

```bash
cd Site\ Web/apps/backend
cp env.example .env
```

2. Éditer le fichier `.env` et configurer les variables suivantes.

### Variables requises

#### Configuration serveur

- **PORT** : Port d'écoute du serveur backend (défaut: `3001`)
- **FRONTEND_URL** : URL du frontend pour la configuration CORS (défaut: `http://localhost:5173`)
- **API_BASE_URL** : URL de base de l'API (défaut: `http://localhost:3001`)
- **NODE_ENV** : Environnement d'exécution (`development` ou `production`)

#### Configuration email (Resend)

**IMPORTANT** : Le service d'envoi d'emails nécessite une clé API Resend valide.

1. **Créer un compte Resend** :
   - Aller sur [https://resend.com](https://resend.com)
   - Créer un compte gratuit
   - Vérifier votre email

2. **Obtenir une clé API** :
   - Se connecter au dashboard Resend
   - Aller dans "API Keys"
   - Cliquer sur "Create API Key"
   - Donner un nom à la clé (ex: "DK BUILDING Production")
   - Copier la clé générée (commence par `re_`)

3. **Configurer le domaine d'envoi** :
   - Dans Resend, aller dans "Domains"
   - Ajouter votre domaine (ex: `dkbuilding.fr`)
   - Suivre les instructions pour configurer les enregistrements DNS
   - Une fois vérifié, vous pouvez envoyer des emails depuis ce domaine

4. **Variables à configurer** :
   - **RESEND_API_KEY** : Votre clé API Resend (ex: `re_xxxxxxxxxxxxxxxxxxxxx`)
   - **RESEND_FROM_EMAIL** : Email d'envoi au format `Nom <email@domaine.com>` (ex: `DK BUILDING <noreply@dkbuilding.fr>`)
   - **CONTACT_EMAIL** : Email de destination pour recevoir les demandes de devis (ex: `contact@dkbuilding.fr`)

### Exemple de fichier .env complet

```env
# Configuration serveur
PORT=3001
FRONTEND_PORT=5173
FRONTEND_URL=http://localhost:5173
API_BASE_URL=http://localhost:3001
NODE_ENV=development

# Configuration Resend
RESEND_API_KEY=re_votre_cle_api_ici
RESEND_FROM_EMAIL=DK BUILDING <noreply@dkbuilding.fr>
CONTACT_EMAIL=contact@dkbuilding.fr

# Logs
LOG_LEVEL=info

# Configuration LockAccess System
LOCKACCESS=true
LOCKACCESS_LOCKED=false
LOCKACCESS_MAINTENANCE_MODE=false
LOCKACCESS_ALLOWED_IPS=127.0.0.1,::1
LOCKACCESS_BLOCKED_IPS=
```

## Démarrage du backend

### Installation des dépendances

```bash
cd Site\ Web/apps/backend
npm install
```

### Démarrage en mode développement

```bash
npm run dev
```

Le serveur démarre avec `nodemon` pour le rechargement automatique.

### Démarrage en mode production

```bash
npm start
```

## Vérification de la configuration

### Vérifier le statut de l'API

```bash
curl http://localhost:3001/api/status
```

Réponse attendue :

```json
{
  "status": "OK",
  "service": "Contact API",
  "version": "latest",
  "emailConfigured": true,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Si `emailConfigured` est `false`, vérifiez que `RESEND_API_KEY` est correctement configuré dans le fichier `.env`.

### Tester l'envoi d'email

Le formulaire de contact enverra automatiquement :

1. Un email à `CONTACT_EMAIL` avec les détails de la demande
2. Un email de confirmation au client

## Sécurité

### Fichier .env

- **NE JAMAIS** commiter le fichier `.env` dans Git
- Le fichier `.env` est déjà dans `.gitignore`
- Utiliser `env.example` comme template pour la documentation

### Clé API Resend

- Ne jamais exposer la clé API dans le code source
- Ne jamais partager la clé API publiquement
- Régénérer la clé si elle est compromise

## Dépannage

### Erreur "Service email non configuré"

- Vérifier que `RESEND_API_KEY` est défini dans `.env`
- Vérifier que la clé commence par `re_`
- Vérifier que le fichier `.env` est bien à la racine du dossier `backend/`

### Erreur "Invalid API key"

- Vérifier que la clé API est correcte
- Vérifier que le compte Resend est actif
- Vérifier que le domaine d'envoi est vérifié dans Resend

### Erreur CORS

- Vérifier que `FRONTEND_URL` correspond à l'URL du frontend
- En développement, utiliser `http://localhost:5173`
- En production, utiliser l'URL complète du domaine

## Support

Pour toute question ou problème :

- Email : contact@dkbuilding.fr
- Documentation Resend : [https://resend.com/docs](https://resend.com/docs)
