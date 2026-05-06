/**
 * DrawListPage Tests
 * Tests for draw list page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DrawListPage from './DrawListPage';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'draw.results': 'نتائج السحوبات',
        'draw.weekly': 'أسبوعي',
        'draw.monthly': 'شهري',
        'draw.winners': 'فائز',
        'draw.totalPayout': 'إجمالي الجوائز',
        'draw.yourPrize': 'جائزتك',
        'draw.youWon': 'فزت!',
        'draw.noDrawsYet': 'لا توجد سحوبات بعد',
        'draw.noDrawsDescription': 'سيتم عرض نتائج السحوبات هنا',
        'filter.all': 'الكل',
        'errors.loadFailed': 'فشل في تحميل البيانات',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock usePageTitle
vi.mock('@/shared/hooks/usePageTitle', () => ({
  usePageTitle: vi.fn(),
}));

// Mock useNetworkStatus
vi.mock('@/shared/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => true,
}));

// Mock draw service
const mockUseDrawList = vi.fn();
vi.mock('../services/draw.service', () => ({
  useDrawList: () => mockUseDrawList(),
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('DrawListPage', () => {
  let queryClient: QueryClient;

  const renderDrawListPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DrawListPage />
        </BrowserRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton while fetching data', () => {
      mockUseDrawList.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderDrawListPage();
      expect(screen.getByText('نتائج السحوبات')).toBeInTheDocument();
      // Skeleton cards should be present
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    const mockDraws = [
      {
        draw_id: 'draw-1',
        draw_type: 'weekly',
        draw_date: '2024-01-15T18:00:00Z',
        status: 'finalized',
        total_winners: 5000,
        total_payout_iqd: 50000000,
      },
      {
        draw_id: 'draw-2',
        draw_type: 'monthly',
        draw_date: '2024-01-01T18:00:00Z',
        status: 'finalized',
        total_winners: 10000,
        total_payout_iqd: 100000000,
      },
    ];

    beforeEach(() => {
      mockUseDrawList.mockReturnValue({
        data: { draws_list: mockDraws },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render page title', () => {
      renderDrawListPage();
      expect(screen.getByRole('heading', { name: 'نتائج السحوبات' })).toBeInTheDocument();
    });

    it('should render filter tabs', () => {
      renderDrawListPage();
      expect(screen.getByText('الكل')).toBeInTheDocument();
      // Multiple elements with weekly/monthly text exist (filter tabs + badges)
      expect(screen.getAllByText('أسبوعي').length).toBeGreaterThan(0);
      expect(screen.getAllByText('شهري').length).toBeGreaterThan(0);
    });

    it('should render draw cards', () => {
      renderDrawListPage();
      // Check that draw cards are rendered (they contain dates)
      const cards = document.querySelectorAll('.rounded-xl');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should show total payout in draw cards', () => {
      renderDrawListPage();
      // Multiple payout labels exist
      const payoutLabels = screen.getAllByText('إجمالي الجوائز');
      expect(payoutLabels.length).toBeGreaterThan(0);
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockUseDrawList.mockReturnValue({
        data: { draws_list: [] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should show empty state when no draws', () => {
      renderDrawListPage();
      expect(screen.getByText('لا توجد سحوبات بعد')).toBeInTheDocument();
    });

    it('should show empty state description', () => {
      renderDrawListPage();
      expect(screen.getByText('سيتم عرض نتائج السحوبات هنا')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseDrawList.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
      });

      renderDrawListPage();
      expect(screen.getByText('فشل في تحميل البيانات')).toBeInTheDocument();
    });

    it('should have retry button in error state', () => {
      const mockRefetch = vi.fn();
      mockUseDrawList.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: mockRefetch,
      });

      renderDrawListPage();
      const retryButton = screen.getByRole('button');
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('filter functionality', () => {
    beforeEach(() => {
      mockUseDrawList.mockReturnValue({
        data: { draws_list: [] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should have all filter active by default', () => {
      renderDrawListPage();
      const allButton = screen.getByText('الكل');
      expect(allButton).toHaveClass('bg-brand-primary');
    });

    it('should change filter on click', () => {
      renderDrawListPage();

      const weeklyButton = screen.getByRole('button', { name: 'أسبوعي' });
      fireEvent.click(weeklyButton);

      expect(weeklyButton).toHaveClass('bg-brand-primary');
    });
  });
});
