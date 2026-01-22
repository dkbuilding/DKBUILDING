# Dépannage - Erreur 404 sur /api/news

## Problème

Le composant News affiche l'erreur : "Erreur HTTP 404: Not Found. Le backend peut ne pas être accessible"

## Solutions

### 1. Vérifier que le backend est démarré

```bash
cd apps/backend
pnpm run dev
# ou
node server.js
```

Le backend doit être accessible sur `http://localhost:3001`

### 2. Tester la route directement

```bash
curl http://localhost:3001/api/news
```

Devrait retourner un JSON avec `{"success": true, "data": [...]}`

### 3. Vérifier le proxy Vite

Le proxy Vite dans `vite.config.js` doit être configuré :

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:3001',
    changeOrigin: true,
    secure: false,
  }
}
```

### 4. Vérifier les variables d'environnement

Dans `.env` du frontend :

```env
API_BASE_URL=http://localhost:3001
```

### 5. Redémarrer le serveur frontend

```bash
cd apps/frontend
pnpm run dev
```

### 6. Vérifier la console du navigateur

Ouvrir les DevTools (F12) et vérifier :

- Les erreurs dans la console
- L'onglet Network pour voir les requêtes
- Si la requête vers `/api/news` est bien envoyée

### 7. Solution de contournement

Si le problème persiste, la route `/api/news` utilise maintenant :

1. D'abord les annonces de la base de données SQLite (si disponibles)
2. Sinon les données statiques (fallback)

Les données statiques devraient toujours fonctionner même si la DB n'est pas accessible.

## Vérification

Après correction, la route `/api/news` devrait :

- ✅ Retourner un JSON avec `success: true`
- ✅ Contenir un tableau `data` avec les actualités
- ✅ Fonctionner même si la base de données est vide (données statiques)
