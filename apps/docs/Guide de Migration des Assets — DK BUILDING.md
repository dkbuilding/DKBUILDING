# Guide de Migration des Assets - DK BUILDING

## 📁 Structure des Assets

Tous les assets du projet DK BUILDING sont maintenant organisés dans le dossier `src/assets/` :

```bash
src/assets/
├── documents/          # Documents PDF, brochures, catalogues
│   ├── brochures/
│   ├── catalogs/
│   └── legal/
├── fonts/              # Polices de caractères
│   ├── display/        # Polices d'affichage
│   ├── primary/        # Polices principales
│   │   └── FoundationSans/
│   └── secondary/      # Polices secondaires
├── icons/              # Icônes SVG
│   ├── brands/         # Logos de marques
│   ├── social/         # Icônes réseaux sociaux
│   └── ui/             # Icônes interface utilisateur
├── images/             # Images et photos
│   ├── backgrounds/    # Images de fond
│   ├── decos/          # Éléments décoratifs
│   ├── gallery/        # Galerie photos
│   ├── hero/           # Images hero
│   ├── logos/          # Logos DK BUILDING
│   ├── projects/       # Images de projets
│   └── team/           # Photos d'équipe
└── videos/             # Vidéos
    ├── brand/          # Vidéos de marque
    ├── hero/           # Vidéos hero
    ├── projects/       # Vidéos de projets
    ├── promotional/    # Vidéos promotionnelles
    └── stocks/         # Vidéos stock
```

## 🔄 Migration Effectuée

### Logos DK BUILDING

- ✅ `Logo — DK BUILDING — Structure 2.png` → `/src/assets/images/logos/`
- ✅ `Logo — DK BUILDING — Structure.png` → `/src/assets/images/logos/`
- ✅ `Logo — DK BUILDING - Assemblé - Carré.png` → `/src/assets/images/logos/`
- ✅ `Logo — DK BUILDING - Assemblé - Rectangle.png` → `/src/assets/images/logos/`

### Polices Foundation Sans

- ✅ `Fontspring-DEMO-FoundationSans-Roman.otf` → `/src/assets/fonts/primary/FoundationSans/`
- ✅ `Fontspring-DEMO-FoundationSans-Light.otf` → `/src/assets/fonts/primary/FoundationSans/`
- ✅ `Fontspring-DEMO-FoundationSans-Bold.otf` → `/src/assets/fonts/primary/FoundationSans/`
- ✅ `Fontspring-DEMO-FoundationSans-BlackEx.otf` → `/src/assets/fonts/primary/FoundationSans/`

### Fichiers Modifiés

- ✅ `components/Footer.jsx`
- ✅ `components/Preloader.jsx`
- ✅ `components/Navigation.jsx`
- ✅ `components/Hero.jsx`
- ✅ `components/Contact.jsx`
- ✅ `pages/ErrorPage.jsx`
- ✅ `config/preloaderConfig.json`
- ✅ `index.css`

## 📝 Utilisation des Assets

### Dans les Composants React

```jsx
// ✅ Correct - Utilisation des assets depuis src/assets/
<img src="/src/assets/images/logos/Logo — DK BUILDING — Structure 2.png" alt="Logo" />

// ❌ Ancien - Référence directe (ne fonctionne plus)
<img src="/Logo — DK BUILDING — Structure 2.png" alt="Logo" />
```

### Dans les Fichiers CSS

```css
/* ✅ Correct - Utilisation des polices depuis src/assets/ */
@font-face {
  font-family: 'Foundation Sans';
  src: url('/src/assets/fonts/primary/FoundationSans/Fontspring-DEMO-FoundationSans-Roman.otf') format('opentype');
}

/* ❌ Ancien - Référence directe (ne fonctionne plus) */
@font-face {
  font-family: 'Foundation Sans';
  src: url('/fonts/Fontspring-DEMO-FoundationSans-Roman.otf') format('opentype');
}
```

## 🚀 Avantages de cette Structure

1. **Organisation** : Assets organisés par type et catégorie
2. **Maintenabilité** : Structure claire et logique
3. **Performance** : Optimisation automatique par Vite
4. **Scalabilité** : Facile d'ajouter de nouveaux assets
5. **Versioning** : Contrôle de version des assets

## ⚠️ Points d'Attention

- Les chemins commencent par `/src/assets/` (pas `@assets/`)
- Vite gère automatiquement le serving des assets
- Les assets sont optimisés en production
- Les polices sont chargées avec `font-display: swap` pour de meilleures performances

## 🔧 Configuration Vite

Le fichier `vite.config.js` est déjà configuré pour servir les assets correctement :

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  }
})
```

## 📋 Checklist de Migration

- [x] Analyser les assets disponibles dans src/assets/
- [x] Identifier tous les chemins actuels utilisant des références directes
- [x] Mettre à jour les chemins pour utiliser les assets dans src/assets/
- [x] Vérifier qu'aucune erreur de linting n'a été introduite
- [ ] Tester que tous les assets se chargent correctement
- [ ] Documenter les nouveaux chemins pour l'équipe

## 🎯 Prochaines Étapes

1. Tester le chargement de tous les assets
2. Vérifier que les polices s'affichent correctement
3. S'assurer que les logos apparaissent dans tous les composants
4. Optimiser les images si nécessaire
5. Mettre à jour la documentation de l'équipe
