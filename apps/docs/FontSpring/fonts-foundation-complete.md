# Foundation Sans - Guide d'utilisation complet

## Vue d'ensemble

Foundation Sans est une famille de polices complète avec 24 variantes disponibles dans le projet DK BUILDING. Cette documentation explique comment utiliser toutes les variantes dans vos composants React.

## Variantes disponibles

### Styles de base

- **Ultra Light** (100) - `font-foundation font-thin`
- **Light** (300) - `font-foundation font-light`
- **Roman** (400) - `font-foundation font-normal`
- **Bold** (700) - `font-foundation font-bold`
- **Black** (900) - `font-foundation font-black`
- **BlackEx** (950) - `font-foundation font-ultra`

### Styles italic

- **Ultra Light Italic** (100) - `font-foundation font-thin italic`
- **Light Italic** (300) - `font-foundation font-light italic`
- **Italic** (400) - `font-foundation font-normal italic`
- **Bold Italic** (700) - `font-foundation font-bold italic`
- **Black Italic** (900) - `font-foundation font-black italic`

### Styles Condensed

- **Light Condensed** (300) - `font-foundation font-light font-condensed`
- **Condensed** (400) - `font-foundation font-normal font-condensed`
- **Bold Condensed** (700) - `font-foundation font-bold font-condensed`
- **Black Condensed** (900) - `font-foundation font-black font-condensed`

### Styles Extended

- **Light Extended** (300) - `font-foundation font-light font-expanded`
- **Extended** (400) - `font-foundation font-normal font-expanded`
- **Bold Extended** (700) - `font-foundation font-bold font-expanded`
- **Black Extended** (900) - `font-foundation font-black font-expanded`

### Styles spéciaux

- **Outline** (400) - `font-foundation font-normal`
- **Outline Extended** (400) - `font-foundation font-normal font-expanded`

## Exemples d'utilisation

### Titres principaux

```jsx
// Titre principal avec BlackEx
<h1 className="font-foundation font-ultra text-4xl text-white">
  DK BUILDING
</h1>

// Sous-titre avec Bold
<h2 className="font-foundation font-bold text-2xl text-dk-yellow">
  Construction Excellence
</h2>
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

### Variantes Condensed (pour les espaces restreints)

```jsx
// Menu de navigation compact
<nav className="font-foundation font-normal font-condensed text-sm">
  <a href="/services" className="text-white hover:text-dk-yellow">
    Services
  </a>
</nav>

// Tableaux avec données
<table className="font-foundation font-light font-condensed text-xs">
  <tr>
    <td>Projet</td>
    <td>Durée</td>
  </tr>
</table>
```

### Variantes Extended (pour l'impact visuel)

```jsx
// Bannières importantes
<div className="font-foundation font-bold font-expanded text-6xl text-center">
  NOUVEAU PROJET
</div>

// Logos et signatures
<span className="font-foundation font-black font-expanded text-xl">
  DK BUILDING
</span>
```

### Styles italic (pour l'emphase)

```jsx
// Citations
<blockquote className="font-foundation font-normal italic text-lg text-dk-gray-200">
  "La qualité avant tout"
</blockquote>

// Mise en évidence
<em className="font-foundation font-bold italic text-dk-yellow">
  Service premium disponible
</em>
```

## Classes utilitaires personnalisées

### Poids de police

- `font-thin` → 100 (Ultra Light)
- `font-light` → 300 (Light)
- `font-normal` → 400 (Roman)
- `font-bold` → 700 (Bold)
- `font-black` → 900 (Black)
- `font-ultra` → 950 (BlackEx)

### Étirement de police

- `font-condensed` → 75% (variantes Condensed)
- `font-expanded` → 125% (variantes Extended)

### Styles

- `italic` → Style italique
- `not-italic` → Style normal

## Bonnes pratiques

### 1. Hiérarchie typographique

```jsx
// Structure recommandée pour une page
<h1 className="font-foundation font-black text-5xl">Titre principal</h1>
<h2 className="font-foundation font-bold text-3xl">Sous-titre</h2>
<h3 className="font-foundation font-bold text-xl">Titre de section</h3>
<p className="font-foundation font-normal text-base">Corps de texte</p>
<small className="font-foundation font-light text-sm">Texte secondaire</small>
```

### 2. Cohérence des poids

- Utilisez **Black/BlackEx** uniquement pour les titres principaux
- Utilisez **Bold** pour les sous-titres et éléments importants
- Utilisez **Roman** pour le corps de texte principal
- Utilisez **Light** pour les textes secondaires

### 3. Responsive design

```jsx
// Adaptation des tailles selon l'écran
<h1 className="font-foundation font-black text-3xl md:text-4xl lg:text-5xl">
  Titre adaptatif
</h1>
```

### 4. Accessibilité

```jsx
// Respect des préférences de mouvement
<div className="font-foundation font-normal transition-all duration-300 motion-reduce:transition-none">
  Contenu avec animation
</div>
```

## Intégration dans les composants

### Composant Hero

```jsx
export default function Hero() {
  return (
    <section className="hero-section">
      <h1 className="font-foundation font-black text-6xl text-white mb-4">
        DK BUILDING
      </h1>
      <p className="font-foundation font-light text-xl text-dk-gray-200 mb-8">
        Excellence en construction depuis 2020
      </p>
      <button className="font-foundation font-bold text-lg bg-dk-yellow text-dk-black px-8 py-3">
        Découvrir nos services
      </button>
    </section>
  );
}
```

### Composant Navigation

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

## Performance

### Optimisation du chargement

- Les polices sont chargées avec `font-display: swap`
- Formats WOFF2 optimisés pour le web
- Fallbacks appropriés (Montserrat, Arial)

### Bonnes pratiques

- Limitez le nombre de variantes chargées par page
- Utilisez les variantes les plus courantes en priorité
- Évitez de charger toutes les variantes si elles ne sont pas utilisées

## Dépannage

### Police ne s'affiche pas

1. Vérifiez que le fichier de police existe dans `/public/fonts/`
2. Vérifiez la déclaration `@font-face` dans `index.css`
3. Vérifiez la classe Tailwind utilisée
4. Inspectez l'élément dans les DevTools pour voir les polices chargées

### Problèmes de performance

1. Vérifiez que seules les variantes nécessaires sont chargées
2. Utilisez `font-display: swap` pour éviter le FOIT
3. Optimisez les tailles de fichiers (WOFF2 > WOFF > OTF)

## Ressources

- [Documentation Tailwind CSS - Font Family](https://tailwindcss.com/docs/font-family)
- [MDN - @font-face](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face)
- [Google Fonts - Font Display](https://web.dev/font-display/)
