import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Navigation from '../Navigation';

// Mock des hooks personnalisés
jest.mock('../../../hooks/useScroll', () => ({
  useScroll: () => ({
    scrollY: 0,
    isScrolling: false
  })
}));

jest.mock('../../../hooks/useFooterProximity', () => ({
  useFooterProximity: () => ({
    isNearFooter: false,
    footerDistance: 1000
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

    it('should render menu button', () => {
      render(<Navigation {...defaultProps} />);
      
      const menuButton = screen.getByRole('button', { name: /menu/i });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('should call onToggleSidebar when menu button is clicked', () => {
      const mockToggle = jest.fn();
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
