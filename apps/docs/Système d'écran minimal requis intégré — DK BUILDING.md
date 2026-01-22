# Système d'écran minimal requis intégré - DK BUILDING

## Vue d'ensemble

Le système d'écran minimal requis est maintenant intégré directement dans le composant `Preloader.jsx` existant. Il empêche l'affichage du site web sur les écrans trop petits (< 320px) en affichant le preloader avec un message informatif superposé. Ce système est conçu pour garantir une expérience utilisateur optimale sur tous les appareils compatibles tout en maintenant la cohérence visuelle.

## Avantages de l'intégration

### Architecture simplifiée

- **Un seul composant :** Toute la logique dans `Preloader.jsx`
- **Code centralisé :** Plus facile à maintenir et déboguer
- **Moins de fichiers :** Suppression du composant `ScreenBlocker.jsx` séparé

### Cohérence visuelle parfaite

- **Fond identique :** Utilise exactement la même classe CSS que le preloader existant
- **Apparence unifiée :** Garantit une expérience utilisateur cohérente
- **Logo visible :** Le logo DK BUILDING reste visible en arrière-plan
- **Intégration native :** Le message fait partie du preloader, pas une superposition

### Maintenance optimisée

- **Réutilisation du code :** Pas de duplication des styles CSS
- **Logique centralisée :** Toute la logique de preloader en un seul endroit
- **Performance optimisée :** Moins de composants React à gérer
- **Debugging simplifié :** Un seul composant à surveiller

### Extensibilité maintenue

- **Configuration JSON :** Toujours modifiable via `preloaderConfig.json`
- **Animations GSAP :** Fonctionnalités d'animation préservées
- **Accessibilité :** Respect complet des standards d'accessibilité
- **Hook useScreenWidth :** Détection d'écran intégrée au preloader

## Architecture

### 1. Configuration centralisée (`preloaderConfig.json`)

Le fichier de configuration JSON permet de gérer toutes les conditions d'affichage du preloader :

```json
{
  "screenConditions": {
    "minWidth": 320,
    "message": {
      "title": "Un espace plus large est nécessaire",
      "subtitle": "Notre site nécessite un écran d'au moins 480px de largeur...",
      "action": "Pour une navigation confortable, veuillez utiliser...",
      "icon": "ruler"
    }
  }
}
```

**Avantages :**

- Configuration centralisée et facilement modifiable
- Messages personnalisables sans modification du code
- Extensible pour d'autres conditions (navigateur obsolète, connexion lente)

### 2. Hook de détection d'écran (`useScreenWidth.js`)

Hook React personnalisé qui :

- Détecte la largeur de l'écran en temps réel
- Utilise un debounce de 150ms pour optimiser les performances
- Gère le SSR avec des guards appropriés
- Retourne la largeur actuelle et un booléen `isBelowMinimum`

### 3. Composant Preloader intégré (`Preloader.jsx`)

Le composant `Preloader.jsx` existant a été étendu pour inclure :

- Utilisation du hook `useScreenWidth` pour la détection d'écran
- Affichage conditionnel du message d'erreur si `isBelowMinimum` est true
- Animation GSAP intégrée pour le message d'erreur
- Respect des préférences d'accessibilité (`prefers-reduced-motion`)
- Toutes les fonctionnalités du preloader original préservées

### 4. Intégration dans App.jsx

Le `Preloader` intégré est le seul composant nécessaire dans `App.jsx`, gérant à la fois le chargement normal et la détection d'écran minimal.

## Fonctionnalités

### Détection d'écran

- **Seuil :** 320px (breakpoint xs de Tailwind)
- **Détection temps réel :** Mise à jour automatique lors du resize
- **Performance :** Debounce pour éviter les calculs excessifs

### Message utilisateur

- **Titre :** "Un espace plus large est nécessaire"
- **Sous-titre :** Explication technique et professionnelle
- **Action :** Instructions claires pour l'utilisateur
- **Indicateur :** Affichage de la largeur actuelle

### Design et animations

- **Icône :** Lucide React RulerIcon (règle/mètre du métier du bâtiment)
- **Fond :** Utilise la classe CSS `dk-preloader` existante (#0E0E0E)
- **Logo :** Logo DK BUILDING visible en arrière-plan (opacity: 30%)
- **Typographie :** Foundation Sans (police du projet)
- **Animation :** GSAP avec fadeIn + scale
- **Accessibilité :** Respect de `prefers-reduced-motion`
- **Cohérence :** Apparence identique au preloader normal

### Extensibilité

Le système est conçu pour être facilement étendu avec :

- Détection de navigateur obsolète
- Détection de connexion lente
- Autres conditions personnalisées
- Messages multilingues

## Utilisation

### Configuration

Modifiez `preloaderConfig.json` pour :

- Changer le seuil de largeur minimale
- Personnaliser les messages
- Ajuster les paramètres d'animation
- Ajouter de nouvelles conditions

### Tests

Utilisez le script `test-screen-blocker.sh` pour valider :

- Affichage correct selon la largeur d'écran
- Animations fluides
- Accessibilité
- Performance

### Développement

Pour ajouter de nouvelles conditions :

1. Étendre `preloaderConfig.json` avec la nouvelle condition
2. Modifier `Preloader.jsx` pour gérer la nouvelle logique
3. Ajouter les styles CSS nécessaires dans le message d'erreur
4. Tester avec le script de validation

## Accessibilité

- **Navigation clavier :** Le message est focusable
- **Lecteur d'écran :** Structure sémantique appropriée
- **Contraste :** Respect des standards WCAG AA
- **Mouvement réduit :** Désactivation des animations si demandé

## Performance

- **Debounce :** 150ms pour éviter les calculs excessifs
- **SSR :** Guards appropriés pour éviter les erreurs côté serveur
- **Mémoire :** Cleanup automatique des listeners
- **Animations :** Utilisation de GSAP pour des performances optimales

## Compatibilité

- **Navigateurs :** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Appareils :** Tous les écrans >= 480px
- **Frameworks :** React 18+, GSAP 3+

## Maintenance

Le système est conçu pour être maintenu facilement :

- Configuration centralisée dans JSON
- Code modulaire et réutilisable
- Documentation complète
- Tests automatisés

Pour toute modification, référez-vous à cette documentation et utilisez les outils de test fournis.
