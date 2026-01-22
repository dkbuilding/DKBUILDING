# Foundation Sans - Guide d'utilisation (4 variantes disponibles)

## 🎯 Status actuel

**Variantes intégrées** : ✅ **4 variantes Foundation Sans disponibles**
**Fichiers valides** : 8 fichiers (.woff2 + .otf)
**Configuration** : CSS et Tailwind mis à jour

## 📊 Variantes disponibles

### Styles de base (4 variantes)

- **Light** (300) - `font-foundation font-light`
- **Roman** (400) - `font-foundation font-normal`
- **Bold** (700) - `font-foundation font-bold`
- **BlackEx** (950) - `font-foundation font-ultra`

## 🎨 Exemples d'utilisation

### Titres principaux

```jsx
// Titre principal avec BlackEx
<h1 className="font-foundation font-ultra text-6xl text-white">
  DK BUILDING
</h1>

// Sous-titre avec Bold
<h2 className="font-foundation font-bold text-3xl text-dk-yellow">
  Construction Excellence
</h2>

// Titre de section avec Bold
<h3 className="font-foundation font-bold text-xl text-white">
  Nos Services
</h3>
```

### Corps de texte

```jsx
// Texte normal avec Roman
<p className="font-foundation font-normal text-base text-white">
  Votre partenaire de confiance pour tous vos projets de construction.
</p>

// Texte léger avec Light
<p className="font-foundation font-light text-sm text-dk-gray-300">
  Description détaillée de nos services.
</p>
```

## 🎯 Classes Tailwind disponibles

### Poids de police

- `font-light` → 300 (Light)
- `font-normal` → 400 (Roman)
- `font-bold` → 700 (Bold)
- `font-ultra` → 950 (BlackEx)

### Classes spécifiques Foundation Sans

- `font-foundation-light` → Light (300)
- `font-foundation-roman` → Roman (400)
- `font-foundation-bold` → Bold (700)
- `font-foundation-black-ex` → BlackEx (950)

## 🏗️ Structure recommandée pour DK BUILDING

### Page d'accueil

```jsx
export default function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="font-foundation font-ultra text-7xl text-white mb-4">
          DK BUILDING
        </h1>
        <p className="font-foundation font-light text-xl text-dk-gray-200 mb-8">
          Excellence en construction depuis 2020
        </p>
        <button className="font-foundation font-bold text-lg bg-dk-yellow text-dk-black px-8 py-3">
          Découvrir nos services
        </button>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <h2 className="font-foundation font-bold text-4xl text-dk-yellow mb-8">
          NOS SERVICES
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="service-card">
            <h3 className="font-foundation font-bold text-xl text-white mb-4">
              Construction
            </h3>
            <p className="font-foundation font-normal text-base text-dk-gray-300">
              Construction de bâtiments résidentiels et commerciaux.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
```

### Navigation

```jsx
export default function Navigation() {
  return (
    <nav className="navigation">
      <div className="font-foundation font-bold text-xl text-white">
        DK BUILDING
      </div>
      <ul className="font-foundation font-normal text-base">
        <li><a href="/services" className="hover:text-dk-yellow">Services</a></li>
        <li><a href="/portfolio" className="hover:text-dk-yellow">Portfolio</a></li>
        <li><a href="/contact" className="hover:text-dk-yellow">Contact</a></li>
      </ul>
    </nav>
  );
}
```

## 📱 Responsive Design

### Adaptation des tailles selon l'écran

```jsx
// Titre adaptatif
<h1 className="font-foundation font-ultra text-4xl md:text-6xl lg:text-7xl">
  DK BUILDING
</h1>

// Texte adaptatif
<p className="font-foundation font-normal text-sm md:text-base lg:text-lg">
  Description adaptative
</p>

// Navigation adaptative
<nav className="font-foundation font-normal text-xs md:text-sm lg:text-base">
  Menu adaptatif
</nav>
```

## 🎨 Bonnes pratiques

### 1. Hiérarchie typographique

```jsx
// Structure recommandée pour une page
<h1 className="font-foundation font-ultra text-6xl">Titre principal</h1>
<h2 className="font-foundation font-bold text-4xl">Sous-titre</h2>
<h3 className="font-foundation font-bold text-2xl">Titre de section</h3>
<p className="font-foundation font-normal text-base">Corps de texte</p>
<small className="font-foundation font-light text-sm">Texte secondaire</small>
```

### 2. Cohérence des poids

- Utilisez **BlackEx** uniquement pour les titres principaux
- Utilisez **Bold** pour les sous-titres et éléments importants
- Utilisez **Roman** pour le corps de texte principal
- Utilisez **Light** pour les textes secondaires

### 3. Utilisation des couleurs DK BUILDING

```jsx
// Titre principal avec couleur DK
<h1 className="font-foundation font-ultra text-6xl text-white">
  DK BUILDING
</h1>

// Accent avec couleur DK Yellow
<h2 className="font-foundation font-bold text-3xl text-dk-yellow">
  Services
</h2>

// Texte secondaire avec gris DK
<p className="font-foundation font-light text-sm text-dk-gray-300">
  Description
</p>
```

## 🔧 Performance

### Optimisation du chargement

- Les polices sont chargées avec `font-display: swap`
- Formats WOFF2 optimisés pour le web
- Fallbacks appropriés (Montserrat, Arial)

### Bonnes pratiques

- Limitez le nombre de variantes chargées par page
- Utilisez les variantes les plus courantes en priorité
- Évitez de charger toutes les variantes si elles ne sont pas utilisées

## 🎯 Résumé des fichiers intégrés

### Fichiers CSS

- ✅ `index.css` - 4 déclarations @font-face valides
- ✅ `tailwind.config.js` - Configuration avec 4 variantes

### Fichiers de polices (8 fichiers)

- ✅ **Light** : Fontspring-DEMO-FoundationSans-Light.woff2, Fontspring-DEMO-FoundationSans-Light.otf
- ✅ **Roman** : Fontspring-DEMO-FoundationSans-Roman.woff2, Fontspring-DEMO-FoundationSans-Roman.otf
- ✅ **Bold** : Fontspring-DEMO-FoundationSans-Bold.woff2, Fontspring-DEMO-FoundationSans-Bold.otf
- ✅ **BlackEx** : Fontspring-DEMO-FoundationSans-BlackEx.woff2, Fontspring-DEMO-FoundationSans-BlackEx.otf

## 🚀 Prochaines étapes

1. ✅ **Intégration** - 4 variantes intégrées avec succès
2. ✅ **Configuration** - CSS et Tailwind mis à jour
3. ✅ **Test** - Polices valides et fonctionnelles
4. ⏳ **Utilisation** - Intégrer dans les composants DK BUILDING
5. ⏳ **Expansion** - Ajouter d'autres variantes si nécessaire

## 💡 Note importante

Les erreurs OTS précédentes étaient dues à des fichiers HTML téléchargés au lieu de vrais fichiers de polices. Cette configuration utilise uniquement les fichiers de polices valides et testés.

---

**Status final** : ✅ **4 variantes Foundation Sans intégrées et fonctionnelles**
**Erreurs OTS** : ✅ **Résolues**
**Configuration** : ✅ **Optimisée pour les polices valides**
