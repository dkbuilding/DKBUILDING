# 📝 Conventions de Nommage - DK BUILDING Components

## 🎯 **Règles générales**

### **Composants React**

```javascript
// ✅ CORRECT - PascalCase avec nom descriptif
const UserProfile = () => { ... }
const ContactForm = () => { ... }
const NavigationMenu = () => { ... }
const ErrorBoundary = () => { ... }

// ❌ INCORRECT - Éviter ces patterns
const userProfile = () => { ... }        // camelCase
const contact_form = () => { ... }       // snake_case
const nav = () => { ... }                // Trop court
const Component1 = () => { ... }         // Nombre générique
```

### **Fichiers de composants**

```
// ✅ CORRECT
Hero.jsx
ContactForm.jsx
NavigationMenu.jsx
ErrorBoundary.jsx

// ❌ INCORRECT
hero.jsx
contact-form.jsx
nav.jsx
component1.jsx
```

## 📂 **Conventions par catégorie**

### **📄 Pages** (`components/pages/`)

**Pattern** : `[SectionName].jsx`

```javascript
// ✅ Exemples
About.jsx          // Section "À propos"
Contact.jsx        // Section contact
Hero.jsx           // Section hero
Services.jsx       // Section services
Portfolio.jsx      // Section portfolio
HealthPage.jsx     // Page de santé
```

### **🧭 Navigation** (`components/navigation/`)

**Pattern** : `[ElementType].jsx`

```javascript
// ✅ Exemples
Navigation.jsx              // Barre de navigation principale
Sidebar.jsx                 // Menu latéral
SmartNavigationIndicator.jsx // Indicateur intelligent
Breadcrumb.jsx              // Fil d'Ariane
Pagination.jsx              // Pagination
```

### **🎨 UI Components** (`components/ui/`)

**Pattern** : `[ComponentName].jsx`

```javascript
// ✅ Exemples
Button.jsx                  // Bouton générique
Modal.jsx                   // Modal/overlay
Card.jsx                    // Carte
Footer.jsx                  // Pied de page
Preloader.jsx               // Écran de chargement
NoiseOverlay.jsx            // Overlay de bruit
```

### **🔒 Security** (`components/security/`)

**Pattern** : `[SecurityType].jsx` ou dossier `[SystemName]/`

```javascript
// ✅ Exemples
LockAccess/                 // Système de verrouillage
├── index.tsx              // Point d'entrée principal
├── IPBlockedScreen.tsx    // Écran IP bloquée
├── LockedScreen.tsx       // Écran verrouillé
└── MaintenanceScreen.tsx  // Écran maintenance

AuthGuard.jsx              // Garde d'authentification
PermissionGate.jsx         // Contrôle de permissions
```

### **❌ Error Handling** (`components/error/`)

**Pattern** : `[ErrorType].jsx`

```javascript
// ✅ Exemples
ErrorIcon.jsx              // Icônes d'erreur
ErrorBoundary.jsx          // Boundary d'erreur
NotFoundPage.jsx           // Page 404
ServerErrorPage.jsx        // Page 500
ErrorFallback.jsx          // Fallback d'erreur
```

### **🎨 Icons** (`components/icons/`)

**Pattern** : `[IconName].jsx` ou `[Category].jsx`

```javascript
// ✅ Exemples
Logo.jsx                   // Logo principal
BrandIcon.jsx              // Icône de marque
SocialIcon.jsx             // Icône sociale
UIIcon.jsx                 // Icône d'interface
CustomIcon.jsx             // Icône personnalisée
```

## 🔧 **Conventions techniques**

### **Props et interfaces**

```javascript
// ✅ CORRECT - Props descriptives
interface UserProfileProps {
  userId: string;
  isEditable?: boolean;
  onSave?: (data: UserData) => void;
  className?: string;
}

// ❌ INCORRECT - Props génériques
interface Props {
  id: string;
  edit?: boolean;
  cb?: Function;
  cls?: string;
}
```

### **Hooks personnalisés**

```javascript
// ✅ CORRECT - use[Functionality]
const useSmartNavigation = () => { ... }
const useScroll = () => { ... }
const useLockAccess = () => { ... }

// ❌ INCORRECT
const smartNavigation = () => { ... }
const scrollHook = () => { ... }
const lock = () => { ... }
```

### **Variables et fonctions**

```javascript
// ✅ CORRECT - camelCase descriptif
const [isLoading, setIsLoading] = useState(false);
const handleSubmit = () => { ... }
const userData = { ... }

// ❌ INCORRECT
const [loading, setLoading] = useState(false);  // Trop court
const submit = () => { ... }                    // Trop court
const data = { ... }                            // Trop générique
```

## 📋 **Conventions de structure**

### **Ordre des imports**

```javascript
// 1. React et hooks
import React, { useState, useEffect } from 'react';

// 2. Bibliothèques tierces
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 3. Imports internes - utils et hooks
import { motionTokens } from '../../utils/motion';
import { useSmartNavigation } from '../../hooks/useSmartNavigation';

// 4. Imports de composants
import CustomButton from '../ui/CustomButton';

// 5. Imports de types (TypeScript)
import type { ComponentProps } from './types';
```

### **Structure du composant**

```javascript
const MyComponent = ({ prop1, prop2 }) => {
  // 1. Hooks d'état
  const [state, setState] = useState();
  
  // 2. Hooks personnalisés
  const customHook = useCustomHook();
  
  // 3. Effects
  useEffect(() => { ... }, []);
  
  // 4. Handlers
  const handleAction = () => { ... };
  
  // 5. Render helpers
  const renderContent = () => { ... };
  
  // 6. Render principal
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 7. PropTypes ou export
export default MyComponent;
```

## 🎨 **Conventions CSS/Tailwind**

### **Classes CSS**

```javascript
// ✅ CORRECT - Classes descriptives
className="bg-dk-black text-white font-foundation-bold"
className="hover:bg-dk-yellow transition-colors duration-300"
className="flex items-center justify-between space-x-4"

// ❌ INCORRECT - Classes génériques
className="bg-black text-white font-bold"
className="hover:bg-yellow"
className="flex justify-between"
```

### **Variables CSS**

```css
/* ✅ CORRECT - Préfixe dk- pour les couleurs */
--dk-black: #000000;
--dk-yellow: #FFD700;
--dk-gray-800: #1f2937;

/* ❌ INCORRECT - Pas de préfixe */
--black: #000000;
--yellow: #FFD700;
```

## 🧪 **Conventions de tests**

### **Fichiers de tests**

```
components/
├── Hero.jsx
└── __tests__/
    └── Hero.test.jsx
```

### **Nommage des tests**

```javascript
// ✅ CORRECT - Descriptif et structuré
describe('Hero Component', () => {
  describe('Rendering', () => {
    it('should render hero title correctly', () => { ... });
    it('should display CTA button when provided', () => { ... });
  });
  
  describe('Interactions', () => {
    it('should handle button click events', () => { ... });
  });
});

// ❌ INCORRECT - Trop générique
describe('Hero', () => {
  it('works', () => { ... });
  it('button', () => { ... });
});
```

## 📚 **Documentation**

### **Commentaires JSDoc**

```javascript
/**
 * Composant Hero - Section principale de la page d'accueil
 * @param {Object} props - Props du composant
 * @param {string} props.title - Titre principal
 * @param {string} props.subtitle - Sous-titre
 * @param {Function} props.onAction - Callback pour les actions
 * @returns {JSX.Element} Composant Hero rendu
 */
const Hero = ({ title, subtitle, onAction }) => {
  // ...
};
```

## ✅ **Checklist de validation**

Avant de créer un nouveau composant, vérifiez :

- [ ] Nom en PascalCase et descriptif
- [ ] Fichier dans le bon dossier selon la catégorie
- [ ] Props avec types appropriés
- [ ] Imports dans le bon ordre
- [ ] Structure du composant respectée
- [ ] Classes CSS avec préfixe dk-
- [ ] Tests unitaires créés
- [ ] Documentation JSDoc ajoutée
- [ ] Barrel export mis à jour

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}
