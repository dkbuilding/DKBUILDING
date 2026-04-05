# API REST DK BUILDING - Reference complete

Documentation de reference de l'API backend DK BUILDING.

## Table des matieres

- [Informations generales](#informations-generales)
- [Authentification](#authentification)
- [Contact](#contact)
- [Actualites (News)](#actualites-news)
- [Annonces](#annonces)
- [Projets](#projets)
- [Medias](#medias)
- [Administration](#administration)
- [Authentification JWT](#authentification-jwt)
- [LockAccess](#lockaccess)
- [Health Check](#health-check)
- [Codes d'erreur](#codes-derreur)
- [Securite](#securite)

## Informations generales

**Base URL** : `http://localhost:3001` (developpement) | `https://api.dkbuilding.fr` (production)

**Format des reponses** : JSON. Toutes les reponses suivent cette structure :

```json
{
  "success": true,
  "data": {},
  "message": "Description de l'action realisee",
  "count": 10
}
```

En cas d'erreur :

```json
{
  "success": false,
  "error": "Description de l'erreur",
  "message": "Detail supplementaire (dev uniquement)",
  "details": {}
}
```

**Pagination** : Les endpoints de liste acceptent `limit` et `offset` en query parameters.

**Rate Limiting** :
- Routes publiques : 100 requetes / 15 minutes par IP
- Routes admin : 50 requetes / 15 minutes par IP (echecs uniquement)
- Routes d'authentification : 5 tentatives / 15 minutes par IP (echecs uniquement)

## Authentification

Les routes protegees acceptent le token JWT de deux manieres :

1. **Cookie HttpOnly** (recommande) : Cookie `jwt_token` positionne automatiquement lors de l'authentification
2. **Header Authorization** : `Authorization: Bearer <token>`

Le token expire apres 30 minutes. Utiliser `/api/auth/refresh` pour le renouveler.

---

## Contact

### POST /api/contact

Envoie une demande de devis. Declenche l'envoi de deux emails : un au gerant et un de confirmation au client.

**Acces** : Public

**Body (JSON)** :

| Champ           | Type   | Requis | Validation                                             |
|-----------------|--------|--------|--------------------------------------------------------|
| `projectType`   | string | oui    | `charpente`, `bardage`, `couverture`, `mixte`          |
| `name`          | string | oui    | 2 a 100 caracteres                                     |
| `email`         | string | oui    | Format email valide                                    |
| `phone`         | string | oui    | Format francais : `+33XXXXXXXXX` ou `0XXXXXXXXX`      |
| `location`      | string | non    | Max 200 caracteres                                     |
| `surface`       | number | non    | Valeur numerique                                       |
| `deadline`      | string | non    | `urgent`, `1-3mois`, `3-6mois`, `6mois+`              |
| `projectDetails`| string | non    | Max 2000 caracteres                                    |
| `message`       | string | non    | Max 1000 caracteres                                    |

**Exemple curl** :

```bash
curl -X POST http://localhost:3001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "projectType": "charpente",
    "name": "Jean Dupont",
    "email": "jean.dupont@exemple.fr",
    "phone": "+33612345678",
    "location": "Albi, Tarn",
    "surface": 200,
    "deadline": "3-6mois",
    "projectDetails": "Construction hangar agricole 200m2",
    "message": "Disponible en semaine pour un rendez-vous"
  }'
```

**Reponse 200** :

```json
{
  "success": true,
  "message": "Votre demande a ete envoyee avec succes. Nous vous contacterons dans les plus brefs delais.",
  "messageId": "re_abc123"
}
```

**Erreurs possibles** :
- `400` : Donnees de validation invalides (detail dans `details`)
- `500` : Erreur d'envoi d'email

### GET /api/status

Verifie le statut de l'API et du service email.

**Acces** : Public

**Reponse 200** :

```json
{
  "status": "OK",
  "service": "Contact API",
  "version": "latest",
  "emailConfigured": true,
  "timestamp": "2026-04-05T10:30:00.000Z"
}
```

### POST /api/report-validation-error

Signale une erreur de validation cote frontend (logging).

**Acces** : Public

**Body (JSON)** :

| Champ       | Type   | Description                        |
|-------------|--------|------------------------------------|
| `field`     | string | Nom du champ en erreur             |
| `error`     | string | Message d'erreur                   |
| `formData`  | object | Donnees du formulaire (optionnel)  |
| `userAgent` | string | User-Agent du navigateur           |
| `url`       | string | URL de la page                     |

---

## Actualites (News)

### GET /api/news

Liste toutes les annonces publiees, formatees en articles d'actualite.

**Acces** : Public

**Reponse 200** :

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Titre de l'article",
      "excerpt": "Extrait de 150 caracteres...",
      "content": "Contenu complet",
      "date": "2026-04-01T10:00:00.000Z",
      "category": "Actualite",
      "readTime": "3 min",
      "image": "/api/media/image-id",
      "featured": false,
      "isPublished": true
    }
  ],
  "count": 5
}
```

### GET /api/news/:id

Recupere un article par son ID.

**Acces** : Public

**Parametres URL** : `id` (entier)

**Erreurs possibles** :
- `400` : ID invalide (non numerique)
- `404` : Article non trouve ou non publie

---

## Annonces

### GET /api/annonces/public

Liste les annonces publiees.

**Acces** : Public

**Query Parameters** :

| Parametre | Type   | Defaut | Description          |
|-----------|--------|--------|----------------------|
| `limit`   | number | 10     | Resultats par page (max 50) |
| `offset`  | number | 0      | Decalage pour pagination    |

### GET /api/annonces/slug/:slug

Recupere une annonce par son slug. Incremente le compteur de vues.

**Acces** : Public

### GET /api/annonces

Liste toutes les annonces avec filtres avances.

**Acces** : Protege (JWT)

**Query Parameters** :

| Parametre   | Type   | Defaut            | Description                              |
|-------------|--------|-------------------|------------------------------------------|
| `statut`    | string | _(tous)_          | `brouillon`, `publie`, `archive`         |
| `categorie` | string | _(toutes)_        | Filtre par categorie                     |
| `auteur_id` | string | _(tous)_          | Filtre par auteur                        |
| `orderBy`   | string | `date_publication`| `date_publication`, `created_at`, `vue_count`, `titre` |
| `order`     | string | `DESC`            | `ASC`, `DESC`                            |
| `limit`     | number | 50                | Resultats par page (max 100)             |
| `offset`    | number | 0                 | Decalage pour pagination                 |

**Reponse 200** :

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "titre": "Titre de l'annonce",
      "description": "Description courte",
      "contenu": "Contenu HTML complet",
      "categorie": "actualite",
      "statut": "publie",
      "slug": "titre-de-l-annonce",
      "images": ["cloudinary-url-1", "cloudinary-url-2"],
      "documents": [],
      "meta_keywords": "mots-cles",
      "meta_description": "Description SEO",
      "vue_count": 42,
      "date_publication": "2026-04-01T10:00:00.000Z",
      "created_at": "2026-03-15T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

### GET /api/annonces/:id

Recupere une annonce par son ID.

**Acces** : Protege (JWT)

### POST /api/annonces

Cree une nouvelle annonce avec upload de fichiers vers Cloudinary.

**Acces** : Protege (JWT + role admin)

**Body (multipart/form-data)** :

| Champ              | Type     | Requis | Validation                               |
|--------------------|----------|--------|------------------------------------------|
| `titre`            | string   | oui    | 3 a 255 caracteres                       |
| `description`      | string   | non    | Texte libre                              |
| `contenu`          | string   | non    | HTML ou texte                            |
| `categorie`        | string   | non    | Categorie libre                          |
| `statut`           | string   | non    | `brouillon` (defaut), `publie`, `archive`|
| `meta_keywords`    | string   | non    | Mots-cles SEO                            |
| `meta_description` | string   | non    | Description SEO                          |
| `images`           | File[]   | non    | Max 10 fichiers (jpg, png, webp)         |
| `documents`        | File[]   | non    | Max 10 fichiers (pdf, doc, docx)         |

**Exemple curl** :

```bash
curl -X POST http://localhost:3001/api/annonces \
  -H "Authorization: Bearer <token>" \
  -F "titre=Nouveau chantier a Albi" \
  -F "description=Chantier de charpente metallique" \
  -F "statut=publie" \
  -F "categorie=actualite" \
  -F "images=@/chemin/vers/photo.jpg"
```

**Reponse 201** :

```json
{
  "success": true,
  "data": {
    "id": 5,
    "slug": "nouveau-chantier-a-albi",
    "titre": "Nouveau chantier a Albi"
  },
  "message": "Annonce creee avec succes"
}
```

### PUT /api/annonces/:id

Met a jour une annonce existante. Seuls les champs fournis sont modifies (COALESCE).

**Acces** : Protege (JWT + role admin)

**Body** : Meme format que POST (tous les champs optionnels)

### DELETE /api/annonces/:id

Supprime une annonce.

**Acces** : Protege (JWT + role admin)

**Reponse 200** :

```json
{
  "success": true,
  "message": "Annonce supprimee"
}
```

---

## Projets

### GET /api/projets/public

Liste les projets termines.

**Acces** : Public

**Query Parameters** :

| Parametre | Type   | Defaut | Description                 |
|-----------|--------|--------|-----------------------------|
| `limit`   | number | 20     | Resultats par page (max 50) |
| `offset`  | number | 0      | Decalage pour pagination    |

### GET /api/projets/featured

Liste les projets mis en avant (featured + termines).

**Acces** : Public

**Query Parameters** :

| Parametre | Type   | Defaut | Description                 |
|-----------|--------|--------|-----------------------------|
| `limit`   | number | 6      | Resultats par page (max 20) |

### GET /api/projets/slug/:slug

Recupere un projet par son slug. Incremente le compteur de vues.

**Acces** : Public

### GET /api/projets

Liste tous les projets avec filtres avances.

**Acces** : Protege (JWT)

**Query Parameters** :

| Parametre     | Type   | Defaut       | Description                                              |
|---------------|--------|--------------|----------------------------------------------------------|
| `statut`      | string | _(tous)_     | `en_cours`, `termine`, `annule`                          |
| `type_projet` | string | _(tous)_     | Filtre par type de projet                                |
| `featured`    | string | _(tous)_     | `true`, `false`                                          |
| `orderBy`     | string | `created_at` | `date_debut`, `date_fin`, `created_at`, `vue_count`, `titre` |
| `order`       | string | `DESC`       | `ASC`, `DESC`                                            |
| `limit`       | number | 50           | Resultats par page (max 100)                             |
| `offset`      | number | 0            | Decalage pour pagination                                 |

### GET /api/projets/:id

Recupere un projet par son ID.

**Acces** : Protege (JWT)

### POST /api/projets

Cree un nouveau projet avec upload de fichiers vers Cloudinary.

**Acces** : Protege (JWT + role admin)

**Body (multipart/form-data)** :

| Champ              | Type     | Requis | Validation                               |
|--------------------|----------|--------|------------------------------------------|
| `titre`            | string   | oui    | 3 a 255 caracteres                       |
| `description`      | string   | non    | Texte libre                              |
| `contenu`          | string   | non    | HTML ou texte                            |
| `type_projet`      | string   | non    | Type libre (charpente, bardage, etc.)    |
| `client`           | string   | non    | Nom du client                            |
| `lieu`             | string   | non    | Localisation du chantier                 |
| `date_debut`       | string   | non    | Format ISO 8601                          |
| `date_fin`         | string   | non    | Format ISO 8601                          |
| `statut`           | string   | non    | `en_cours` (defaut), `termine`, `annule` |
| `featured`         | boolean  | non    | Mise en avant sur la page d'accueil      |
| `meta_keywords`    | string   | non    | Mots-cles SEO                            |
| `meta_description` | string   | non    | Description SEO                          |
| `images`           | File[]   | non    | Max 10 fichiers                          |
| `documents`        | File[]   | non    | Max 10 fichiers                          |
| `videos`           | File[]   | non    | Max 5 fichiers (mp4, mov)               |

**Exemple curl** :

```bash
curl -X POST http://localhost:3001/api/projets \
  -H "Authorization: Bearer <token>" \
  -F "titre=Hangar industriel Castres" \
  -F "type_projet=charpente" \
  -F "client=Entreprise ABC" \
  -F "lieu=Castres, Tarn" \
  -F "statut=en_cours" \
  -F "featured=true" \
  -F "images=@/chemin/vers/photo1.jpg" \
  -F "images=@/chemin/vers/photo2.jpg"
```

**Reponse 201** :

```json
{
  "success": true,
  "data": {
    "id": 12,
    "slug": "hangar-industriel-castres",
    "titre": "Hangar industriel Castres"
  },
  "message": "Projet cree avec succes"
}
```

### PUT /api/projets/:id

Met a jour un projet existant.

**Acces** : Protege (JWT + role admin)

### DELETE /api/projets/:id

Supprime un projet.

**Acces** : Protege (JWT + role admin)

---

## Medias

### GET /api/media/:filename

Redirige vers l'URL Cloudinary du fichier demande.

**Acces** : Public

### GET /api/media

Liste tous les medias stockes dans le dossier `dkbuilding/` de Cloudinary.

**Acces** : Protege (JWT)

**Reponse 200** :

```json
{
  "success": true,
  "data": [
    {
      "filename": "dkbuilding/images/abc123",
      "url": "https://res.cloudinary.com/.../abc123.jpg",
      "name": "abc123.jpg",
      "size": 1048576,
      "sizeFormatted": "1 MB",
      "type": "image",
      "extension": ".jpg",
      "created": "2026-03-15T08:00:00.000Z",
      "modified": "2026-03-15T08:00:00.000Z"
    }
  ],
  "count": 25
}
```

### POST /api/media/upload

Upload un fichier vers Cloudinary.

**Acces** : Protege (JWT)

**Body (multipart/form-data)** :

| Champ  | Type | Requis | Validation                                         |
|--------|------|--------|----------------------------------------------------|
| `file` | File | oui    | Max 50 Mo. Formats : jpg, png, webp, pdf, doc, docx, mp4, mov |

**Exemple curl** :

```bash
curl -X POST http://localhost:3001/api/media/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@/chemin/vers/photo.jpg"
```

**Reponse 200** :

```json
{
  "success": true,
  "data": {
    "filename": "dkbuilding/abc123",
    "url": "https://res.cloudinary.com/.../abc123.jpg",
    "originalName": "photo.jpg",
    "size": 1048576,
    "mimetype": "image/jpeg"
  },
  "message": "Fichier uploade avec succes sur Cloudinary"
}
```

### DELETE /api/media/:filename

Supprime un fichier de Cloudinary (tente la suppression pour les trois types : image, video, raw).

**Acces** : Protege (JWT)

---

## Administration

Toutes les routes admin sont protegees par un guard multi-couches :
1. Rate limiting strict (50 req/15 min)
2. IP whitelisting (production uniquement)
3. Authentification JWT
4. Verification du role admin

### GET /api/admin/stats

Recupere les statistiques globales du dashboard.

**Acces** : Protege (admin guard)

**Reponse 200** :

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

### GET /api/admin/logs

Recupere les logs d'audit.

**Acces** : Protege (admin guard)

**Query Parameters** :

| Parametre | Type   | Defaut | Description                  |
|-----------|--------|--------|------------------------------|
| `limit`   | number | 50     | Resultats par page (max 200) |
| `offset`  | number | 0      | Decalage pour pagination     |

### POST /api/admin/backup

Cree une sauvegarde de la base de donnees.

**Acces** : Protege (admin guard)

### GET /api/admin/backup/list

Liste les sauvegardes existantes.

**Acces** : Protege (admin guard)

### DELETE /api/admin/backup/:filename

Supprime une sauvegarde specifique.

**Acces** : Protege (admin guard)

### POST /api/admin/backup/clean

Nettoie les anciennes sauvegardes en gardant les N plus recentes.

**Acces** : Protege (admin guard)

**Body (JSON)** :

| Champ       | Type   | Defaut | Description                           |
|-------------|--------|--------|---------------------------------------|
| `keepCount` | number | 10     | Nombre de sauvegardes a conserver     |

---

## Authentification JWT

### POST /api/auth/health

Authentification pour le health monitoring. Le token est stocke dans un cookie HttpOnly securise.

**Acces** : Public (rate-limited a 5 tentatives)

**Body (JSON)** :

| Champ      | Type   | Requis | Validation         |
|------------|--------|--------|--------------------|
| `password` | string | oui    | Minimum 8 caracteres |

**Reponse 200** :

```json
{
  "success": true,
  "expires_in": "30m",
  "permissions": ["health:read", "health:monitor"],
  "security_level": "NSA_128_BITS",
  "message": "Authentification reussie"
}
```

**Erreurs possibles** :
- `400` : Mot de passe manquant ou trop court
- `401` : Mot de passe incorrect

### POST /api/auth/verify

Verifie la validite d'un token JWT.

**Acces** : Protege (JWT)

**Reponse 200** :

```json
{
  "valid": true,
  "user": {
    "id": "health-monitoring",
    "issuer": "dk-building-security",
    "security_level": "NSA_128_BITS",
    "issued_at": "2026-04-05T10:00:00.000Z",
    "expires_at": "2026-04-05T10:30:00.000Z"
  },
  "message": "Token valide"
}
```

### POST /api/auth/refresh

Renouvelle un token JWT existant. Le nouveau token remplace le cookie.

**Acces** : Protege (JWT)

### POST /api/auth/logout

Supprime le cookie JWT.

**Acces** : Public

### GET /api/auth/status

Statut du systeme d'authentification.

**Acces** : Public

---

## LockAccess

Systeme de controle d'acces au site (maintenance, verrouillage, blocage IP).

### GET /api/lockaccess/config

Recupere la configuration actuelle du systeme LockAccess.

**Acces** : Public

### GET /api/lockaccess/check-access

Verifie si l'IP du client est autorisee a acceder au site.

**Acces** : Public

**Reponse 200** :

```json
{
  "success": true,
  "data": {
    "clientIP": "::1",
    "isAllowed": true,
    "isBlocked": false,
    "isLocked": false,
    "isMaintenance": false,
    "screenType": "none",
    "lockaccessEnabled": true,
    "timestamp": "2026-04-05T10:30:00.000Z"
  }
}
```

Les valeurs possibles de `screenType` : `none`, `maintenance`, `locked`, `ip-blocked`.

### GET /api/lockaccess/status

Statut detaille du systeme LockAccess (systeme, acces, securite).

**Acces** : Public

### PUT /api/lockaccess/config

Met a jour la configuration LockAccess.

**Acces** : Protege (JWT)

**Body (JSON)** :

| Champ             | Type           | Description                        |
|-------------------|----------------|------------------------------------|
| `enabled`         | boolean        | Activer/desactiver le systeme      |
| `locked`          | boolean        | Verrouiller l'acces au site        |
| `maintenanceMode` | boolean        | Activer le mode maintenance        |
| `allowedIPs`      | string[]       | Liste des IP autorisees            |
| `blockedIPs`      | string[]       | Liste des IP bloquees              |

---

## Health Check

### GET /health

Retourne l'etat de sante du serveur avec le temps de fonctionnement et le statut des services.

**Acces** : Protege (JWT)

**Reponse 200** :

```json
{
  "status": "OK",
  "timestamp": "2026-04-05T10:30:00.000Z",
  "uptime": {
    "seconds": "3600s",
    "human": "1h 0m 0s"
  },
  "services": {
    "email": "Configured"
  }
}
```

---

## Codes d'erreur

| Code | Signification          | Contexte typique                                    |
|------|------------------------|-----------------------------------------------------|
| 400  | Requete invalide       | Validation echouee, JSON malforme, ID non numerique |
| 401  | Non authentifie        | Token manquant, expire, ou invalide                 |
| 403  | Non autorise           | Permissions insuffisantes, role inadequat            |
| 404  | Ressource non trouvee  | ID ou slug inexistant, route inconnue               |
| 429  | Trop de requetes       | Rate limit atteint                                  |
| 500  | Erreur serveur interne | Erreur base de donnees, service externe indisponible|

### Codes d'erreur JWT specifiques

| Code technique            | Description                                |
|---------------------------|--------------------------------------------|
| `MISSING_TOKEN`           | Aucun token fourni                         |
| `TOKEN_EXPIRED`           | Token expire                               |
| `INVALID_TOKEN`           | Token malformed ou signature invalide      |
| `SECURITY_CONFIG_ERROR`   | Configuration JWT manquante sur le serveur |
| `SECURITY_INTEGRITY_ERROR`| Integrite de la configuration compromise   |
| `INVALID_SECURITY_TOKEN`  | Metadonnees de securite invalides          |
| `MISSING_PASSWORD`        | Mot de passe non fourni                    |
| `PASSWORD_TOO_SHORT`      | Mot de passe < 8 caracteres               |
| `INVALID_PASSWORD`        | Mot de passe incorrect                     |
| `INSUFFICIENT_PERMISSIONS`| Permissions insuffisantes                  |

## Securite

### Couches de protection

1. **Helmet** : En-tetes HTTP securises (CSP, HSTS, Referrer-Policy)
2. **CORS** : Origines autorisees explicitement
3. **Rate Limiting** : Protection contre les abus (3 niveaux)
4. **Sanitization** : Nettoyage XSS sur toutes les entrees (body, query, params)
5. **JWT HS512** : Authentification avec algorithme cryptographique fort
6. **Cookie HttpOnly** : Token non accessible depuis JavaScript
7. **Admin Guard** : Multi-couches (rate limit + IP whitelist + JWT + role check)
8. **Validation Zod** : Validation stricte des donnees entrantes

### Formats de fichiers acceptes

| Type     | Formats                          | Taille max |
|----------|----------------------------------|------------|
| Images   | jpg, jpeg, png, webp             | 50 Mo      |
| Documents| pdf, doc, docx                   | 50 Mo      |
| Videos   | mp4, mov                         | 50 Mo      |

---

**Derniere mise a jour** : 5 avril 2026
