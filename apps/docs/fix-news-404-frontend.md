# Correction de l'erreur 404 /api/news côté frontend

## ✅ Corrections apportées

### 1. Hook `useNewsAPI` amélioré

- **Utilisation du proxy Vite en priorité** : En développement, utilise toujours `/api` qui est proxifié vers `http://localhost:3001`
- **Gestion d'erreur améliorée** : Messages plus clairs avec instructions de dépannage
- **Logs de debug** : Console logs pour aider au débogage

### 2. Configuration du proxy Vite

- **Proxy amélioré** : Ajout de logs pour voir les requêtes proxyées
- **Gestion d'erreur** : Meilleure gestion des erreurs de proxy

### 3. Messages d'erreur améliorés

- Instructions claires pour résoudre le problème
- Vérification des étapes nécessaires

## Vérification

### 1. Backend doit être démarré

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

Doit retourner : `{"success":true,"data":[...]}`

### 3. Frontend doit être démarré

```bash
cd apps/frontend
pnpm run dev
```

### 4. Vérifier le proxy

Le proxy Vite doit router `/api` vers `http://localhost:3001`. Vérifiez dans la console du navigateur (F12 > Network) que la requête vers `/api/news` est bien envoyée.

## Si l'erreur persiste

1. **Vérifier les logs du backend** : Voir si les requêtes arrivent
2. **Vérifier la console du navigateur** : Voir l'erreur exacte
3. **Vérifier le proxy Vite** : Les logs dans le terminal Vite doivent montrer les requêtes proxyées
4. **Redémarrer les serveurs** : Parfois nécessaire après modification de la config

## Solution de contournement

Si le proxy ne fonctionne toujours pas, vous pouvez définir dans `.env` :

```env
API_BASE_URL=http://localhost:3001
```

Mais normalement, le proxy Vite devrait fonctionner automatiquement avec `/api`.
