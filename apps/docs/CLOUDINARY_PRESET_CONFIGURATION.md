# Configuration Upload Preset Cloudinary — DK BUILDING

**Date** : 2025-01-18  
**Preset** : `dkbuilding-unsigned`

---

## ✅ Configuration Actuelle (Vérifiée)

### Paramètres Corrects ✅

1. **Upload preset name** : `dkbuilding-unsigned` ✅
2. **Signing mode** : `Unsigned` ✅ (OBLIGATOIRE pour uploads frontend)
3. **Disallow public ID** : `Off` ✅ (Permet les public IDs personnalisés)
4. **Generated public ID** : `Auto-generate an unguessable public ID value` ✅
5. **Generated display name** : `Use the filename of the uploaded file` ✅

### ⚠️ À Modifier

**Asset folder** : Actuellement `samples/ecommerce`  
**Devrait être** : `dkbuilding` (ou laisser vide si vous préférez gérer les dossiers dans le code)

---

## 🔧 Modification Recommandée

### Option 1 : Utiliser le dossier `dkbuilding` (Recommandé)

1. Dans le champ **Asset folder**, remplacez `samples/ecommerce` par `dkbuilding`
2. Cela organisera automatiquement tous les fichiers dans le dossier `dkbuilding/` dans Cloudinary

### Option 2 : Laisser vide (Gérer dans le code)

1. Laissez le champ **Asset folder** vide
2. Spécifiez le dossier dans le code lors de l'upload :
   ```javascript
   await uploadToCloudinary(file, {
     folder: 'dkbuilding/media' // ou autre sous-dossier
   });
   ```

---

## 💾 Sauvegarder le Preset

Une fois les modifications faites :

1. Cliquez sur **"Save"** en bas de la page
2. Vérifiez que le preset apparaît dans la liste avec le statut **"Active"**
3. Le preset est maintenant prêt à être utilisé !

---

## ✅ Vérification Finale

Avant de sauvegarder, vérifiez que :

- [x] **Preset name** : `dkbuilding-unsigned`
- [x] **Signing mode** : `Unsigned` ✅
- [ ] **Asset folder** : `dkbuilding` (ou vide)
- [x] **Disallow public ID** : `Off` ✅
- [x] **Generated public ID** : `Auto-generate` ✅
- [x] **Generated display name** : `Use filename` ✅

---

## 🧪 Test Après Sauvegarde

Une fois le preset sauvegardé, vous pouvez tester avec :

```javascript
import { uploadToCloudinary } from '@/utils/cloudinary';

// Test upload
const file = // votre fichier
const result = await uploadToCloudinary(file, {
  folder: 'dkbuilding/test'
});

console.log('Upload réussi !', result.secure_url);
```

---

**Note** : Si vous choisissez de laisser le dossier vide dans le preset, vous pourrez spécifier des sous-dossiers différents dans le code (ex: `dkbuilding/media`, `dkbuilding/annonces`, etc.).


