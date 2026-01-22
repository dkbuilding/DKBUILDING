# Système de Page d'Erreur DK BUILDING

## Vue d'ensemble

Le système de page d'erreur DK BUILDING est une solution complète et professionnelle pour gérer toutes les erreurs HTTP du site web. Il offre une expérience utilisateur optimale avec des fonctionnalités intelligentes de récupération et de navigation.

## Architecture

### Structure des fichiers

```
src/
├── pages/
│   └── ErrorPage.jsx              # Page principale d'erreur
├── components/error/
│   ├── ErrorIcon.jsx              # Icônes SVG personnalisées par catégorie
│   ├── SearchBar.jsx              # Barre de recherche avec autocomplétion
│   ├── Suggestions.jsx             # Suggestions d'URL intelligentes
│   ├── QuickNav.jsx               # Navigation alternative complète
│   └── ReportButton.jsx           # Système de signalement d'erreur
├── data/
│   └── errorMessages.json         # Messages d'erreur professionnels
└── utils/
    ├── searchIndex.js             # Index de recherche avec fuzzy search
    └── urlMatcher.js              # Algorithme Levenshtein pour suggestions
```

## Fonctionnalités principales

### 1. Design professionnel DK BUILDING

- **Identité visuelle cohérente** : Utilise la palette de couleurs DK BUILDING (noir, jaune, gris)
- **Logo intégré** : Logo DK BUILDING cliquable vers l'accueil
- **Typographie Foundation Sans** : Cohérence avec le reste du site
- **Layout responsive** : Optimisé pour tous les devices (mobile, tablette, desktop)

### 2. Animations GSAP avancées

- **Timeline orchestrée** : Animations séquentielles selon les GSAP Animation Rules
- **Respect prefers-reduced-motion** : Accessibilité pour les utilisateurs sensibles aux animations
- **Cleanup automatique** : Utilisation de `gsap.context()` pour éviter les fuites mémoire
- **Performance optimisée** : Animations hardware-accelerated avec `willChange`

### 3. Système de recherche intelligent

- **Autocomplétion en temps réel** : Suggestions basées sur un index statique
- **Recherche fuzzy** : Tolérance aux fautes de frappe
- **Raccourci clavier** : Touche `/` pour focus rapide
- **Navigation clavier** : Support complet des touches fléchées et Enter

### 4. Suggestions d'URL intelligentes

- **Algorithme Levenshtein** : Calcul de distance pour trouver des correspondances
- **Analyse de segments** : Découpage intelligent de l'URL cassée
- **Pages populaires** : Fallback vers les pages les plus visitées
- **Explications contextuelles** : Raisons de la suggestion affichées

### 5. Navigation alternative complète

- **Grid responsive** : 2 colonnes mobile → 3 colonnes desktop
- **Icônes Lucide** : Icônes professionnelles pour chaque section
- **Hover effects** : Animations subtiles au survol
- **Accessibilité** : ARIA labels et navigation clavier

### 6. Système de signalement

- **Double action** : Tentative d'envoi au backend + fallback
- **API endpoint** : `POST /api/report-error` avec payload structuré
- **Fallback intelligent** : Copie URL + redirection vers contact
- **Notifications toast** : Feedback visuel pour l'utilisateur

## Configuration des messages d'erreur

### Format JSON

```json
{
  "404": {
    "title": "Page introuvable",
    "message": "Cette page n'existe pas ou a été déplacée !",
    "description": "Vérifiez l'URL ou utilisez la recherche pour trouver ce que vous cherchez.",
    "category": "client",
    "actions": ["search", "home", "back"]
  }
}
```

### Catégories d'erreur

- **informational** (1xx) : Messages informatifs
- **success** (2xx) : Messages de succès
- **redirection** (3xx) : Messages de redirection
- **client** (4xx) : Erreurs côté client
- **server** (5xx) : Erreurs côté serveur

### Actions disponibles

- `refresh` : Actualiser la page
- `home` : Retour à l'accueil
- `back` : Retour en arrière
- `search` : Focus sur la barre de recherche
- `retry` : Réessayer l'opération
- `report` : Signaler l'erreur

## API de signalement

### Endpoint

```bash
POST /api/report-error
```

### Payload

```json
{
  "errorCode": "404",
  "brokenUrl": "/services-charpente",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2025-10-19T10:30:00.000Z",
  "errorType": "user_reported",
  "source": "error_page"
}
```

### Réponse

```json
{
  "success": true,
  "message": "Erreur signalée avec succès",
  "ticketId": "ERR-2025-1019-001"
}
```

## Guide de maintenance

### Ajouter un nouveau code d'erreur

1. **Modifier `errorMessages.json`** :

```json
{
  "418": {
    "title": "Je suis une théière",
    "message": "Cette fonctionnalité n'est pas disponible !",
    "description": "Cette page est réservée aux théières connectées.",
    "category": "client",
    "actions": ["home", "search"]
  }
}
```

1. **Tester la page** :

```bash
# Accéder à la page d'erreur
http://localhost:5173/error/418
```

1. **Vérifier les animations** : S'assurer que les animations GSAP fonctionnent correctement

### Modifier l'index de recherche

1. **Éditer `searchIndex.js`** :

```javascript
export const searchIndex = [
  {
    title: "Nouvelle page",
    path: "/nouvelle-page",
    keywords: ["nouveau", "page", "contenu"],
    description: "Description de la nouvelle page",
    icon: "star",
  },
];
```

1. **Tester la recherche** : Vérifier que la nouvelle page apparaît dans les suggestions

### Personnaliser les icônes d'erreur

1. **Modifier `ErrorIcon.jsx`** :

```javascript
const CustomSVG418 = () => (
  <svg className={`${iconSize} text-orange-500`} viewBox="0 0 24 24">
    {/* SVG personnalisé */}
  </svg>
);
```

1. **Ajouter la logique** :

```javascript
case '418':
  return <CustomSVG418 />;
```

## Tests et validation

### Tests manuels

1. **Codes d'erreur** : Tester tous les codes définis dans `errorMessages.json`
2. **Recherche** : Vérifier l'autocomplétion et la navigation clavier
3. **Suggestions** : Tester avec différentes URLs cassées
4. **Signalement** : Vérifier l'envoi au backend et le fallback
5. **Responsive** : Tester sur mobile, tablette et desktop

### Tests d'accessibilité

1. **Navigation clavier** : Tab, Shift+Tab, Enter, Escape
2. **Screen reader** : VoiceOver, NVDA
3. **Contraste** : Vérifier le ratio 4.5:1 minimum
4. **Zoom** : Tester avec zoom 200%
5. **prefers-reduced-motion** : Vérifier le mode sans animation

### Tests de performance

1. **Temps de rendu** : < 100ms pour le rendu initial
2. **Interactions** : < 50ms pour les interactions
3. **Animations** : 60fps constant
4. **Bundle size** : Vérifier l'impact sur la taille du bundle

## Déploiement

### Variables d'environnement

```env
# Optionnel : URL de l'API de signalement
REPORT_ERROR_API_URL=https://api.dkbuilding.fr/report-error

# Optionnel : Clé API pour l'authentification
REPORT_ERROR_API_KEY=your-api-key
```

### Configuration de production

1. **Désactiver les markers ScrollTrigger** :

```javascript
// Dans motion.js
export const scrollTriggerDefaults = {
  markers: false, // Production
  // ...
};
```

1. **Optimiser les images** : Utiliser WebP avec fallback PNG
2. **Minifier le code** : Utiliser les outils de build de Vite
3. **CDN** : Servir les assets statiques via CDN

## Dépannage

### Problèmes courants

1. **Animations qui ne se lancent pas** :
   - Vérifier que `useLayoutEffect` est utilisé
   - S'assurer que les refs sont correctement assignés
   - Vérifier la présence de `gsap.context()`

2. **Recherche qui ne fonctionne pas** :
   - Vérifier l'index dans `searchIndex.js`
   - S'assurer que le debounce est configuré
   - Vérifier les permissions du Clipboard API

3. **Suggestions incorrectes** :
   - Vérifier l'algorithme Levenshtein
   - Tester avec différentes URLs
   - Ajuster les seuils de distance

### Logs de débogage

```javascript
// Activer les logs en développement
if (process.env.NODE_ENV === "development") {
  console.log("Error page loaded:", { errorCode, errorData });
  console.log("Search results:", searchResults);
  console.log("URL suggestions:", urlSuggestions);
}
```

## Évolutions futures

### Fonctionnalités prévues

1. **Analytics** : Tracking des erreurs les plus fréquentes
2. **A/B Testing** : Tests de différentes versions de la page
3. **Internationalisation** : Support multilingue
4. **Thèmes** : Mode sombre/clair
5. **PWA** : Support hors ligne

### Améliorations techniques

1. **Cache intelligent** : Mise en cache des suggestions
2. **Service Worker** : Gestion des erreurs réseau
3. **WebAssembly** : Optimisation de l'algorithme Levenshtein
4. **GraphQL** : API plus flexible pour les données

## Support

Pour toute question ou problème :

- **Documentation technique** : Ce fichier
- **Issues** : Créer une issue sur le repository
- **Contact** : Équipe technique DK BUILDING

---

_Dernière mise à jour : 19 octobre 2025_
_Version : latest_
