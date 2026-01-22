# Configuration du Sous-Domaine Admin - admin.dkbuilding.fr

## Vue d'Ensemble

Le dashboard administrateur est maintenant configuré pour être accessible directement via le sous-domaine `admin.dkbuilding.fr`. Quand vous accédez à ce sous-domaine, vous êtes automatiquement redirigé vers le dashboard admin.

## Fonctionnement

### Détection Automatique

Le système détecte automatiquement si vous êtes sur le sous-domaine admin :
- `admin.dkbuilding.fr` → Dashboard admin
- `administrateur.dkbuilding.fr` → Dashboard admin
- `administrator.dkbuilding.fr` → Dashboard admin
- `dkbuilding.fr` → Site public normal

### Comportement

1. **Sur le sous-domaine admin** :
   - Toutes les routes redirigent vers `/admin`
   - Affichage direct du dashboard si authentifié
   - Affichage du formulaire de connexion si non authentifié

2. **Sur le domaine principal** :
   - Navigation normale du site
   - Accès au dashboard via `/admin` (optionnel)

## Configuration DNS

### Étape 1 : Enregistrement DNS

Ajoutez un enregistrement dans votre gestionnaire DNS :

```
Type: CNAME (recommandé) ou A
Nom: admin
Valeur: dkbuilding.fr (ou IP du serveur)
TTL: 3600 (ou selon votre configuration)
```

### Étape 2 : Propagation

La propagation DNS peut prendre jusqu'à 48 heures, mais généralement quelques minutes.

Vérifiez avec :
```bash
nslookup admin.dkbuilding.fr
# ou
dig admin.dkbuilding.fr
```

## Configuration Serveur Web

### Nginx (Recommandé)

```nginx
# Redirection HTTP vers HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name admin.dkbuilding.fr;
    return 301 https://$server_name$request_uri;
}

# Configuration HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name admin.dkbuilding.fr;

    # Certificat SSL (Let's Encrypt recommandé)
    ssl_certificate /etc/letsencrypt/live/admin.dkbuilding.fr/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/admin.dkbuilding.fr/privkey.pem;

    # Proxy vers le frontend Vite
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

    # Proxy vers frontend
    ProxyPreserveHost On
    ProxyPass / http://localhost:5173/
    ProxyPassReverse / http://localhost:5173/
    
    # Proxy API
    ProxyPass /api http://localhost:3001/api
    ProxyPassReverse /api http://localhost:3001/api
</VirtualHost>
```

## Certificat SSL

### Let's Encrypt (Gratuit)

```bash
# Installation certbot
sudo apt install certbot python3-certbot-nginx  # Ubuntu/Debian
# ou
brew install certbot  # macOS

# Génération du certificat
sudo certbot --nginx -d admin.dkbuilding.fr

# Renouvellement automatique
sudo certbot renew --dry-run
```

## Authentification

### Première Connexion

1. Accédez à `https://admin.dkbuilding.fr`
2. Vous verrez le formulaire de connexion
3. Entrez le mot de passe défini dans `HEALTH_PASSWORD` (variable d'environnement backend)
4. Le token JWT est automatiquement stocké
5. Vous êtes redirigé vers le dashboard

### Token JWT

Le token est stocké dans `localStorage` et reste valide pendant 30 minutes.

Pour obtenir un nouveau token :
- Se déconnecter et se reconnecter
- Ou utiliser l'endpoint `/api/auth/health` directement

## Variables d'Environnement

### Backend (.env)

```env
# Mot de passe pour l'authentification admin
HEALTH_PASSWORD=votre_mot_de_passe_securise

# URL du frontend (pour CORS)
FRONTEND_URL=https://admin.dkbuilding.fr

# Autres variables...
```

### Frontend

Le frontend détecte automatiquement le sous-domaine, aucune configuration supplémentaire n'est nécessaire.

## Test en Local

Pour tester en local, vous pouvez :

1. **Modifier votre hosts** :
```bash
sudo nano /etc/hosts
# Ajouter :
127.0.0.1 admin.dkbuilding.fr
```

2. **Accéder à** : `http://admin.dkbuilding.fr:5173`

3. **Ou utiliser le port directement** : `http://localhost:5173/admin`

## Sécurité

### Recommandations

1. **HTTPS obligatoire** : Ne jamais utiliser HTTP en production
2. **Mot de passe fort** : Utilisez un mot de passe complexe pour `HEALTH_PASSWORD`
3. **Rate limiting** : Implémentez un rate limiting sur `/api/auth/health`
4. **Logs** : Surveillez les tentatives de connexion
5. **Firewall** : Limitez l'accès au sous-domaine admin si nécessaire

### Protection CORS

Le backend doit autoriser le sous-domaine admin :

```javascript
app.use(cors({
  origin: [
    'https://dkbuilding.fr',
    'https://www.dkbuilding.fr',
    'https://admin.dkbuilding.fr'
  ],
  credentials: true
}));
```

## Dépannage

### Le sous-domaine ne fonctionne pas

1. Vérifiez la configuration DNS (propagation)
2. Vérifiez la configuration du serveur web
3. Vérifiez les certificats SSL
4. Vérifiez les logs du serveur

### Erreur CORS

1. Vérifiez que `admin.dkbuilding.fr` est dans la liste des origines autorisées
2. Vérifiez les en-têtes CORS dans les réponses
3. Vérifiez la configuration du proxy

### Authentification échoue

1. Vérifiez que `HEALTH_PASSWORD` est défini dans `.env`
2. Vérifiez les logs du backend
3. Vérifiez que le token est bien stocké dans `localStorage`

## Vérification

### Test DNS

```bash
nslookup admin.dkbuilding.fr
# Devrait retourner l'IP de votre serveur
```

### Test HTTPS

```bash
curl -I https://admin.dkbuilding.fr
# Devrait retourner 200 OK
```

### Test API

```bash
curl https://admin.dkbuilding.fr/api/health
# Devrait retourner les informations de l'API
```

---

**Le sous-domaine admin est maintenant configuré !** 🚀

Accédez à `https://admin.dkbuilding.fr` pour utiliser le dashboard administrateur.

