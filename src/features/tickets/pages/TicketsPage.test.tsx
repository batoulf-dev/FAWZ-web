/**
 * TicketsPage Tests
 * Tests for tickets page rendering
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import TicketsPage from './TicketsPage';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'tickets.myTickets': 'تذاكري',
        'tickets.noTickets': 'لا توجد تذاكر',
        'tickets.noTicketsDesc': 'لم تشتري أي تذاكر بعد',
        'tickets.browseDraws': 'تصفح السحوبات',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock usePageTitle
vi.mock('@/shared/hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

describe('TicketsPage', () => {
  const renderTicketsPage = (): RenderResult => {
    return render(
      <BrowserRouter>
        <TicketsPage />
      </BrowserRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the page title', () => {
      renderTicketsPage();
      expect(screen.getByRole('heading', { name: 'تذاكري' })).toBeInTheDocument();
    });

    it('should render empty state', () => {
      renderTicketsPage();
      expect(screen.getByText('لا توجد تذاكر')).toBeInTheDocument();
    });

    it('should render empty state description', () => {
      renderTicketsPage();
      expect(screen.getByText('لم تشتري أي تذاكر بعد')).toBeInTheDocument();
    });

    it('should render browse draws action button', () => {
      renderTicketsPage();
      expect(screen.getByText('تصفح السحوبات')).toBeInTheDocument();
    });

    it('should render ticket icon', () => {
      renderTicketsPage();
      // The ticket icon should be present in the empty state
      const icon = document.querySelector('.lucide-ticket');
      expect(icon).toBeInTheDocument();
    });
  });
});
