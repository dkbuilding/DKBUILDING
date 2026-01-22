# Guide du Dashboard Administrateur - admin.dkbuilding.fr

## Accès au Dashboard

### URL

- **Production** : `https://admin.dkbuilding.fr`
- **Développement** : `http://localhost:5173/admin`

### Authentification

1. Obtenir un token JWT via l'endpoint `/api/auth/health`
2. Le token est automatiquement stocké dans le navigateur
3. Accéder au dashboard admin

## Navigation

Le dashboard est organisé en sections accessibles via le menu latéral :

### Tableau de bord
Vue d'ensemble avec :
- Statistiques des annonces (total, publiées, brouillons)
- Statistiques des projets (total, terminés, en cours, mis en avant)
- Statistiques des médias (nombre, taille totale)
- Logs récents

### Annonces
Gestion complète des annonces/actualités :
- **Créer** : Formulaire intuitif avec upload d'images/documents
- **Modifier** : Édition en ligne avec prévisualisation Markdown
- **Supprimer** : Suppression avec confirmation
- **Rechercher** : Recherche en temps réel

### Projets
Gestion complète des projets/réalisations :
- **Créer** : Formulaire détaillé avec métadonnées
- **Modifier** : Édition complète
- **Mettre en avant** : Sélection des projets à afficher sur la page d'accueil
- **Upload** : Images, documents et vidéos

### Médias
Gestionnaire de fichiers :
- **Upload** : Drag & drop pour upload multiple
- **Visualisation** : Grille avec aperçus
- **Suppression** : Gestion des fichiers
- **Téléchargement** : Accès direct aux fichiers

### LockAccess
Gestion de la sécurité :
- **Activation/Désactivation** : Contrôle du système
- **Verrouillage** : Verrouillage global du site
- **Maintenance** : Mode maintenance
- **IPs** : Gestion des IPs autorisées/bloquées

## Fonctionnalités Avancées

### Éditeur Markdown

Le contenu des annonces et projets peut être formaté avec Markdown :

- **Gras** : `**texte**`
- **Italique** : `*texte*`
- **Liens** : `[texte](url)`
- **Listes** : `- item` ou `1. item`
- **Titres** : `# Titre`, `## Sous-titre`

Un bouton "Prévisualiser" permet de voir le rendu en temps réel.

### Upload de Fichiers

#### Images
- Formats : JPG, JPEG, PNG, WebP
- Taille max : 8 MB par fichier
- Drag & drop ou sélection

#### Documents
- Formats : PDF, DOC, DOCX
- Taille max : 8 MB par fichier
- Drag & drop ou sélection

#### Vidéos (Projets uniquement)
- Formats : MP4, MOV
- Taille max : 8 MB par fichier
- Drag & drop ou sélection

### Gestion LockAccess

#### Activation Rapide
Boutons de bascule rapide pour :
- Activer/désactiver le système
- Verrouiller/déverrouiller le site
- Activer/désactiver le mode maintenance

#### Configuration Avancée
- **IPs Autorisées** : Liste des IPs avec accès permanent
- **IPs Bloquées** : Liste des IPs toujours bloquées
- **Sauvegarde** : Enregistrement des paramètres

## Bonnes Pratiques

### Création de Contenu

1. **Titres clairs** : Utilisez des titres descriptifs
2. **Descriptions courtes** : Résumé en 1-2 phrases
3. **Contenu structuré** : Utilisez Markdown pour la mise en forme
4. **Images pertinentes** : Ajoutez des images de qualité
5. **Statut approprié** : Utilisez "Brouillon" pour travailler, "Publié" quand prêt

### Gestion de la Sécurité

1. **Vérification régulière** : Vérifiez le statut LockAccess
2. **IPs autorisées** : Ajoutez vos IPs de travail
3. **Mode maintenance** : Activez avant les mises à jour importantes
4. **Sauvegardes** : Créez des sauvegardes avant modifications

### Organisation des Médias

1. **Noms descriptifs** : Utilisez des noms de fichiers clairs
2. **Optimisation** : Compressez les images avant upload
3. **Suppression** : Supprimez les fichiers inutilisés régulièrement

## Dépannage

### Le dashboard ne se charge pas

1. Vérifiez que vous avez un token JWT valide
2. Vérifiez la console du navigateur pour les erreurs
3. Vérifiez que le backend est démarré

### Les fichiers ne s'uploadent pas

1. Vérifiez la taille (max 8 MB)
2. Vérifiez le format (formats acceptés uniquement)
3. Vérifiez les permissions du dossier `storage/`

### LockAccess ne fonctionne pas

1. Vérifiez la configuration dans le dashboard
2. Redémarrez le serveur après modification
3. Vérifiez les variables d'environnement

## Support

Pour plus d'informations :
- Consultez `admin-subdomain-configuration.md` pour la configuration du sous-domaine
- Consultez `backend-cold-guide.md` pour le guide complet du backend
- Consultez `backend-cold-api.md` pour la documentation API

