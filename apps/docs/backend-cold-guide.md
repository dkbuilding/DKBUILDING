# Backend Cold DK BUILDING - Guide d'Utilisation

## Introduction

Ce guide vous accompagne dans l'utilisation du panneau d'administration du Backend Cold DK BUILDING pour gérer vos annonces et projets.

## Premiers Pas

### 1. Accès au Panneau Admin

1. Démarrez le backend et le frontend
2. Obtenez un token JWT via l'endpoint `/api/auth/health`
3. Accédez à `http://localhost:5173/admin`
4. Le token est automatiquement vérifié

### 2. Navigation

Le panneau admin est organisé en sections :

- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Annonces** : Gestion des annonces/actualités
- **Projets** : Gestion des projets/réalisations
- **Médias** : Gestionnaire de fichiers
- **Paramètres** : Configuration (à venir)

## Gestion des Annonces

### Créer une Annonce

1. Cliquez sur "Annonces" dans le menu
2. Cliquez sur "Nouvelle annonce"
3. Remplissez le formulaire :
   - **Titre** : Obligatoire
   - **Description** : Résumé court
   - **Contenu** : Contenu détaillé (markdown supporté)
   - **Catégorie** : Actualité, Offre, ou Événement
   - **Statut** : Brouillon, Publié, ou Archivé
4. Cliquez sur "Créer"

### Modifier une Annonce

1. Trouvez l'annonce dans la liste
2. Cliquez sur l'icône "Modifier" (crayon)
3. Modifiez les champs souhaités
4. Cliquez sur "Mettre à jour"

### Supprimer une Annonce

1. Trouvez l'annonce dans la liste
2. Cliquez sur l'icône "Supprimer" (poubelle)
3. Confirmez la suppression

### Upload de Fichiers

L'upload de fichiers pour les annonces sera disponible dans une version future. Pour l'instant, utilisez l'API directement ou le gestionnaire de médias.

## Gestion des Projets

### Créer un Projet

1. Cliquez sur "Projets" dans le menu
2. Cliquez sur "Nouveau projet"
3. Remplissez le formulaire :
   - **Titre** : Obligatoire
   - **Description** : Résumé court
   - **Type de projet** : Charpente, Bardage, Couverture, etc.
   - **Client** : Nom du client (optionnel)
   - **Lieu** : Localisation (optionnel)
   - **Statut** : En cours, Terminé, ou Archivé
   - **Mis en avant** : Cocher pour mettre en avant sur le site
4. Cliquez sur "Créer"

### Mettre un Projet en Avant

1. Modifiez le projet
2. Cochez la case "Mettre en avant"
3. Sauvegardez

Les projets mis en avant apparaîtront sur la page d'accueil du site.

## Gestion des Médias

### Uploader un Fichier

1. Cliquez sur "Médias" dans le menu
2. Glissez-déposez des fichiers dans la zone d'upload, ou cliquez pour sélectionner
3. Types acceptés :
   - Images : jpg, jpeg, png, webp
   - Documents : pdf, doc, docx
   - Vidéos : mp4, mov
4. Taille max : 8 MB par fichier

### Supprimer un Fichier

1. Trouvez le fichier dans la grille
2. Cliquez sur l'icône "Supprimer" (poubelle)
3. Confirmez la suppression

### Télécharger un Fichier

1. Trouvez le fichier dans la grille
2. Cliquez sur l'icône "Télécharger" (flèche vers le bas)
3. Le fichier s'ouvre dans un nouvel onglet

## Sauvegardes

### Créer une Sauvegarde

Via l'API :

```bash
POST /api/admin/backup
Authorization: Bearer [token]
```

Via le script :

```bash
cd apps/backend
pnpm run backup:create
```

### Lister les Sauvegardes

Via l'API :

```bash
GET /api/admin/backup/list
Authorization: Bearer [token]
```

Via le script :

```bash
cd apps/backend
node scripts/backup.js list
```

### Nettoyer les Anciennes Sauvegardes

```bash
cd apps/backend
node scripts/backup.js clean 10
```

Garde les 10 sauvegardes les plus récentes et supprime les autres.

## Bonnes Pratiques

### Organisation des Fichiers

- Utilisez des noms de fichiers descriptifs
- Organisez les fichiers par type (images, documents, vidéos)
- Ne dépassez pas 8 MB par fichier

### Gestion du Contenu

- Utilisez le statut "Brouillon" pour travailler sur vos contenus
- Passez en "Publié" uniquement quand le contenu est prêt
- Archivez les anciens contenus au lieu de les supprimer

### Sauvegardes

- Créez une sauvegarde avant toute modification importante
- Automatisez les sauvegardes quotidiennes
- Gardez au moins 10 sauvegardes récentes

## Dépannage

### Le panneau admin ne se charge pas

1. Vérifiez que le backend est démarré (port 3001)
2. Vérifiez que vous avez un token JWT valide
3. Vérifiez la console du navigateur pour les erreurs

### Les fichiers ne s'uploadent pas

1. Vérifiez la taille du fichier (max 8 MB)
2. Vérifiez le type de fichier (formats acceptés uniquement)
3. Vérifiez les permissions du dossier `storage/`

### La base de données ne se charge pas

1. Exécutez `pnpm run db:init` pour initialiser
2. Vérifiez que le fichier `data/dkbuilding.db` existe
3. Vérifiez les permissions du fichier

## Support

Pour plus d'informations :

- Consultez `backend-cold-specification.md` pour les détails techniques
- Consultez `backend-cold-api.md` pour la documentation API complète
