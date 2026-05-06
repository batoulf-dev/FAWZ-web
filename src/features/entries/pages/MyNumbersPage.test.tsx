/**
 * MyNumbersPage Tests
 * Tests for entry history page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MyNumbersPage from './MyNumbersPage';

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
        'entries.myNumbers': 'أرقامي',
        'entries.thisWeek': 'هذا الأسبوع',
        'entries.total': 'إجمالي',
        'entries.noEntriesYet': 'لا توجد أرقام بعد',
        'entries.startPayingToEarn': 'ابدأ بالدفع لكسب أرقام',
        'entries.learnHow': 'تعرف على الطريقة',
        'entries.sourceTransaction': 'معاملة',
        'entries.sourceChallenge': 'تحدي',
        'entries.sourceReferral': 'إحالة',
        'entries.sourceRetroactive': 'بأثر رجعي',
        'entries.sourceBonus': 'مكافأة',
        'entries.sourceOnboarding': 'تسجيل',
        'entries.active': 'نشط',
        'entries.won': 'فائز',
        'filter.all': 'الكل',
        'common.loadMore': 'تحميل المزيد',
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

// Mock entries service
const mockUseEntrySummary = vi.fn();
const mockUseInfiniteEntries = vi.fn();
vi.mock('../services/entries.service', () => ({
  useEntrySummary: () => mockUseEntrySummary(),
  useInfiniteEntries: () => mockUseInfiniteEntries(),
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('MyNumbersPage', () => {
  let queryClient: QueryClient;

  const renderMyNumbersPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <MyNumbersPage />
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
      mockUseEntrySummary.mockReturnValue({
        data: undefined,
        isLoading: true,
      });
      mockUseInfiniteEntries.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      renderMyNumbersPage();
      expect(screen.getByText('أرقامي')).toBeInTheDocument();
      // Skeleton elements should be present
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    const mockEntries = [
      {
        fawz_entry_id: 'entry-1',
        entry_number: '1234567890',
        source: 'transaction',
        draw_week: 'الأسبوع 1',
        created_at: '2024-01-15T10:00:00Z',
        outcome: 'active',
      },
      {
        fawz_entry_id: 'entry-2',
        entry_number: '0987654321',
        source: 'challenge',
        draw_week: 'الأسبوع 1',
        created_at: '2024-01-14T10:00:00Z',
        outcome: 'won',
        prize_iqd: 10000,
        outcome_draw_id: 'draw-1',
      },
    ];

    beforeEach(() => {
      mockUseEntrySummary.mockReturnValue({
        data: {
          entries_this_week: 47,
          total_entries: 150,
        },
        isLoading: false,
      });
      mockUseInfiniteEntries.mockReturnValue({
        data: { pages: [{ fawz_entries_list: mockEntries }] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });
    });

    it('should render page title', () => {
      renderMyNumbersPage();
      expect(screen.getByRole('heading', { name: 'أرقامي' })).toBeInTheDocument();
    });

    it('should render summary card', () => {
      renderMyNumbersPage();
      // Summary card with gradient background should be present
      const gradientCard = document.querySelector('.bg-gradient-to-r');
      expect(gradientCard).toBeInTheDocument();
    });

    it('should render filter tabs', () => {
      renderMyNumbersPage();
      // Filter tabs - use getAllByText since some labels appear in entries too
      expect(screen.getByRole('button', { name: 'الكل' })).toBeInTheDocument();
      expect(screen.getAllByText('معاملة').length).toBeGreaterThan(0);
      expect(screen.getAllByText('تحدي').length).toBeGreaterThan(0);
    });

    it('should render entry cards', () => {
      renderMyNumbersPage();
      // Entry numbers should be displayed (formatted)
      const cards = document.querySelectorAll('.rounded-xl');
      expect(cards.length).toBeGreaterThan(0);
    });

    it('should show won badge for winning entries', () => {
      renderMyNumbersPage();
      expect(screen.getByText('فائز')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockUseEntrySummary.mockReturnValue({
        data: {
          entries_this_week: 0,
          total_entries: 0,
        },
        isLoading: false,
      });
      mockUseInfiniteEntries.mockReturnValue({
        data: { pages: [{ fawz_entries_list: [] }] },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });
    });

    it('should show empty state when no entries', () => {
      renderMyNumbersPage();
      expect(screen.getByText('لا توجد أرقام بعد')).toBeInTheDocument();
    });

    it('should show action button in empty state', () => {
      renderMyNumbersPage();
      expect(screen.getByText('تعرف على الطريقة')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseEntrySummary.mockReturnValue({
        data: undefined,
        isLoading: false,
      });
      mockUseInfiniteEntries.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
        fetchNextPage: vi.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
      });

      renderMyNumbersPage();
      expect(screen.getByText('فشل في تحميل البيانات')).toBeInTheDocument();
    });
  });

  describe('load more', () => {
    it('should show load more button when has next page', () => {
      mockUseEntrySummary.mockReturnValue({
        data: { entries_this_week: 47, total_entries: 150 },
        isLoading: false,
      });
      mockUseInfiniteEntries.mockReturnValue({
        data: {
          pages: [
            {
              fawz_entries_list: [
                {
                  fawz_entry_id: 'entry-1',
                  entry_number: '1234567890',
                  source: 'transaction',
                  draw_week: 'الأسبوع 1',
                  created_at: '2024-01-15T10:00:00Z',
                  outcome: 'active',
                },
              ],
            },
          ],
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
        fetchNextPage: vi.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
      });

      renderMyNumbersPage();
      expect(screen.getByText('تحميل المزيد')).toBeInTheDocument();
    });
  });
});
