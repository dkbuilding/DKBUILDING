# Backend Cold DK BUILDING - Documentation API

## Base URL

```
http://localhost:3001
```

## Authentification

Toutes les routes protégées nécessitent un token JWT dans l'en-tête :

```
Authorization: Bearer [token]
```

## Endpoints

### Annonces

#### GET /api/annonces

Liste toutes les annonces (protégé).

**Query Parameters :**
- `statut` : Filtre par statut (brouillon, publie, archive)
- `categorie` : Filtre par catégorie (actualite, offre, evenement)
- `limit` : Nombre de résultats (défaut: 50)
- `offset` : Décalage pour pagination (défaut: 0)
- `orderBy` : Tri par (date_publication, created_at, vue_count)
- `order` : Ordre (ASC, DESC)

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titre": "Titre de l'annonce",
      "description": "Description",
      "statut": "publie",
      "images": [],
      "documents": []
    }
  ],
  "count": 1
}
```

#### GET /api/annonces/:id

Récupère une annonce par ID (protégé).

#### GET /api/annonces/slug/:slug

Récupère une annonce par slug (public).

#### GET /api/annonces/public

Liste les annonces publiques (public).

**Query Parameters :**
- `limit` : Nombre de résultats (défaut: 10)
- `offset` : Décalage pour pagination (défaut: 0)

#### POST /api/annonces

Crée une annonce (protégé, multipart).

**Body (multipart/form-data) :**
- `titre` : string (requis)
- `description` : string
- `contenu` : string
- `categorie` : string (actualite, offre, evenement)
- `statut` : string (brouillon, publie, archive)
- `images` : File[] (optionnel)
- `documents` : File[] (optionnel)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "titre-de-l-annonce",
    "titre": "Titre de l'annonce"
  },
  "message": "Annonce créée avec succès"
}
```

#### PUT /api/annonces/:id

Met à jour une annonce (protégé, multipart).

**Body :** Même format que POST

#### DELETE /api/annonces/:id

Supprime une annonce (protégé).

### Projets

#### GET /api/projets

Liste tous les projets (protégé).

**Query Parameters :**
- `statut` : Filtre par statut (en_cours, termine, archive)
- `type_projet` : Filtre par type
- `featured` : Filtre par mis en avant (true/false)
- `limit` : Nombre de résultats (défaut: 50)
- `offset` : Décalage pour pagination (défaut: 0)
- `orderBy` : Tri par (date_debut, date_fin, created_at, vue_count)
- `order` : Ordre (ASC, DESC)

#### GET /api/projets/:id

Récupère un projet par ID (protégé).

#### GET /api/projets/slug/:slug

Récupère un projet par slug (public).

#### GET /api/projets/featured

Liste les projets mis en avant (public).

**Query Parameters :**
- `limit` : Nombre de résultats (défaut: 6)

#### GET /api/projets/public

Liste les projets publics (public).

#### POST /api/projets

Crée un projet (protégé, multipart).

**Body (multipart/form-data) :**
- `titre` : string (requis)
- `description` : string
- `contenu` : string
- `type_projet` : string
- `client` : string
- `lieu` : string
- `statut` : string (en_cours, termine, archive)
- `featured` : boolean
- `images` : File[] (optionnel)
- `documents` : File[] (optionnel)
- `videos` : File[] (optionnel)

#### PUT /api/projets/:id

Met à jour un projet (protégé, multipart).

#### DELETE /api/projets/:id

Supprime un projet (protégé).

### Médias

#### GET /api/media/:filename

Sert un fichier (public).

#### GET /api/media/list

Liste tous les médias (protégé).

**Réponse :**
```json
{
  "success": true,
  "data": [
    {
      "filename": "images/annonces/file-123.jpg",
      "name": "file-123.jpg",
      "size": 1024000,
      "sizeFormatted": "1 MB",
      "type": "image",
      "extension": ".jpg"
    }
  ],
  "count": 1
}
```

#### POST /api/media/upload

Upload un fichier (protégé, multipart).

**Body (multipart/form-data) :**
- `file` : File (requis)

**Réponse :**
```json
{
  "success": true,
  "data": {
    "filename": "images/annonces/file-123.jpg",
    "originalName": "photo.jpg",
    "size": 1024000,
    "mimetype": "image/jpeg"
  },
  "message": "Fichier uploadé avec succès"
}
```

#### DELETE /api/media/:filename

Supprime un fichier (protégé).

### Admin

#### GET /api/admin/stats

Récupère les statistiques (protégé).

**Réponse :**
```json
{
  "success": true,
  "data": {
    "annonces": {
      "total": 10,
      "publiees": 5,
      "brouillon": 3
    },
    "projets": {
      "total": 20,
      "termines": 15,
      "en_cours": 3,
      "featured": 2
    },
    "medias": {
      "total": 50,
      "totalSize": 104857600,
      "totalSizeFormatted": "100 MB"
    },
    "logs": {
      "total": 100,
      "recent": 10
    }
  }
}
```

#### GET /api/admin/logs

Récupère les logs récents (protégé).

**Query Parameters :**
- `limit` : Nombre de résultats (défaut: 50)
- `offset` : Décalage pour pagination (défaut: 0)

#### POST /api/admin/backup

Crée une sauvegarde (protégé).

**Réponse :**
```json
{
  "success": true,
  "data": {
    "filename": "dkbuilding-backup-2025-01-25T10-30-00.zip",
    "path": "/path/to/backup.zip",
    "size": 10485760,
    "sizeFormatted": "10 MB"
  },
  "message": "Sauvegarde créée avec succès"
}
```

#### GET /api/admin/backup/list

Liste les sauvegardes (protégé).

#### DELETE /api/admin/backup/:filename

Supprime une sauvegarde (protégé).

#### POST /api/admin/backup/clean

Nettoie les anciennes sauvegardes (protégé).

**Body :**
```json
{
  "keepCount": 10
}
```

## Codes d'Erreur

- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Non autorisé
- `404` : Ressource non trouvée
- `500` : Erreur serveur

## Exemples

### Créer une annonce avec cURL

```bash
curl -X POST http://localhost:3001/api/annonces \
  -H "Authorization: Bearer [token]" \
  -F "titre=Nouvelle annonce" \
  -F "description=Description" \
  -F "statut=publie" \
  -F "categorie=actualite"
```

### Uploader un fichier

```bash
curl -X POST http://localhost:3001/api/media/upload \
  -H "Authorization: Bearer [token]" \
  -F "file=@/path/to/image.jpg"
```

