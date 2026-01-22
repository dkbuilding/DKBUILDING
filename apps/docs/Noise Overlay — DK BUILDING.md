# Noise Overlay - DK BUILDING

## Description

L'overlay de noise est une technique CSS avancée utilisée pour améliorer la netteté perçue des vidéos de fond. Il applique un pattern de bruit subtil qui simule l'effet d'un écran haute résolution, rendant les vidéos plus nettes et professionnelles.

## Fonctionnalités

### Variantes disponibles

- **`primary`** : Pattern de gradients radiaux optimisé pour la plupart des cas
- **`svg`** : Pattern SVG avec turbulence fractale pour plus de contrôle
- **`hd`** : Pattern haute résolution pour écrans 4K+

### Intensités

- **`subtle`** : Opacité 0.005 - Effet très discret
- **`medium`** : Opacité 0.015 - Effet équilibré (recommandé)
- **`strong`** : Opacité 0.03 - Effet plus prononcé

### Couleurs

- **`default`** : Blanc neutre
- **`warm`** : Tons chauds (beige/crème)
- **`cool`** : Tons froids (bleu clair)

## Utilisation

### Composant React

```jsx
import NoiseOverlay from './components/NoiseOverlay';

// Utilisation basique
<NoiseOverlay />

// Utilisation avancée
<NoiseOverlay 
  variant="primary" 
  intensity="medium" 
  color="default"
  animated={false}
/>
```

### Classes CSS directes

```html
<!-- Overlay principal -->
<div class="noise-overlay-primary noise-overlay-medium"></div>

<!-- Overlay SVG avec animation -->
<div class="noise-overlay-svg noise-overlay-subtle noise-overlay-animated"></div>

<!-- Overlay haute résolution -->
<div class="noise-overlay-hd noise-overlay-strong"></div>
```

## Techniques utilisées

### 1. Gradients radiaux multiples

- Crée un pattern de points de différentes tailles
- Simule le grain d'un film photographique
- Optimisé pour les performances avec `will-change`

### 2. Pattern SVG avec turbulence

- Utilise `feTurbulence` pour un bruit fractal
- Plus naturel et organique
- Contrôle précis des paramètres

### 3. Mix-blend-mode

- `overlay` : Améliore le contraste
- `soft-light` : Effet plus subtil
- Compatible avec tous les navigateurs modernes

### 4. Filtres CSS

- `contrast()` : Augmente la netteté perçue
- `brightness()` : Ajuste la luminosité
- `saturate()` : Contrôle la saturation des couleurs

## Optimisations

### Performance

- Utilisation de `transform: translateZ(0)` pour l'accélération matérielle
- `backface-visibility: hidden` pour éviter les artefacts
- Patterns optimisés pour éviter les reflows

### Responsive

- Intensité réduite sur mobile (0.01)
- Intensité augmentée sur écrans 4K (0.025)
- Adaptation automatique selon la densité de pixels

### Accessibilité

- Respect de `prefers-reduced-motion`
- Désactivation des animations si nécessaire
- Mode sombre optimisé

## Paramètres techniques

### Opacités par défaut

- Primary : 0.02
- SVG : 0.015
- HD : 0.008

### Tailles de pattern

- Primary : 4px, 6px, 8px
- SVG : 200px
- HD : 2px, 3px, 4px, 5px

### Filtres appliqués

- Primary : `contrast(1.2) brightness(1.1)`
- SVG : `contrast(1.3) brightness(1.05)`
- HD : `contrast(1.4) brightness(1.08) saturate(1.1)`

## Compatibilité

- ✅ Chrome 88+
- ✅ Firefox 85+
- ✅ Safari 14+
- ✅ Edge 88+
- ⚠️ IE11 : Dégradé gracieux (pas d'effet)

## Exemples d'utilisation

### Vidéo de fond simple

```jsx
<section className="relative">
  <video className="absolute inset-0 w-full h-full object-cover">
    <source src="video.mp4" type="video/mp4" />
  </video>
  <NoiseOverlay variant="primary" intensity="medium" />
  <div className="relative z-10">
    {/* Contenu */}
  </div>
</section>
```

### Galerie d'images

```jsx
<div className="relative">
  <img src="image.jpg" alt="Construction" className="w-full h-full object-cover" />
  <NoiseOverlay variant="svg" intensity="subtle" animated={true} />
</div>
```

### Mode sombre

```jsx
<NoiseOverlay 
  variant="primary" 
  intensity="medium" 
  color="cool"
  className="dark:opacity-[0.03]"
/>
```

## Maintenance

### Ajustements fréquents

- Modifier l'opacité selon les retours utilisateurs
- Ajuster les filtres pour différents types de contenu
- Optimiser les performances sur mobile

### Tests recommandés

- Différentes résolutions d'écran
- Navigateurs variés
- Appareils mobiles et desktop
- Mode sombre/clair

## Notes techniques

L'overlay de noise fonctionne en créant une texture subtile qui :

1. Augmente la netteté perçue par l'œil humain
2. Masque les artefacts de compression vidéo
3. Donne un aspect plus professionnel et cinématographique
4. Améliore la lisibilité du texte superposé

L'effet est particulièrement efficace sur les vidéos de construction où les détails fins sont importants pour la crédibilité du projet.
