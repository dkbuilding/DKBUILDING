# 📁 Components - Architecture et Organisation

## 🎯 **Vue d'ensemble**

Ce dossier contient tous les composants React du site web DK BUILDING, organisés par catégories fonctionnelles pour une meilleure maintenabilité et évolutivité.

## 📂 **Structure des dossiers**

```
components/
├── 📄 pages/                    # Composants de pages principales
├── 🧭 navigation/               # Composants de navigation
├── 🎨 ui/                      # Composants d'interface utilisateur
├── 🔒 security/                # Composants de sécurité
├── ❌ error/                    # Composants de gestion d'erreurs
└── 🎨 icons/                   # Composants d'icônes
```

## 📋 **Catégories détaillées**

### 📄 **pages/** - Composants de pages principales

**Rôle** : Composants représentant les sections principales du site

- `About.jsx` - Section "À propos"
- `Contact.jsx` - Section contact et formulaire
- `HealthPage.jsx` - Page de santé/monitoring
- `Hero.jsx` - Section hero principale
- `News.jsx` - Section actualités
- `Portfolio.jsx` - Section réalisations/portfolio
- `Services.jsx` - Section services

**Conventions** :

- Nommage : `PascalCase` avec suffixe descriptif
- Props : Interface claire avec PropTypes ou TypeScript
- Responsabilité : Une section = un composant

### 🧭 **navigation/** - Composants de navigation

**Rôle** : Tous les éléments de navigation et de menu

- `Navigation.jsx` - Barre de navigation principale
- `Sidebar.jsx` - Menu latéral mobile
- `SmartNavigationIndicator.jsx` - Indicateur de navigation intelligent

**Conventions** :

- Accessibilité : ARIA labels obligatoires
- Responsive : Mobile-first obligatoire
- Performance : Lazy loading pour les gros composants

### 🎨 **ui/** - Composants d'interface utilisateur

**Rôle** : Composants réutilisables et éléments d'interface

- `ContactSection.jsx` - Section contact réutilisable
- `Footer.jsx` - Pied de page
- `NoiseOverlay.jsx` - Overlay de bruit visuel
- `Preloader.jsx` - Écran de chargement

**Conventions** :

- Réutilisabilité : Props configurables
- Design System : Respect des tokens de design
- Performance : Optimisation des re-renders

### 🔒 **security/** - Composants de sécurité

**Rôle** : Système de verrouillage et contrôle d'accès

- `LockAccess/` - Système complet de verrouillage
  - `index.tsx` - Composant principal
  - `IPBlockedScreen.tsx` - Écran IP bloquée
  - `LockedScreen.tsx` - Écran verrouillé
  - `MaintenanceScreen.tsx` - Écran maintenance

**Conventions** :

- Sécurité : Validation côté client ET serveur
- UX : Messages clairs et informatifs
- Configuration : Centralisée dans `config/`

### ❌ **error/** - Composants de gestion d'erreurs

**Rôle** : Gestion des erreurs 404, 500, etc.

- `ErrorIcon.jsx` - Icônes d'erreur personnalisées
- `QuickNav.jsx` - Navigation alternative
- `ReportButton.jsx` - Signalement d'erreurs
- `SearchBar.jsx` - Barre de recherche
- `Suggestions.jsx` - Suggestions intelligentes

**Conventions** :

- UX : Expérience utilisateur optimale même en erreur
- Analytics : Tracking des erreurs
- Fallback : Solutions de contournement

### 🎨 **icons/** - Composants d'icônes

**Rôle** : Icônes personnalisées et composants d'icônes

- Actuellement vide, prêt pour les icônes custom

## 🔧 **Règles de développement**

### **Nommage des composants**

```javascript
// ✅ Bon
const UserProfile = () => { ... }
const ContactForm = () => { ... }
const NavigationMenu = () => { ... }

// ❌ Éviter
const userProfile = () => { ... }
const contact_form = () => { ... }
const nav = () => { ... }
```

### **Structure des fichiers**

```javascript
// 1. Imports externes
import React from 'react';
import { gsap } from 'gsap';

// 2. Imports internes
import { motionTokens } from '../../utils/motion';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';

// 3. Imports de composants
import CustomButton from '../ui/CustomButton';

// 4. Définition du composant
const MyComponent = ({ prop1, prop2 }) => {
  // Hooks
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => { ... }, []);
  
  // Handlers
  const handleClick = () => { ... };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 5. Export
export default MyComponent;
```

### **Props et interfaces**

```javascript
// Avec PropTypes
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  isVisible: PropTypes.bool,
  onAction: PropTypes.func
};

// Avec TypeScript
interface MyComponentProps {
  title: string;
  isVisible?: boolean;
  onAction?: () => void;
}
```

## 🚀 **Bonnes pratiques**

### **Performance**

- Utiliser `React.memo()` pour les composants coûteux
- Éviter les re-renders inutiles avec `useMemo()` et `useCallback()`
- Lazy loading pour les composants lourds

### **Accessibilité**

- Toujours inclure des `aria-label` appropriés
- Gestion du focus clavier
- Support des lecteurs d'écran

### **Responsive Design**

- Mobile-first obligatoire
- Breakpoints : 320px, 768px, 1024px, 1280px, 1600px
- Tests sur différents appareils

### **Animations GSAP**

- Utiliser `useLayoutEffect` pour les animations
- Cleanup avec `gsap.context()`
- Respecter `prefers-reduced-motion`

## 📦 **Imports simplifiés**

Utilisez les barrel exports pour simplifier les imports :

```javascript
// ✅ Avec barrel exports
import { Navigation, Sidebar } from './navigation';
import { Hero, About, Contact } from './pages';
import { Footer, Preloader } from './ui';

// ❌ Sans barrel exports
import Navigation from './navigation/Navigation';
import Sidebar from './navigation/Sidebar';
import Hero from './pages/Hero';
```

## 🧪 **Tests**

Chaque composant doit avoir ses tests unitaires dans `__tests__/` :

```
components/
├── pages/
│   ├── Hero.jsx
│   └── __tests__/
│       └── Hero.test.jsx
├── navigation/
│   ├── Navigation.jsx
│   └── __tests__/
│       └── Navigation.test.jsx
```

## 📈 **Évolutivité**

### **Ajouter un nouveau composant**

1. Identifier la catégorie appropriée
2. Créer le fichier avec le bon nommage
3. Suivre la structure standard
4. Ajouter les tests
5. Mettre à jour les barrel exports
6. Documenter dans ce README

### **Refactoring**

- Toujours maintenir la compatibilité des props
- Utiliser des migrations graduelles
- Tester après chaque modification

## 🔗 **Liens utiles**

- [Documentation React](https://react.dev/)
- [GSAP Documentation](https://greensock.com/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}
**Maintenu par** : Équipe DK BUILDING
