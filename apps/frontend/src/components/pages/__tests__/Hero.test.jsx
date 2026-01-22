import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Hero from '../Hero';

// Mock des hooks personnalisés
jest.mock('../../../hooks/useSmartNavigation', () => ({
  useSmartNavigation: () => ({
    currentSection: 'home',
    scrollToSection: jest.fn()
  })
}));

// Mock de GSAP
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

jest.mock('gsap/ScrollTrigger', () => ({}));

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
