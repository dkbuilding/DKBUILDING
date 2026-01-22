# Configuration Cloudinary Complète — DK BUILDING

**Date** : 2025-01-18  
**Statut** : ✅ Configuration terminée

---

## ✅ Ce qui a été configuré

### 1. Fichier `.env` créé

- **Cloud Name** : `dztbdnp3l` ✅
- **API Key** : `315295569254364` ✅
- **Upload Preset** : `dkbuilding-unsigned` (à créer dans Cloudinary)
- **Folder** : `dkbuilding` ✅

### 2. Configuration Vite mise à jour

- Variables Cloudinary exposées dans `vite.config.js` ✅
- Types TypeScript ajoutés dans `vite-env.d.ts` ✅
- CSP mis à jour pour autoriser Cloudinary ✅

### 3. Utilitaire Cloudinary créé

- `src/utils/cloudinary.js` avec toutes les fonctions nécessaires ✅

---

## 🔑 Prochaine Étape CRITIQUE : Créer l'Upload Preset

### ⚠️ IMPORTANT : Sans Upload Preset, les uploads ne fonctionneront pas !

1. **Accéder au Dashboard Cloudinary** :
   - https://console.cloudinary.com/apps/c-d213c3d98398d7bb95a907c5908fc8/home/dashboard
   - Ou : Settings → Upload → Upload presets

2. **Créer un nouveau Preset** :
   - Cliquez sur **"Add upload preset"**
   - **Preset name** : `dkbuilding-unsigned`
   - **Signing mode** : ⚠️ **"Unsigned"** (OBLIGATOIRE pour uploads frontend)
   - **Folder** : `dkbuilding/` (optionnel)
   - **Allowed formats** : `jpg, png, webp, pdf, mp4, mov`
   - **Max file size** : `10 MB` (ou plus selon votre plan)
   - **Resource type** : `Auto` (détecte automatiquement image/video/raw)
   - Cliquez sur **"Save"**

3. **Vérifier le Preset** :
   - Le preset `dkbuilding-unsigned` doit apparaître dans la liste
   - Statut : **Active** ✅

---

## 🧪 Tester la Configuration

### 1. Vérifier les Variables d'Environnement

```javascript
// Dans la console du navigateur (après démarrage du serveur)
console.log(import.meta.env.CLOUDINARY_CLOUD_NAME); // doit afficher "dztbdnp3l"
console.log(import.meta.env.CLOUDINARY_UPLOAD_PRESET); // doit afficher "dkbuilding-unsigned"
```

### 2. Tester un Upload

```javascript
import { uploadToCloudinary } from "@/utils/cloudinary";

// Dans un composant React
const handleUpload = async (file) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: "dkbuilding/test",
    });
    console.log("Upload réussi !", result.secure_url);
  } catch (error) {
    console.error("Erreur upload:", error);
  }
};
```

---

## 📝 Variables d'Environnement Configurées

| Variable                   | Valeur                | Statut                     |
| -------------------------- | --------------------- | -------------------------- |
| `CLOUDINARY_CLOUD_NAME`    | `dztbdnp3l`           | ✅ Configuré               |
| `CLOUDINARY_API_KEY`       | `315295569254364`     | ✅ Configuré               |
| `CLOUDINARY_UPLOAD_PRESET` | `dkbuilding-unsigned` | ⚠️ À créer dans Cloudinary |
| `CLOUDINARY_FOLDER`        | `dkbuilding`          | ✅ Configuré               |

---

## ⚠️ Sécurité

### ✅ Ce qui est SÉCURISÉ

- **API Secret** : ⚠️ **NON inclus** dans `.env` (correct !)
- **Upload Preset Unsigned** : Permet les uploads sans API Secret (sécurisé via preset)

### 🔒 Bonnes Pratiques

- ✅ L'API Secret ne doit **JAMAIS** être dans le frontend
- ✅ Utiliser uniquement des Upload Presets "Unsigned" pour le frontend
- ✅ Pour les suppressions, utiliser des fonctions serverless (Vercel Functions, etc.)

---

## 🚀 Utilisation dans les Composants

### Exemple : MediaManager avec Cloudinary

```javascript
import { uploadToCloudinary, getOptimizedUrl } from "@/utils/cloudinary";

const handleUpload = async (file) => {
  try {
    const result = await uploadToCloudinary(file, {
      folder: "dkbuilding/media",
      resourceType: "auto",
    });

    // result.secure_url contient l'URL de l'image
    console.log("Image uploadée :", result.secure_url);

    // URL optimisée pour affichage
    const optimizedUrl = getOptimizedUrl(result.public_id, {
      width: 800,
      height: 600,
      quality: "auto",
    });
  } catch (error) {
    console.error("Erreur upload:", error);
  }
};
```

---

## 📊 Prochaines Étapes

1. ✅ **Créer l'Upload Preset** dans Cloudinary (CRITIQUE)
2. ⏳ **Tester un upload** pour vérifier que tout fonctionne
3. ⏳ **Migrer MediaManager** pour utiliser Cloudinary
4. ⏳ **Migrer AnnoncesManager** pour utiliser Cloudinary
5. ⏳ **Migrer ProjetsManager** pour utiliser Cloudinary
6. ⏳ **Supprimer le code backend d'upload**

---

## 🔗 Liens Utiles

- **Dashboard Cloudinary** : https://console.cloudinary.com/apps/c-d213c3d98398d7bb95a907c5908fc8/home/dashboard
- **Upload Presets** : https://console.cloudinary.com/settings/upload
- **Documentation Cloudinary** : https://cloudinary.com/documentation
- **Guide d'intégration** : `Site Web/apps/docs/INTEGRATION_CLOUDINARY.md`

---

**Note** : Une fois l'Upload Preset créé, vous pourrez commencer à utiliser Cloudinary dans vos composants !
