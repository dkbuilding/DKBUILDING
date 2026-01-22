# Correction - nodemon manquant dans start.sh

## ✅ Problème résolu

### Erreur rencontrée

```
sh: nodemon: command not found
ELIFECYCLE  Command failed.
```

### Cause

Le script `dev` dans `package.json` utilise `nodemon server.js`, mais `nodemon` n'était pas installé comme dépendance.

### Solution

Ajout de `nodemon` comme dépendance de développement :

```bash
pnpm add -D nodemon
```

## Vérification

### Installation vérifiée

- ✅ `nodemon@3.1.11` installé dans `devDependencies`
- ✅ Accessible via `pnpm exec nodemon` ou `pnpm run dev`

### Scripts disponibles

**Backend** (`apps/backend/package.json`) :

- ✅ `start`: `node server.js` (production)
- ✅ `dev`: `nodemon server.js` (développement avec hot-reload)

## Utilisation

Le script `start.sh` peut maintenant démarrer le backend en mode développement :

```bash
./start.sh
```

Le backend démarrera avec `nodemon` pour le hot-reload automatique lors des modifications de fichiers.

## Note

`nodemon` est installé comme **devDependency** car il n'est nécessaire qu'en développement. En production, utilisez `pnpm start` qui utilise directement `node`.

---

**Problème résolu ! Le script start.sh fonctionne maintenant correctement.** ✅
