# DK BUILDING - Site Web

Site web pour DK BUILDING, entreprise specialisee dans la construction metallique (charpente, bardage, couverture) basee a Albi, Tarn.

## Prerequis

- Node.js >= 18
- pnpm >= 9

## Installation

```bash
pnpm install
```

## Demarrage (developpement)

```bash
# Backend (port 3001)
pnpm dev:backend

# Frontend (port 5173)
pnpm dev:frontend
```

Ou via le script tout-en-un :

```bash
./start.sh
```

### Acces locaux

| Service        | URL                          |
|---------------|------------------------------|
| Frontend       | http://localhost:5173         |
| Backend API    | http://localhost:3001         |
| Health Check   | http://localhost:3001/health  |

## Structure du projet

```
Site Web/
├── apps/
│   ├── backend/          # API Express 5 (CommonJS)
│   │   ├── controllers/  # Logique metier (annonces, projets, media, admin)
│   │   ├── database/     # Client Turso (SQLite cloud)
│   │   ├── middleware/    # JWT, rate limiting, sanitizer, admin guard, upload
│   │   ├── routes/       # Endpoints API (contact, auth, news, annonces, projets, media, admin, lockaccess)
│   │   ├── utils/        # Services (email, logger, backup, apiResponse, security)
│   │   ├── validators/   # Schemas Zod (backend)
│   │   └── server.js     # Point d'entree Express
│   ├── frontend/         # React 19 + Vite 7 (ESM)
│   │   └── src/
│   │       ├── components/   # Composants React (Hero, Services, Portfolio, Contact, etc.)
│   │       ├── config/       # Configuration frontend
│   │       ├── hooks/        # Hooks custom (scroll, navigation, API, health check)
│   │       ├── lib/          # Bibliotheques internes
│   │       ├── pages/        # Pages (Home, Legal, Error)
│   │       ├── utils/        # Utilitaires (cloudinary, GSAP, motion, URL matching)
│   │       └── validators/   # Schemas Zod (frontend, types TS inferes)
│   ├── shared/           # Package partage (@dkbuilding/shared)
│   │   ├── constants/    # Constantes metier
│   │   ├── types/        # Types partages
│   │   └── validators/   # Schemas Zod de reference
│   ├── docs/             # Documentation technique (guides, rapports, configurations)
│   └── data/             # Donnees statiques
├── package.json          # Workspace root (pnpm workspaces)
├── pnpm-workspace.yaml
├── start.sh              # Script de demarrage automatique
└── _backup/              # Sauvegardes
```

## Variables d'environnement

Copier `apps/backend/.env.example` vers `apps/backend/.env` et renseigner les valeurs.

| Variable                | Description                                    |
|------------------------|------------------------------------------------|
| `NODE_ENV`              | Environnement (`development` / `production`)   |
| `PORT`                  | Port du serveur backend                         |
| `FRONTEND_URL`          | URL du frontend (CORS)                          |
| `TURSO_DATABASE_URL`    | URL de la base de donnees Turso                 |
| `TURSO_AUTH_TOKEN`      | Token d'authentification Turso                  |
| `CLOUDINARY_CLOUD_NAME` | Nom du cloud Cloudinary                         |
| `CLOUDINARY_API_KEY`    | Cle API Cloudinary                              |
| `CLOUDINARY_API_SECRET` | Secret API Cloudinary                           |
| `RESEND_API_KEY`        | Cle API Resend (envoi d'emails)                 |
| `RESEND_FROM_EMAIL`     | Adresse expediteur pour les emails              |
| `CONTACT_EMAIL`         | Adresse de reception des demandes de devis      |
| `JWT_SECRET`            | Secret JWT (generer avec `generateSecurity.js`) |
| `JWT_SALT`              | Salt JWT                                        |
| `HEALTH_PASSWORD`       | Mot de passe pour le Health Monitoring           |
| `ADMIN_ALLOWED_IPS`     | IPs autorisees pour l'acces admin (production)  |
| `LOCKACCESS`            | Activation du systeme LockAccess                |

## Scripts disponibles

### Racine (workspace)

| Script             | Commande                      |
|-------------------|-------------------------------|
| `dev:backend`      | Demarre le backend (nodemon)   |
| `dev:frontend`     | Demarre le frontend (Vite)     |
| `build:backend`    | Build du backend               |
| `build:frontend`   | Build du frontend              |

### Backend (`apps/backend/`)

| Script             | Commande                          |
|-------------------|-----------------------------------|
| `start`            | Demarre le serveur (production)    |
| `dev`              | Demarre avec nodemon               |
| `db:init`          | Initialise la base de donnees      |
| `db:migrate`       | Execute les migrations             |
| `backup:create`    | Cree une sauvegarde                |
| `backup:restore`   | Restaure une sauvegarde            |

### Frontend (`apps/frontend/`)

| Script             | Commande                              |
|-------------------|---------------------------------------|
| `dev`              | Serveur de developpement Vite          |
| `build`            | Build de production                    |
| `build:prerender`  | Build + prerendering SEO               |
| `test`             | Tests unitaires (Vitest, mode watch)   |
| `test:run`         | Tests unitaires (une seule execution)  |
| `test:coverage`    | Tests avec couverture de code          |
| `lint`             | Linting ESLint                         |
| `lint:md`          | Linting des fichiers Markdown          |

## API Endpoints

### Routes publiques

| Methode | Endpoint                    | Description                          |
|---------|----------------------------|--------------------------------------|
| GET     | `/`                         | Informations API                     |
| POST    | `/api/contact`              | Formulaire de demande de devis       |
| GET     | `/api/status`               | Statut du service Contact            |
| POST    | `/api/report-validation-error` | Signalement d'erreur de validation |
| GET     | `/api/news`                 | Liste des actualites publiees        |
| GET     | `/api/news/:id`             | Detail d'un article                  |
| GET     | `/api/annonces/public`      | Annonces publiques                   |
| GET     | `/api/annonces/slug/:slug`  | Annonce par slug                     |
| GET     | `/api/projets/public`       | Projets publics                      |
| GET     | `/api/projets/featured`     | Projets mis en avant                 |
| GET     | `/api/projets/slug/:slug`   | Projet par slug                      |
| GET     | `/api/media/:filename`      | Servir un fichier media (Cloudinary) |
| GET     | `/api/lockaccess/config`    | Configuration LockAccess             |
| GET     | `/api/lockaccess/check-access` | Verification d'acces IP          |
| GET     | `/api/lockaccess/status`    | Statut complet LockAccess            |

### Routes authentifiees (JWT)

| Methode | Endpoint                    | Description                          |
|---------|----------------------------|--------------------------------------|
| POST    | `/api/auth/health`          | Authentification Health Monitoring   |
| POST    | `/api/auth/logout`          | Deconnexion (suppression cookie)     |
| POST    | `/api/auth/verify`          | Verification d'un token JWT          |
| POST    | `/api/auth/refresh`         | Renouvellement du token JWT          |
| GET     | `/api/auth/status`          | Statut de la configuration auth      |
| GET     | `/health`                   | Health check du serveur              |
| GET     | `/api/annonces`             | Liste de toutes les annonces         |
| GET     | `/api/annonces/:id`         | Detail d'une annonce                 |
| GET     | `/api/projets`              | Liste de tous les projets            |
| GET     | `/api/projets/:id`          | Detail d'un projet                   |
| GET     | `/api/media`                | Liste des fichiers media             |
| POST    | `/api/media/upload`         | Upload de fichier (Cloudinary)       |
| DELETE  | `/api/media/:filename`      | Suppression de fichier               |

### Routes admin (JWT + role admin + IP whitelist)

| Methode | Endpoint                    | Description                          |
|---------|----------------------------|--------------------------------------|
| POST    | `/api/annonces`             | Creer une annonce                    |
| PUT     | `/api/annonces/:id`         | Modifier une annonce                 |
| DELETE  | `/api/annonces/:id`         | Supprimer une annonce                |
| POST    | `/api/projets`              | Creer un projet                      |
| PUT     | `/api/projets/:id`          | Modifier un projet                   |
| DELETE  | `/api/projets/:id`          | Supprimer un projet                  |
| GET     | `/api/admin/stats`          | Statistiques du dashboard            |
| GET     | `/api/admin/logs`           | Logs d'audit                         |
| POST    | `/api/admin/backup`         | Creer une sauvegarde                 |
| GET     | `/api/admin/backup/list`    | Lister les sauvegardes               |
| DELETE  | `/api/admin/backup/:filename` | Supprimer une sauvegarde           |
| POST    | `/api/admin/backup/clean`   | Nettoyer les anciennes sauvegardes   |
| PUT     | `/api/lockaccess/config`    | Modifier la configuration LockAccess |

## Technologies

| Couche    | Technologies                                                |
|-----------|-------------------------------------------------------------|
| Frontend  | React 19, Vite 7, TailwindCSS 4, GSAP 3, React Router 7   |
| Backend   | Express 5, Zod 4, JWT (HS512), Resend, Helmet, Morgan      |
| Base      | Turso (libSQL / SQLite cloud)                               |
| Stockage  | Cloudinary                                                  |
| Tests     | Vitest 4, Testing Library                                   |
| Linting   | ESLint 9, TypeScript 5.9                                    |
| Package   | pnpm workspaces                                             |

## Deploiement

### Frontend

```bash
cd apps/frontend
pnpm build
# Genere dist/ pret pour deploiement statique
```

### Backend

```bash
cd apps/backend
node server.js
# Ou mode serverless via vercel.json (Vercel Functions)
```

**Production** : dkbuilding.fr (SSL Let's Encrypt, CDN Cloudflare)

## Documentation

La documentation technique detaillee se trouve dans `apps/docs/`. Les documents principaux :

- `Site Web — DK BUILDING.md` : specification complete du site
- `Plan site web — DK BUILDING.plan.md` : plan de developpement
- `CONFIGURATION_BACKEND.md` : configuration backend detaillee
- `SECURITE JWT DK BUILDING - Systeme NSA.md` : architecture JWT
