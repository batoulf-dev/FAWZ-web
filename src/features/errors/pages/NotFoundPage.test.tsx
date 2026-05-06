/**
 * NotFoundPage Tests
 * Tests for 404 Not Found page
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'errors.notFound': 'الصفحة غير موجودة',
        'errors.notFoundDesc': 'الصفحة التي تبحث عنها غير موجودة',
        'errors.backToHome': 'العودة للرئيسية',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock usePageTitle hook
vi.mock('@/shared/hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

const renderWithRouter = (component: React.ReactElement): RenderResult => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('NotFoundPage', () => {
  describe('rendering', () => {
    it('should render the page', () => {
      renderWithRouter(<NotFoundPage />);
      expect(screen.getByText('404')).toBeInTheDocument();
    });

    it('should display 404 text prominently', () => {
      renderWithRouter(<NotFoundPage />);
      const heading = screen.getByText('404');
      expect(heading).toHaveClass('text-8xl', 'font-bold');
    });

    it('should display not found message', () => {
      renderWithRouter(<NotFoundPage />);
      expect(screen.getByText('الصفحة غير موجودة')).toBeInTheDocument();
    });

    it('should display description', () => {
      renderWithRouter(<NotFoundPage />);
      expect(screen.getByText('الصفحة التي تبحث عنها غير موجودة')).toBeInTheDocument();
    });
  });

  describe('navigation', () => {
    it('should have a link back to home', () => {
      renderWithRouter(<NotFoundPage />);
      const homeLink = screen.getByRole('link');
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should have back to home button', () => {
      renderWithRouter(<NotFoundPage />);
      expect(screen.getByRole('button', { name: /العودة للرئيسية/i })).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      renderWithRouter(<NotFoundPage />);
      // h1 for 404
      const h1 = screen.getByText('404');
      expect(h1.tagName).toBe('H1');
      // h2 for description
      const h2 = screen.getByText('الصفحة غير موجودة');
      expect(h2.tagName).toBe('H2');
    });
  });

  describe('styling', () => {
    it('should be centered on the page', () => {
      renderWithRouter(<NotFoundPage />);
      const container = screen.getByText('404').closest('div.min-h-dvh');
      expect(container).toHaveClass('flex', 'items-center', 'justify-center');
    });

    it('should have icon', () => {
      renderWithRouter(<NotFoundPage />);
      // The SearchX icon container
      const iconContainer = document.querySelector('.rounded-full.bg-brand-primary\\/10');
      expect(iconContainer).toBeInTheDocument();
    });
  });
});
