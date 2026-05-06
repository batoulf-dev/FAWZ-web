/**
 * DrawDetailPage Tests
 * Tests for draw detail page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DrawDetailPage from './DrawDetailPage';

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
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'draw.drawDetail': 'تفاصيل السحب',
        'draw.weekly': 'أسبوعي',
        'draw.monthly': 'شهري',
        'draw.winners': 'فائز',
        'draw.winningNumbers': 'الأرقام الفائزة',
        'draw.winningNumber': `الرقم الفائز ${params?.index || ''}`,
        'draw.jackpot': 'الجائزة الكبرى',
        'draw.jackpotClaimed': 'تم الفوز بالجائزة الكبرى',
        'draw.jackpotRolledOver': 'انتقلت الجائزة للسحب القادم',
        'draw.winnerSummary': 'ملخص الفائزين',
        'draw.yourNumbers': 'أرقامك',
        'draw.noMatchingNumbers': 'لا توجد أرقام مطابقة',
        'draw.notFound': 'السحب غير موجود',
        'draw.tierLast3': 'آخر 3 أرقام',
        'draw.tierLast5': 'آخر 5 أرقام',
        'draw.tierLast7': 'آخر 7 أرقام',
        'draw.tierLast10': 'آخر 10 أرقام',
        'draw.tierJackpot': 'الجائزة الكبرى',
        'draw.status.finalized': 'مكتمل',
        'draw.status.scheduled': 'مجدول',
        'common:back': 'رجوع',
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
const mockUseDraw = vi.fn();
const mockUseDrawWinners = vi.fn();
vi.mock('../services/draw.service', () => ({
  useDraw: (id: string, enabled: boolean) => mockUseDraw(id, enabled),
  useDrawWinners: (id: string, enabled: boolean) => mockUseDrawWinners(id, enabled),
}));

describe('DrawDetailPage', () => {
  let queryClient: QueryClient;

  const renderDrawDetailPage = (drawId = 'draw-123'): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/draws/${drawId}`]}>
          <Routes>
            <Route path="/draws/:drawId" element={<DrawDetailPage />} />
          </Routes>
        </MemoryRouter>
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

    mockUseDrawWinners.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton while fetching data', () => {
      mockUseDraw.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderDrawDetailPage();
      // Skeleton elements should be present
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    const mockDraw = {
      draw_id: 'draw-123',
      draw_type: 'weekly',
      draw_date: '2024-01-15T18:00:00Z',
      status: 'finalized',
      total_winners: 5000,
      total_payout_iqd: 50000000,
      jackpot_rollover_iqd: 100000000,
      jackpot_claimed: false,
      winning_number_1: 1234567890,
      winning_number_2: 9876543210,
      winning_number_3: 5678901234,
    };

    beforeEach(() => {
      mockUseDraw.mockReturnValue({
        data: mockDraw,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render back button', () => {
      renderDrawDetailPage();
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });

    it('should render draw type badge', () => {
      renderDrawDetailPage();
      expect(screen.getByText('أسبوعي')).toBeInTheDocument();
    });

    it('should render draw status badge', () => {
      renderDrawDetailPage();
      expect(screen.getByText('مكتمل')).toBeInTheDocument();
    });

    it('should render winning numbers section', () => {
      renderDrawDetailPage();
      expect(screen.getByText('الأرقام الفائزة')).toBeInTheDocument();
    });

    it('should render jackpot section', () => {
      renderDrawDetailPage();
      // Multiple elements exist - use getAllByText
      const jackpotTexts = screen.getAllByText('الجائزة الكبرى');
      expect(jackpotTexts.length).toBeGreaterThan(0);
    });

    it('should show jackpot rolled over message when not claimed', () => {
      renderDrawDetailPage();
      expect(screen.getByText('انتقلت الجائزة للسحب القادم')).toBeInTheDocument();
    });

    it('should render winner summary section', () => {
      renderDrawDetailPage();
      expect(screen.getByText('ملخص الفائزين')).toBeInTheDocument();
    });

    it('should render tier summaries', () => {
      renderDrawDetailPage();
      expect(screen.getByText('آخر 3 أرقام')).toBeInTheDocument();
      expect(screen.getByText('آخر 5 أرقام')).toBeInTheDocument();
      expect(screen.getByText('آخر 7 أرقام')).toBeInTheDocument();
    });

    it('should render your numbers section', () => {
      renderDrawDetailPage();
      expect(screen.getByText('أرقامك')).toBeInTheDocument();
    });

    it('should show no matching numbers message when user has no matches', () => {
      renderDrawDetailPage();
      expect(screen.getByText('لا توجد أرقام مطابقة')).toBeInTheDocument();
    });
  });

  describe('jackpot claimed state', () => {
    it('should show jackpot claimed message when jackpot is claimed', () => {
      mockUseDraw.mockReturnValue({
        data: {
          draw_id: 'draw-123',
          draw_type: 'weekly',
          draw_date: '2024-01-15T18:00:00Z',
          status: 'finalized',
          total_winners: 5000,
          total_payout_iqd: 50000000,
          jackpot_rollover_iqd: 100000000,
          jackpot_claimed: true,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderDrawDetailPage();
      expect(screen.getByText('تم الفوز بالجائزة الكبرى')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseDraw.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
      });

      renderDrawDetailPage();
      expect(screen.getByText('فشل في تحميل البيانات')).toBeInTheDocument();
    });
  });

  describe('not found state', () => {
    it('should show not found state when draw is null', () => {
      mockUseDraw.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderDrawDetailPage();
      expect(screen.getByText('السحب غير موجود')).toBeInTheDocument();
    });
  });
});
