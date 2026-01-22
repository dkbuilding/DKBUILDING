# Intégration Cloudinary — DK BUILDING

**Date** : 2025-01-18  
**Objectif** : Intégrer Cloudinary pour remplacer le stockage backend par un stockage cloud direct depuis le frontend

---

## 📋 Informations de Votre Compte Cloudinary

D'après votre dashboard :

- **Cloud Name** : `dztbdnp3l`
- **Plan** : Free (25 crédits/mois)
- **Statut** : ✅ Compte actif et configuré

---

## 🔑 Obtenir les Clés API

### Étape 1 : Accéder aux Clés API

1. Dans votre dashboard Cloudinary : https://console.cloudinary.com/apps/c-d213c3d98398d7bb95a907c5908fc8/home/dashboard
2. Cliquez sur le bouton **"Go to API Keys"** (en haut à droite)
3. Ou allez directement dans **Settings** → **Security** → **API Keys**

### Étape 2 : Copier les Clés

Vous aurez besoin de :

- **Cloud Name** : `dztbdnp3l` (déjà visible)
- **API Key** : `xxxxxxxxxxxxx` (à copier)
- **API Secret** : `xxxxxxxxxxxxx` (à copier) ⚠️ **NE JAMAIS exposer dans le frontend**

### ⚠️ Sécurité Importante

**API Secret** : ⚠️ **NE JAMAIS** utiliser dans le frontend !  
**Solution** : Utiliser **Upload Presets** (signature côté serveur) ou **Unsigned Upload** (pour uploads publics)

---

## 🚀 Configuration Frontend-Only (Recommandé)

### Option 1 : Upload Presets (Sécurisé)

1. **Créer un Upload Preset** :
   - Dashboard → **Settings** → **Upload** → **Upload presets**
   - Cliquez sur **"Add upload preset"**
   - Nom : `dkbuilding-unsigned` (ou autre)
   - **Signing mode** : `Unsigned` (pour uploads depuis frontend)
   - **Folder** : `dkbuilding/` (optionnel, pour organiser)
   - **Allowed formats** : `jpg, png, webp, pdf, mp4, mov` (selon vos besoins)
   - **Max file size** : `10 MB` (ou plus selon votre plan)
   - Cliquez sur **"Save"**

2. **Utiliser le Preset dans le frontend** :
   - Pas besoin de clé API secrète
   - Upload direct depuis le navigateur
   - Sécurisé via le preset

### Option 2 : Upload Signé (Plus Sécurisé)

Pour les uploads signés, vous aurez besoin d'une fonction serverless (Vercel Functions, Netlify Functions, etc.) pour générer la signature.

---

## 📦 Installation

### 1. Installer le SDK Cloudinary

```bash
cd Site\ Web/apps/frontend
pnpm add cloudinary
```

### 2. Créer un Utilitaire Cloudinary

Créer `src/utils/cloudinary.js` (voir fichier ci-dessous)

### 3. Configurer les Variables d'Environnement

Créer ou mettre à jour `.env` dans `Site Web/apps/frontend/` :

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=dztbdnp3l
CLOUDINARY_API_KEY=votre_api_key_ici
CLOUDINARY_UPLOAD_PRESET=dkbuilding-unsigned
CLOUDINARY_FOLDER=dkbuilding
```

⚠️ **Note** : En production, ces variables seront exposées dans le frontend. C'est normal pour les uploads unsigned.

---

## 🔧 Utilisation dans les Composants

### Exemple : MediaManager avec Cloudinary

```javascript
import { uploadToCloudinary, deleteFromCloudinary } from "@/utils/cloudinary";

// Upload
const handleUpload = async (file) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: "dkbuilding/media",
      resourceType: "auto", // auto-détecte image/video/raw
    });

    console.log("URL Cloudinary:", result.secure_url);
    toast.success("Fichier uploadé avec succès");
  } catch (error) {
    toast.error("Erreur lors de l'upload");
  }
};

// Suppression
const handleDelete = async (publicId) => {
  try {
    await deleteFromCloudinary(publicId);
    toast.success("Fichier supprimé");
  } catch (error) {
    toast.error("Erreur lors de la suppression");
  }
};
```

---

## 📊 Avantages de Cloudinary

### ✅ Avantages

- ✅ **Upload direct** depuis le frontend (pas de backend nécessaire)
- ✅ **Transformations automatiques** (redimensionnement, optimisation)
- ✅ **CDN global** (performance maximale)
- ✅ **Optimisation automatique** (WebP, formats modernes)
- ✅ **Responsive images** (srcset automatique)
- ✅ **Lazy loading** intégré
- ✅ **25 GB gratuit** (plan Free)

### 📈 Transformations Disponibles

```javascript
// Exemple d'URL avec transformations
const optimizedUrl = `https://res.cloudinary.com/dztbdnp3l/image/upload/w_800,h_600,c_fill,q_auto,f_auto/dkbuilding/image.jpg`;

// Paramètres :
// - w_800 : largeur 800px
// - h_600 : hauteur 600px
// - c_fill : crop fill
// - q_auto : qualité automatique
// - f_auto : format automatique (WebP si supporté)
```

---

## 🔄 Migration depuis le Backend

### Avant (Backend)

```javascript
// Upload via backend
const formData = new FormData();
formData.append("file", file);
const response = await fetch(`${API_BASE_URL}/api/media/upload`, {
  method: "POST",
  body: formData,
});
```

### Après (Cloudinary Direct)

```javascript
// Upload direct vers Cloudinary
import { uploadToCloudinary } from "@/utils/cloudinary";
const result = await uploadToCloudinary(file);
// result.secure_url contient l'URL de l'image
```

---

## 📝 Checklist de Migration

- [ ] Créer un Upload Preset dans Cloudinary
- [ ] Installer le SDK Cloudinary (`pnpm add cloudinary`)
- [ ] Créer `src/utils/cloudinary.js`
- [ ] Configurer les variables d'environnement
- [ ] Remplacer les uploads dans `MediaManager.jsx`
- [ ] Remplacer les uploads dans `AnnoncesManager.jsx`
- [ ] Remplacer les uploads dans `ProjetsManager.jsx`
- [ ] Mettre à jour les URLs d'affichage (utiliser `result.secure_url`)
- [ ] Tester les uploads (images, PDF, vidéos)
- [ ] Tester les suppressions
- [ ] Vérifier les transformations d'images

---

## 🎯 Prochaines Étapes

1. **Créer l'Upload Preset** dans Cloudinary
2. **Installer le SDK** et créer l'utilitaire
3. **Migrer les composants** un par un
4. **Tester** toutes les fonctionnalités
5. **Supprimer** le code backend d'upload

---

**Note** : Une fois Cloudinary intégré, vous pourrez supprimer complètement le backend d'upload et utiliser uniquement Cloudinary pour tous vos médias.
