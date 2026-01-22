# Backend Cold DK BUILDING - Spécification Complète

## Vue d'ensemble

Le Backend Cold DK BUILDING est un système de gestion de contenu entièrement local, fonctionnant hors ligne, sans dépendance à des services cloud. Il permet de gérer les annonces/actualités et les projets/réalisations du site web DK BUILDING.

## Architecture

### Stack Technologique

- **Backend API** : Node.js + Express.js
- **Base de données** : SQLite (fichier local `.db`)
- **Stockage fichiers** : Système de fichiers local (`storage/`)
- **Frontend Admin** : React + TailwindCSS + GSAP
- **Authentification** : JWT (système existant)
- **Gestionnaire de paquets** : pnpm

### Structure des Fichiers

```
apps/backend/
├── database/
│   ├── db.js                    # Connexion SQLite
│   ├── migrations/              # Migrations SQL
│   └── models/                 # Modèles TypeScript
├── storage/                     # Stockage fichiers
│   ├── images/
│   │   ├── annonces/
│   │   └── projets/
│   ├── documents/
│   │   ├── annonces/
│   │   └── projets/
│   └── videos/
│       └── projets/
├── routes/                      # Routes API
├── controllers/                 # Controllers
├── middleware/                  # Middlewares
└── utils/                       # Utilitaires

apps/frontend/src/components/admin/
├── AdminPanel.jsx
├── Dashboard.jsx
├── AnnoncesManager.jsx
├── ProjetsManager.jsx
└── MediaManager.jsx
```

## Base de Données SQLite

### Tables

#### `annonces`

- Gestion des annonces/actualités
- Champs : id, titre, description, contenu, categorie, statut, images, documents, slug, etc.

#### `projets`

- Gestion des projets/réalisations
- Champs : id, titre, description, type_projet, client, lieu, statut, images, documents, videos, featured, etc.

#### `admin_users`

- Utilisateurs administrateurs
- Extension de la table existante

#### `logs`

- Journalisation des actions
- Champs : id, action, entity_type, entity_id, user_id, details, timestamp

## API Endpoints

### Annonces (`/api/annonces`)

- `GET /api/annonces` - Liste toutes les annonces (protégé)
- `GET /api/annonces/:id` - Détails d'une annonce (protégé)
- `GET /api/annonces/slug/:slug` - Récupération par slug (public)
- `GET /api/annonces/public` - Annonces publiques (public)
- `POST /api/annonces` - Créer une annonce (protégé, multipart)
- `PUT /api/annonces/:id` - Mettre à jour (protégé, multipart)
- `DELETE /api/annonces/:id` - Supprimer (protégé)

### Projets (`/api/projets`)

- `GET /api/projets` - Liste tous les projets (protégé)
- `GET /api/projets/:id` - Détails d'un projet (protégé)
- `GET /api/projets/slug/:slug` - Récupération par slug (public)
- `GET /api/projets/featured` - Projets mis en avant (public)
- `GET /api/projets/public` - Projets publics (public)
- `POST /api/projets` - Créer un projet (protégé, multipart)
- `PUT /api/projets/:id` - Mettre à jour (protégé, multipart)
- `DELETE /api/projets/:id` - Supprimer (protégé)

### Médias (`/api/media`)

- `GET /api/media/:filename` - Servir un fichier (public)
- `GET /api/media/list` - Lister tous les médias (protégé)
- `POST /api/media/upload` - Upload fichier (protégé, multipart)
- `DELETE /api/media/:filename` - Supprimer (protégé)

### Admin (`/api/admin`)

- `GET /api/admin/stats` - Statistiques (protégé)
- `GET /api/admin/logs` - Logs récents (protégé)
- `POST /api/admin/backup` - Créer une sauvegarde (protégé)
- `GET /api/admin/backup/list` - Lister les sauvegardes (protégé)
- `DELETE /api/admin/backup/:filename` - Supprimer sauvegarde (protégé)
- `POST /api/admin/backup/clean` - Nettoyer anciennes sauvegardes (protégé)

## Sécurité

### Authentification

- Toutes les routes admin nécessitent un token JWT valide
- Utilisation du middleware JWT existant (`middleware/jwtAuth.js`)
- Token stocké dans `localStorage` côté frontend

### Validation des Fichiers

- Types acceptés : jpg, jpeg, png, webp, pdf, docx, mp4, mov
- Taille max : 8 MB par fichier
- Validation MIME type
- Noms de fichiers sanitizés

### Stockage Sécurisé

- Fichiers stockés hors de la racine web
- Chemins relatifs en base de données
- Protection contre directory traversal

## Panneau d'Administration

### Composants

- **AdminPanel** : Layout principal avec navigation
- **Dashboard** : Vue d'ensemble avec statistiques
- **AnnoncesManager** : CRUD annonces
- **ProjetsManager** : CRUD projets
- **MediaManager** : Gestionnaire de fichiers

### Design

- Palette DK BUILDING : Jaune (#F3E719), Noir (#0E0E0E)
- TailwindCSS pour le styling
- Responsive mobile-first
- Animations GSAP pour transitions

## Scripts de Sauvegarde

### Commandes Disponibles

```bash
# Initialiser la base de données
pnpm run db:init

# Exécuter les migrations
pnpm run db:migrate

# Créer une sauvegarde
pnpm run backup:create

# Lister les sauvegardes
node scripts/backup.js list

# Nettoyer les anciennes sauvegardes
node scripts/backup.js clean [N]
```

### Format de Sauvegarde

- Format : ZIP
- Contenu : Base de données SQLite + dossier storage/
- Destination : `_backup/`
- Nom : `dkbuilding-backup-[timestamp].zip`

## Installation et Démarrage

### Prérequis

- Node.js 18+
- pnpm

### Installation

```bash
# Installer les dépendances backend
cd apps/backend
pnpm install

# Installer les dépendances frontend
cd ../frontend
pnpm install
```

### Initialisation

```bash
# Initialiser la base de données
cd apps/backend
pnpm run db:init
```

### Démarrage

```bash
# Backend (port 3001)
cd apps/backend
pnpm run dev

# Frontend (port 5173)
cd apps/frontend
pnpm run dev
```

## Utilisation

### Accès au Panneau Admin

1. Obtenir un token JWT via `/api/auth/health` (système existant)
2. Accéder à `/admin` dans le frontend
3. Le token est automatiquement vérifié

### Créer une Annonce

1. Aller dans "Annonces" > "Nouvelle annonce"
2. Remplir le formulaire
3. Uploader des images/documents si nécessaire
4. Choisir le statut (brouillon/publie/archive)
5. Sauvegarder

### Créer un Projet

1. Aller dans "Projets" > "Nouveau projet"
2. Remplir le formulaire
3. Uploader des images/documents/vidéos
4. Marquer comme "Mis en avant" si nécessaire
5. Sauvegarder

## Critères d'Acceptation

- ✅ Backend fonctionne hors ligne à 100%
- ✅ Aucune dépendance à un service externe (cloud)
- ✅ Annonces et projets peuvent être créés, modifiés, supprimés
- ✅ Upload et gestion de fichiers fonctionnels
- ✅ Panneau admin opérationnel en local
- ✅ Sauvegarde complète en un clic ou automatique
- ✅ Le dossier entier peut être déplacé/copié pour cloner le système
- ✅ Intégration transparente avec le backend Express existant

## Maintenance

### Sauvegarde Régulière

Il est recommandé de créer des sauvegardes régulières :

```bash
# Sauvegarde quotidienne (à automatiser via cron)
pnpm run backup:create

# Nettoyer les sauvegardes (garder les 10 plus récentes)
node scripts/backup.js clean 10
```

### Migration de Base de Données

Pour ajouter de nouvelles tables ou colonnes :

1. Créer un fichier SQL dans `database/migrations/`
2. Exécuter `pnpm run db:migrate`

## Support

Pour toute question ou problème, consulter :

- `docs/backend-cold-guide.md` - Guide d'utilisation
- `docs/backend-cold-api.md` - Documentation API détaillée
