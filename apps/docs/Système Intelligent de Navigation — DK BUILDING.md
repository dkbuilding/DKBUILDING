# Système Intelligent de Navigation - DK BUILDING

## Vue d'ensemble

Le système intelligent de navigation de DK BUILDING utilise GSAP et ScrollTrigger pour offrir une expérience de navigation fluide et contextuelle entre les sections du site. Il s'adapte automatiquement au contexte et propose plusieurs méthodes de navigation.

### 🎯 Détection Automatique des Sections

- **Détection dynamique** de l'ordre des sections dans le DOM
- **Adaptation automatique** aux changements de structure
- **Observer de mutations** pour détecter les nouvelles sections
- **Rafraîchissement intelligent** des références

## Fonctionnalités

### 🎯 Navigation Intelligente

- **Détection automatique** de la section actuellement visible
- **Scroll fluide** avec animations GSAP personnalisées
- **Prévention des conflits** entre navigation manuelle et automatique
- **Gestion des états** pendant les transitions

### ⌨️ Navigation au Clavier

- **Flèches haut/bas** : Navigation entre sections
- **Page Up/Page Down** : Navigation rapide
- **Home/End** : Aller au début/fin du site
- **Respect des formulaires** : Désactivation dans les champs de saisie

### 📱 Interface Adaptative

- **Desktop** : Indicateur vertical avec barre de progression
- **Mobile** : Barre de progression horizontale en bas d'écran
- **Points interactifs** : Navigation directe vers une section
- **Indicateurs visuels** : Progression et section actuelle

## Architecture

### Hook `useSmartNavigation`

```javascript
const {
  sections,              // Liste des sections détectées dynamiquement
  currentSection,        // Index de la section actuelle
  scrollToNextSection,   // Fonction pour section suivante
  scrollToPreviousSection, // Fonction pour section précédente
  scrollToSection,       // Fonction pour section spécifique
  scrollToSectionById,   // Fonction pour section par ID
  isScrolling,          // État de navigation en cours
  detectCurrentSection,  // Fonction de détection
  refreshSections       // Fonction pour rafraîchir la détection
} = useSmartNavigation();
```

### Composants

#### `SmartNavigationIndicator` (Desktop)

- Indicateur vertical fixe à droite
- Barre de progression avec points interactifs
- Boutons précédent/suivant
- Affichage de la section actuelle

#### `MobileProgressIndicator` (Mobile)

- Barre de progression horizontale
- Points de navigation tactiles
- Boutons de navigation
- Informations de section

#### `SectionsDebugPanel` (Développement)

- Affichage de l'ordre des sections détectées
- Indicateur de section actuelle
- Bouton de rafraîchissement
- Visible uniquement en mode développement

## Configuration

### Détection Automatique des Sections

Le système détecte automatiquement l'ordre des sections en analysant le DOM :

```javascript
// Configuration des sections connues
const sectionConfig = {
  'home': { name: 'Accueil' },
  'news': { name: 'Actualités' },
  'services': { name: 'Services' },
  'portfolio': { name: 'Portfolio' },
  'about': { name: 'À propos' },
  'contact': { name: 'Contact' }
};

// Détection automatique de l'ordre
const detectSectionsOrder = () => {
  const allSections = document.querySelectorAll('section[id]');
  const sortedSections = Array.from(allSections).sort((a, b) => {
    return a.getBoundingClientRect().top - b.getBoundingClientRect().top;
  });
  // ... traitement des sections détectées
};
```

### Ordre de Navigation Détecté

Le système détecte automatiquement l'ordre dans le DOM :

1. **Accueil** → Présentation de DK BUILDING
2. **Actualités** → Dernières nouvelles et projets
3. **Services** → Offres de charpente, bardage, couverture
4. **Portfolio** → Réalisations et projets
5. **À propos** → Histoire et équipe
6. **Contact** → Informations de contact

### Sections Disponibles (dans l'ordre de navigation)

```javascript
const sections = [
  { id: 'home', name: 'Accueil' },        // Section d'accueil
  { id: 'news', name: 'Actualités' },     // Section suivante après home
  { id: 'services', name: 'Services' },    // Services après actualités
  { id: 'portfolio', name: 'Portfolio' },  // Portfolio après services
  { id: 'about', name: 'À propos' },      // À propos après portfolio
  { id: 'contact', name: 'Contact' }      // Contact en dernier
];
```

### Animations GSAP

- **Durée** : 1.2s pour les transitions
- **Easing** : `power3.inOut` pour la fluidité
- **Détection** : Basée sur 50% de visibilité
- **Délai** : 150ms pour éviter les conflits

## Utilisation

### Intégration dans un Composant

```javascript
import { useSmartNavigation } from '../hooks/useSmartNavigation';

const MyComponent = () => {
  const { scrollToNextSection, isScrolling } = useSmartNavigation();
  
  return (
    <button 
      onClick={scrollToNextSection}
      disabled={isScrolling}
    >
      Section Suivante
    </button>
  );
};
```

### Navigation Programmatique

```javascript
// Navigation vers la section suivante
scrollToNextSection();

// Navigation vers une section spécifique
scrollToSectionById('services');

// Navigation par index
scrollToSection(2);
```

## Personnalisation

### Modifier les Animations

```javascript
// Dans useSmartNavigation.js
gsap.to(window, {
  duration: 1.5, // Durée personnalisée
  scrollTo: { y: targetSection },
  ease: "power2.out" // Easing personnalisé
});
```

### Ajouter des Sections

```javascript
// Dans useSmartNavigation.js
const sections = [
  // ... sections existantes
  { id: 'nouvelle-section', name: 'Nouvelle Section' }
];
```

### Personnaliser les Styles

```css
/* Indicateur desktop */
.smart-navigation-indicator {
  /* Styles personnalisés */
}

/* Indicateur mobile */
.mobile-progress-indicator {
  /* Styles personnalisés */
}
```

## Performance

### Optimisations

- **ScrollTrigger** : Gestion efficace des événements de scroll
- **Debouncing** : Évite les calculs excessifs
- **Cleanup** : Nettoyage automatique des listeners
- **Hardware acceleration** : Utilisation des propriétés transform/opacity

### Métriques

- **Temps de réponse** : < 16ms pour les animations
- **Mémoire** : Cleanup automatique des références
- **Batterie** : Optimisé pour mobile

## Accessibilité

### Support Clavier

- Navigation complète au clavier
- Indicateurs visuels d'état
- Focus management approprié

### Screen Readers

- Labels ARIA appropriés
- Descriptions des actions
- États annoncés

### Motion Preferences

```javascript
// Respect de prefers-reduced-motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  // Désactiver les animations
}
```

## Dépannage

### Problèmes Courants

#### Navigation ne fonctionne pas

- Vérifier que les sections ont des IDs corrects
- S'assurer que ScrollTrigger est enregistré
- Vérifier les références DOM

#### Animations saccadées

- Vérifier les propriétés animées (privilégier transform/opacity)
- S'assurer que will-change est défini
- Vérifier la performance du navigateur

#### Conflits de scroll

- Vérifier les délais de détection
- S'assurer que isScrolling est géré correctement
- Vérifier les event listeners

### Debug

```javascript
// Activer les marqueurs ScrollTrigger
ScrollTrigger.defaults({
  markers: true
});

// Logs de debug
console.log('Current section:', currentSection);
console.log('Is scrolling:', isScrolling);
```

## Évolutions Futures

### Fonctionnalités Prévues

- **Navigation par swipe** sur mobile
- **Indicateurs de contenu** dynamiques
- **Navigation contextuelle** basée sur le contenu
- **Analytics** de navigation

### Améliorations Techniques

- **Web Workers** pour les calculs lourds
- **Intersection Observer** pour la détection
- **Service Worker** pour la mise en cache
- **Progressive Enhancement** pour la compatibilité

---

*Système développé avec GSAP, React et Tailwind CSS pour DK BUILDING*
