# Quick Start - Sous-Domaine Admin

## Configuration Rapide

### 1. DNS

Ajoutez dans votre gestionnaire DNS :
```
Type: CNAME
Nom: admin
Valeur: dkbuilding.fr
```

### 2. Serveur Web (Nginx)

```nginx
server {
    listen 443 ssl http2;
    server_name admin.dkbuilding.fr;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
    }
}
```

### 3. Backend CORS

Le backend autorise déjà `admin.dkbuilding.fr` dans la configuration CORS.

### 4. Accès

1. Accédez à `https://admin.dkbuilding.fr`
2. Connectez-vous avec le mot de passe défini dans `HEALTH_PASSWORD`
3. Le dashboard s'affiche automatiquement

## Test Local

Pour tester en local, modifiez `/etc/hosts` :
```
127.0.0.1 admin.dkbuilding.fr
```

Puis accédez à : `http://admin.dkbuilding.fr:5173`

---

**C'est tout ! Le sous-domaine admin est configuré.** 🎉

