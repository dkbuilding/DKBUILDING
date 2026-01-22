# Configuration du Sous-Domaine Admin - admin.dkbuilding.fr

## Vue d'ensemble

Le dashboard administrateur est accessible via le sous-domaine `admin.dkbuilding.fr` pour une séparation claire entre le site public et l'interface d'administration.

## Configuration DNS

### Enregistrement DNS

Ajoutez un enregistrement A ou CNAME dans votre gestionnaire DNS :

```
Type: A ou CNAME
Nom: admin
Valeur: [IP du serveur] ou dkbuilding.fr
TTL: 3600 (ou selon votre configuration)
```

### Exemple avec Cloudflare

1. Connectez-vous à Cloudflare
2. Sélectionnez le domaine `dkbuilding.fr`
3. Allez dans "DNS" > "Enregistrements"
4. Ajoutez un enregistrement :
   - Type : `CNAME`
   - Nom : `admin`
   - Cible : `dkbuilding.fr` (ou l'IP de votre serveur)
   - Proxy : Activé (recommandé)

## Configuration Serveur

### Nginx (Recommandé)

```nginx
# Configuration pour admin.dkbuilding.fr
server {
    listen 80;
    listen [::]:80;
    server_name admin.dkbuilding.fr;

    # Redirection HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.dkbuilding.fr;

    # Certificat SSL
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    # Proxy vers le frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Proxy API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Apache

```apache
<VirtualHost *:80>
    ServerName admin.dkbuilding.fr
    Redirect permanent / https://admin.dkbuilding.fr/
</VirtualHost>

<VirtualHost *:443>
    ServerName admin.dkbuilding.fr

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # Proxy vers le frontend
    ProxyPreserveHost On
    ProxyPass / http://localhost:5173/
    ProxyPassReverse / http://localhost:5173/

    # Proxy API
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</VirtualHost>
```

## Configuration Frontend

### Vite Configuration

Le frontend doit être configuré pour accepter le sous-domaine. La configuration actuelle dans `vite.config.js` devrait déjà fonctionner.

### Variables d'Environnement

```env
# URL du backend
API_BASE_URL=https://admin.dkbuilding.fr/api

# URL du frontend
BASE_URL=https://admin.dkbuilding.fr
```

## Configuration Backend

### CORS

Assurez-vous que le backend autorise le sous-domaine :

```javascript
app.use(
  cors({
    origin: [
      "https://dkbuilding.fr",
      "https://www.dkbuilding.fr",
      "https://admin.dkbuilding.fr",
    ],
    credentials: true,
  }),
);
```

## Sécurité

### Authentification Requise

Le dashboard admin nécessite une authentification JWT. Assurez-vous que :

1. Toutes les routes admin sont protégées
2. Le token JWT est valide et non expiré
3. Les sessions expirent après une période d'inactivité

### HTTPS Obligatoire

Le sous-domaine admin doit toujours utiliser HTTPS pour :

- Protéger les tokens JWT
- Chiffrer les communications
- Respecter les standards de sécurité

### Rate Limiting

Implémentez un rate limiting sur les routes admin pour prévenir les attaques par force brute.

## Accès

### URL d'Accès

- **Production** : `https://admin.dkbuilding.fr`
- **Développement** : `http://localhost:5173/admin`

### Authentification

1. Obtenir un token JWT via `/api/auth/health`
2. Le token est automatiquement stocké dans `localStorage`
3. Accéder au dashboard admin

## Fonctionnalités Disponibles

### Dashboard

- Vue d'ensemble avec statistiques
- Graphiques et métriques

### Gestion de Contenu

- **Annonces** : CRUD complet avec formulaires intuitifs
- **Projets** : CRUD complet avec upload de fichiers
- **Médias** : Gestionnaire de fichiers avec drag & drop

### Sécurité

- **LockAccess** : Gestion complète du système de verrouillage
  - Activation/désactivation
  - Mode maintenance
  - Gestion des IPs (autorisées/bloquées)
  - Verrouillage global

### Paramètres

- Configuration système (à venir)
- Gestion des utilisateurs (à venir)
- Sauvegardes

## Maintenance

### Redémarrage du Serveur

Après modification de la configuration LockAccess, redémarrer le serveur :

```bash
# Backend
cd apps/backend
pm2 restart dk-building-api

# Ou avec npm
npm restart
```

### Vérification

Vérifiez que le sous-domaine fonctionne :

```bash
# Test DNS
nslookup admin.dkbuilding.fr

# Test HTTPS
curl -I https://admin.dkbuilding.fr

# Test API
curl https://admin.dkbuilding.fr/api/health
```

## Dépannage

### Le sous-domaine ne se charge pas

1. Vérifiez la configuration DNS (propagation peut prendre jusqu'à 48h)
2. Vérifiez la configuration du serveur web (Nginx/Apache)
3. Vérifiez les certificats SSL
4. Vérifiez les logs du serveur

### Erreurs CORS

1. Vérifiez que le sous-domaine est dans la liste des origines autorisées
2. Vérifiez les en-têtes CORS dans les réponses
3. Vérifiez la configuration du proxy

### Authentification échoue

1. Vérifiez que le token JWT est valide
2. Vérifiez l'expiration du token
3. Vérifiez les logs du backend pour les erreurs
