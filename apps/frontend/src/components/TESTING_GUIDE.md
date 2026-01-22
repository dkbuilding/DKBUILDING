# 🧪 Guide des Tests Unitaires - DK BUILDING Components

## 🎯 **Vue d'ensemble**

Ce guide définit les standards et conventions pour les tests unitaires des composants React du projet DK BUILDING.

## 📂 **Structure des tests**

```bash
components/
├── pages/
│   ├── Hero.jsx
│   └── __tests__/
│       ├── Hero.test.jsx
│       └── Hero.test.utils.js
├── navigation/
│   ├── Navigation.jsx
│   └── __tests__/
│       ├── Navigation.test.jsx
│       └── Navigation.test.utils.js
└── ui/
    ├── Button.jsx
    └── __tests__/
        ├── Button.test.jsx
        └── Button.test.utils.js
```

## 🔧 **Configuration Jest**

### **Setup de base**

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}'
  ]
};
```

### **Setup des tests**

```javascript
// src/setupTests.js
import '@testing-library/jest-dom';

// Mock GSAP
jest.mock('gsap', () => ({
  timeline: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    to: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis()
  })),
  context: jest.fn((callback) => {
    callback();
    return { revert: jest.fn() };
  }),
  registerPlugin: jest.fn()
}));

// Mock ScrollTrigger
jest.mock('gsap/ScrollTrigger', () => ({}));

// Mock des hooks personnalisés
jest.mock('./hooks/useSmartNavigation', () => ({
  useSmartNavigation: () => ({
    currentSection: 'home',
    scrollToSection: jest.fn()
  })
}));
```

## 📋 **Conventions de tests**

### **Nommage des fichiers**

```javascript
// ✅ CORRECT
Hero.test.jsx
Navigation.test.jsx
Button.test.jsx

// ❌ INCORRECT
hero.test.jsx
test.jsx
component.test.jsx
```

### **Structure des tests**

```javascript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MyComponent from '../MyComponent';

describe('MyComponent', () => {
  describe('Rendering', () => {
    it('should render correctly', () => {
      // Test de rendu
    });
  });

  describe('Interactions', () => {
    it('should handle user interactions', () => {
      // Test d'interactions
    });
  });

  describe('Accessibility', () => {
    it('should be accessible', () => {
      // Test d'accessibilité
    });
  });

  describe('Edge Cases', () => {
    it('should handle edge cases', () => {
      // Test de cas limites
    });
  });
});
```

## 🎨 **Tests par catégorie de composant**

### **📄 Pages Components**

```javascript
describe('Hero Component', () => {
  describe('Rendering', () => {
    it('should render hero title correctly', () => {
      render(<Hero />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('font-foundation-bold');
    });

    it('should display subtitle when provided', () => {
      render(<Hero subtitle="Test subtitle" />);
      
      const subtitle = screen.getByText('Test subtitle');
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle CTA button click', () => {
      const mockOnAction = jest.fn();
      render(<Hero onAction={mockOnAction} />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      fireEvent.click(ctaButton);
      
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('GSAP Animations', () => {
    it('should initialize GSAP animations', () => {
      render(<Hero />);
      
      // Vérifier que GSAP est appelé
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });
});
```

### **🧭 Navigation Components**

```javascript
describe('Navigation Component', () => {
  const defaultProps = {
    onToggleSidebar: jest.fn(),
    isSidebarOpen: false,
    footerRef: { current: null }
  };

  describe('Rendering', () => {
    it('should render navigation bar', () => {
      render(<Navigation {...defaultProps} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toBeInTheDocument();
    });

    it('should display logo', () => {
      render(<Navigation {...defaultProps} />);
      
      const logo = screen.getByAltText(/dk building/i);
      expect(logo).toBeInTheDocument();
    });
  });

  describe('State Management', () => {
    it('should show close button when sidebar is open', () => {
      render(<Navigation {...defaultProps} isSidebarOpen={true} />);
      
      const closeButton = screen.getByRole('button', { name: /fermer/i });
      expect(closeButton).toBeInTheDocument();
    });
  });
});
```

### **🎨 UI Components**

```javascript
describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render with default props', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-dk-yellow');
    });

    it('should render with custom variant', () => {
      render(<Button variant="secondary">Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      expect(button).toHaveClass('bg-dk-gray-800');
    });
  });

  describe('Accessibility', () => {
    it('should be keyboard navigable', () => {
      render(<Button>Click me</Button>);
      
      const button = screen.getByRole('button', { name: /click me/i });
      button.focus();
      
      expect(button).toHaveFocus();
    });

    it('should have proper ARIA attributes', () => {
      render(<Button aria-label="Custom label">Click me</Button>);
      
      const button = screen.getByRole('button', { name: /custom label/i });
      expect(button).toBeInTheDocument();
    });
  });
});
```

### **🔒 Security Components**

```javascript
describe('LockAccess Component', () => {
  describe('Rendering', () => {
    it('should render maintenance screen when locked', () => {
      render(<LockAccess isLocked={true} />);
      
      const maintenanceScreen = screen.getByText(/maintenance/i);
      expect(maintenanceScreen).toBeInTheDocument();
    });

    it('should render children when unlocked', () => {
      render(
        <LockAccess isLocked={false}>
          <div>Content</div>
        </LockAccess>
      );
      
      const content = screen.getByText('Content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Security Logic', () => {
    it('should validate access permissions', () => {
      // Test de la logique de sécurité
    });
  });
});
```

### **❌ Error Components**

```javascript
describe('ErrorIcon Component', () => {
  describe('Rendering', () => {
    it('should render correct icon for 404 error', () => {
      render(<ErrorIcon code="404" />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
    });

    it('should render correct icon for 500 error', () => {
      render(<ErrorIcon code="500" />);
      
      const icon = screen.getByRole('img', { hidden: true });
      expect(icon).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels for screen readers', () => {
      render(<ErrorIcon code="404" />);
      
      const icon = screen.getByLabelText(/erreur 404/i);
      expect(icon).toBeInTheDocument();
    });
  });
});
```

## 🛠️ **Utilitaires de test**

### **Helpers personnalisés**

```javascript
// test.utils.js
import { render } from '@testing-library/react';
import { ThemeProvider } from '../providers/ThemeProvider';

export const renderWithTheme = (component, options = {}) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>,
    options
  );
};

export const createMockProps = (overrides = {}) => ({
  onAction: jest.fn(),
  isVisible: true,
  className: '',
  ...overrides
});
```

### **Mocks réutilisables**

```javascript
// mocks/hooks.js
export const mockUseSmartNavigation = (overrides = {}) => ({
  currentSection: 'home',
  scrollToSection: jest.fn(),
  ...overrides
});

export const mockUseScroll = (overrides = {}) => ({
  scrollY: 0,
  isScrolling: false,
  ...overrides
});
```

## 📊 **Métriques de couverture**

### **Objectifs de couverture**

- **Statements** : 90%+
- **Branches** : 85%+
- **Functions** : 90%+
- **Lines** : 90%+

### **Configuration de couverture**

```javascript
// jest.config.js
module.exports = {
  collectCoverageFrom: [
    'src/components/**/*.{js,jsx,ts,tsx}',
    '!src/components/**/*.stories.{js,jsx,ts,tsx}',
    '!src/components/**/__tests__/**',
    '!src/components/**/index.js'
  ],
  coverageThreshold: {
    global: {
      branches: 85,
      functions: 90,
      lines: 90,
      statements: 90
    }
  }
};
```

## 🚀 **Bonnes pratiques**

### **Tests efficaces**

- Tester le comportement, pas l'implémentation
- Utiliser des sélecteurs accessibles (`getByRole`, `getByLabelText`)
- Éviter les tests trop spécifiques aux détails d'implémentation
- Tester les cas d'erreur et les cas limites

### **Performance des tests**

- Utiliser `screen` au lieu de `container`
- Éviter les `waitFor` inutiles
- Mocker les dépendances externes
- Utiliser des données de test minimales

### **Maintenance**

- Nommer les tests de manière descriptive
- Grouper les tests par fonctionnalité
- Réutiliser les utilitaires de test
- Documenter les tests complexes

## 📝 **Exemple complet**

```javascript
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../Hero';
import { mockUseSmartNavigation } from '../../../mocks/hooks';

// Mock des hooks
jest.mock('../../../hooks/useSmartNavigation', () => ({
  useSmartNavigation: () => mockUseSmartNavigation()
}));

describe('Hero Component', () => {
  const defaultProps = {
    title: 'Test Title',
    subtitle: 'Test Subtitle',
    onAction: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render hero section with title and subtitle', () => {
      render(<Hero {...defaultProps} />);
      
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Title');
      expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    });

    it('should render CTA button', () => {
      render(<Hero {...defaultProps} />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onAction when CTA button is clicked', () => {
      const mockOnAction = jest.fn();
      render(<Hero {...defaultProps} onAction={mockOnAction} />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      fireEvent.click(ctaButton);
      
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA structure', () => {
      render(<Hero {...defaultProps} />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<Hero {...defaultProps} />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      ctaButton.focus();
      
      expect(ctaButton).toHaveFocus();
    });
  });
});
```

---

**Dernière mise à jour** : {new Date().toLocaleDateString('fr-FR')}
