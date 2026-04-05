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
vi.mock('../../../hooks/useScroll', () => ({
  useScroll: () => ({
    scrollY: 0,
    isScrolling: false
  })
}));

vi.mock('../../../hooks/useFooterProximity', () => ({
  useFooterProximity: () => ({
    isNearFooter: false,
    footerDistance: 1000
  })
}));

// Mock de GSAP complet
vi.mock('gsap', () => ({ default: gsapMock, ...gsapMock }));
vi.mock('gsap/ScrollTrigger', () => ({ default: {}, ScrollTrigger: {} }));
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

import Navigation from '../Navigation';

describe('Navigation Component', () => {
  const defaultProps = {
    onToggleSidebar: vi.fn(),
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

    it('should render menu button', () => {
      render(<Navigation {...defaultProps} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onToggleSidebar when menu button is clicked', () => {
      const mockToggle = vi.fn();
      render(<Navigation {...defaultProps} onToggleSidebar={mockToggle} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      fireEvent.click(menuButton);
      
      expect(mockToggle).toHaveBeenCalledTimes(1);
    });

    it('should show close button when sidebar is open', () => {
      render(<Navigation {...defaultProps} isSidebarOpen={true} />);
      
      const closeButton = screen.getByRole('button', { name: /fermer/i });
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Navigation {...defaultProps} />);
      
      const nav = screen.getByRole('navigation');
      expect(nav).toHaveAttribute('aria-label', 'Navigation principale');
    });

    it('should be keyboard navigable', () => {
      render(<Navigation {...defaultProps} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      menuButton.focus();
      
      expect(menuButton).toHaveFocus();
    });
  });
});
