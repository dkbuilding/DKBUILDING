# Pages d'Erreur Dynamiques - DK BUILDING

## Vue d'ensemble

Le système de pages d'erreur dynamiques utilise un vocabulaire authentique de charpentier pour chaque code d'erreur HTTP. Chaque page est générée dynamiquement en fonction du code d'erreur fourni dans l'URL.

## Structure des fichiers

```
src/
├── data/
│   └── errorMessages.json          # Messages d'erreur avec vocabulaire de charpentier
├── pages/
│   ├── ErrorPage.jsx              # Composant principal des pages d'erreur
│   └── ErrorPageDemo.jsx          # Page de démonstration pour tester les erreurs
└── utils/
    └── errorUtils.js              # Utilitaires pour la gestion des erreurs
```

## Utilisation

### Navigation vers une page d'erreur

```javascript
import { navigateToError } from '../utils/errorUtils';

// Naviguer vers une page d'erreur 404
navigateToError('404', navigate);

// Naviguer vers une page d'erreur 500
navigateToError('500', navigate);
```

### Gestion des erreurs HTTP

```javascript
import { handleHttpError } from '../utils/errorUtils';

// Rediriger automatiquement selon le code de statut HTTP
handleHttpError(404, navigate);
handleHttpError(500, navigate);
```

### Obtenir les informations d'erreur

```javascript
import { getErrorInfo, getErrorType } from '../utils/errorUtils';

const errorInfo = getErrorInfo('404');
const errorType = getErrorType('404'); // 'client'
```

## Codes d'erreur supportés

### Codes 1xx (Information)

- **100** : Continuez, ça vient !
- **101** : Changement de plan en cours
- **102** : Traitement en arrière-plan

### Codes 2xx (Succès)

- **200** : Parfait ! Tout est en ordre
- **201** : Nouveau projet créé
- **202** : Demande acceptée
- **204** : Travail terminé

### Codes 3xx (Redirection)

- **300** : Plusieurs options disponibles
- **301** : Déménagement permanent
- **302** : Déplacement temporaire
- **303** : Voir ailleurs
- **304** : Rien n'a changé

### Codes 4xx (Erreur client)

- **400** : Mauvaise demande
- **401** : Accès refusé
- **403** : Accès interdit
- **404** : Page introuvable
- **405** : Méthode non autorisée
- **408** : Délai dépassé
- **409** : Conflit détecté
- **410** : Ressource supprimée
- **413** : Demande trop volumineuse
- **414** : URL trop longue
- **415** : Format non supporté
- **429** : Trop de demandes

### Codes 5xx (Erreur serveur)

- **500** : Panne d'outillage
- **501** : Fonctionnalité non implémentée
- **502** : Mauvaise passerelle
- **503** : Service indisponible
- **504** : Délai de réponse dépassé
- **505** : Version non supportée
- **507** : Espace de stockage insuffisant
- **508** : Boucle détectée
- **510** : Extension non implémentée
- **511** : Authentification réseau requise

## Fonctionnalités

### Comportements dynamiques

1. **Codes 1xx** : Affichage d'un loader avec délai de 2 secondes
2. **Codes 4xx** : Bouton "Retour en arrière" principal
3. **Codes 5xx** : Message d'information supplémentaire
4. **Autres codes** : Bouton "Retour à l'accueil" principal

### Actions disponibles

- **Actualiser** : Pour les codes 1xx
- **Retour en arrière** : Pour les codes 4xx
- **Retour à l'accueil** : Pour tous les autres codes
- **Accueil** : Bouton secondaire disponible

### Style DK BUILDING

- Dégradé bleu (`from-blue-900 via-blue-800 to-blue-700`)
- Police Foundation utilisée
- Animations GSAP compatibles
- Design responsive
- Icônes Lucide React

## Test et démonstration

Visitez `/error-demo` pour tester toutes les pages d'erreur disponibles.

## Exemples d'URL

- `/error/404` - Page introuvable
- `/error/500` - Erreur serveur
- `/error/200` - Succès
- `/error/301` - Redirection permanente

## Personnalisation

Pour ajouter de nouveaux codes d'erreur, modifiez le fichier `errorMessages.json` :

```json
{
  "nouveau_code": {
    "title": "Titre de l'erreur",
    "message": "Message principal",
    "description": "Description détaillée avec vocabulaire de charpentier",
    "icon": "🔧",
    "action": "Action suggérée"
  }
}
```

## Intégration avec le backend

Le système peut être intégré avec le backend pour rediriger automatiquement vers les pages d'erreur appropriées selon les codes de statut HTTP retournés par l'API.
