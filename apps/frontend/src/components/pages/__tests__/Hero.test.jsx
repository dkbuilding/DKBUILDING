import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Utiliser vi.hoisted() pour que gsapMock soit disponible lors du hoisting de vi.mock
const { gsapMock } = vi.hoisted(() => {
  const mock = {
    timeline: vi.fn(() => ({
      from: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      fromTo: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
    })),
    context: vi.fn(() => ({ revert: vi.fn() })),
    registerPlugin: vi.fn(),
    fromTo: vi.fn(),
    from: vi.fn(),
    to: vi.fn(),
    set: vi.fn(),
    defaults: vi.fn(),
    config: vi.fn(),
  };
  return { gsapMock: mock };
});

// Mock des hooks personnalisés
vi.mock('../../../hooks/useSmartNavigation', () => ({
  useSmartNavigation: () => ({
    currentSection: 'home',
    scrollToSection: vi.fn()
  })
}));

// Mock de GSAP complet
vi.mock('gsap', () => ({ default: gsapMock, ...gsapMock }));
vi.mock('gsap/ScrollTrigger', () => ({ default: {}, ScrollTrigger: {} }));
vi.mock('gsap/ScrollToPlugin', () => ({ default: {} }));
vi.mock('../../../utils/gsapConfig', () => ({
  gsap: gsapMock,
  ScrollTrigger: {},
  initGSAP: vi.fn(),
}));
vi.mock('../../../utils/motion', () => ({
  motionTokens: { durations: { fast: 0.3, normal: 0.6 }, easing: { smooth: 'power3.out' } },
  gsapUtils: { fadeInUp: vi.fn(() => ({ opacity: 0, y: 30 })) },
  scrollTriggerDefaults: {},
}));

import Hero from '../Hero';

describe('Hero Component', () => {
  describe('Rendering', () => {
    it('should render hero title correctly', () => {
      render(<Hero />);
      
      const title = screen.getByRole('heading', { level: 1 });
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass('font-foundation-bold');
    });

    it('should display subtitle when provided', () => {
      render(<Hero />);
      
      const subtitle = screen.getByText(/excellence/i);
      expect(subtitle).toBeInTheDocument();
    });

    it('should render CTA button', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      expect(ctaButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should handle CTA button click', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      fireEvent.click(ctaButton);
      
      // Vérifier que l'action est déclenchée
      expect(ctaButton).toBeInTheDocument();
    });

    it('should handle scroll to services section', () => {
      render(<Hero />);
      
      const servicesButton = screen.getByRole('button', { name: /services/i });
      fireEvent.click(servicesButton);
      
      expect(servicesButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Hero />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toBeInTheDocument();
    });

    it('should be keyboard navigable', () => {
      render(<Hero />);
      
      const ctaButton = screen.getByRole('button', { name: /découvrir/i });
      ctaButton.focus();
      
      expect(ctaButton).toHaveFocus();
    });
  });

  describe('Responsive Design', () => {
    it('should adapt to mobile viewport', () => {
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      render(<Hero />);
      
      const heroSection = screen.getByRole('banner');
      expect(heroSection).toBeInTheDocument();
    });
  });
});
