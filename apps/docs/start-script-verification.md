# Vérification du Script start.sh

## ✅ Corrections apportées

### 1. Port Frontend corrigé

- **Avant** : `FRONTEND_PORT=${FRONTEND_PORT:-2315}` (port non standard)
- **Après** : `FRONTEND_PORT=${FRONTEND_PORT:-5173}` (port Vite standard)

### 2. Commande Backend améliorée

- **Avant** : `$PACKAGE_MANAGER start` (mode production, pas de hot-reload)
- **Après** : Utilise `dev` si disponible (avec nodemon pour hot-reload), sinon `start`

### 3. Commande Frontend améliorée

- **Avant** : `PORT=$FRONTEND_PORT $PACKAGE_MANAGER run dev`
- **Après** : `PORT=$FRONTEND_PORT $PACKAGE_MANAGER run dev --port $FRONTEND_PORT`
- Le flag `--port` garantit que Vite utilise le bon port même si PORT n'est pas lu

## Vérification

### Scripts disponibles

**Backend** (`apps/backend/package.json`) :

- ✅ `start`: `node server.js` (production)
- ✅ `dev`: `nodemon server.js` (développement avec hot-reload)

**Frontend** (`apps/frontend/package.json`) :

- ✅ `dev`: `vite --host` (développement)

### Ports par défaut

- **Backend** : `3001` (configurable via `BACKEND_PORT`)
- **Frontend** : `5173` (configurable via `FRONTEND_PORT`)

### Utilisation

```bash
# Démarrage standard
./start.sh

# Avec ports personnalisés
BACKEND_PORT=3002 FRONTEND_PORT=8080 ./start.sh

# Sans tunnel
ENABLE_TUNNEL=false ./start.sh
```

## Fonctionnalités du script

1. ✅ **Vérification des dépendances** : Node.js, pnpm/npm
2. ✅ **Installation automatique** : Dépendances frontend et backend
3. ✅ **Vérification de sécurité** : Audit des vulnérabilités
4. ✅ **Libération des ports** : Libère automatiquement les ports occupés
5. ✅ **Vérification de santé** : Vérifie que le backend répond avant de continuer
6. ✅ **Tunnel Cloudflare** : Optionnel, pour exposer le frontend publiquement
7. ✅ **Gestion des erreurs** : Arrêt propre en cas d'erreur
8. ✅ **Nettoyage** : Arrêt propre avec Ctrl+C

## Tests recommandés

1. **Test de démarrage** :

   ```bash
   ./start.sh
   ```

2. **Vérifier les ports** :

   ```bash
   lsof -i :3001  # Backend
   lsof -i :5173  # Frontend
   ```

3. **Vérifier les URLs** :
   - Backend : http://localhost:3001
   - Frontend : http://localhost:5173

4. **Vérifier les logs** :
   - Le script affiche les logs en temps réel
   - Vérifier qu'il n'y a pas d'erreurs

## Dépannage

### Le backend ne démarre pas

1. Vérifier que le port 3001 est libre
2. Vérifier les logs du backend
3. Vérifier que le fichier `.env` existe dans `apps/backend/`

### Le frontend ne démarre pas

1. Vérifier que le port 5173 est libre
2. Vérifier les logs du frontend
3. Vérifier que les dépendances sont installées

### Les ports sont occupés

Le script libère automatiquement les ports, mais si cela échoue :

```bash
# Trouver le processus
lsof -i :3001
lsof -i :5173

# Arrêter manuellement
kill -9 <PID>
```

---

**Le script start.sh est maintenant vérifié et corrigé !** ✅
