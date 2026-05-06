/**
 * LiveDrawPage Tests
 * Tests for live draw page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LiveDrawPage from './LiveDrawPage';

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
        'draw.liveDraw': 'السحب المباشر',
        'draw.weeklyDraw': 'السحب الأسبوعي',
        'draw.monthlyDraw': 'السحب الشهري',
        'draw.connected': 'متصل',
        'draw.disconnected': 'غير متصل',
        'draw.slowConnection': 'اتصال بطيء',
        'draw.winningNumber': `الرقم الفائز ${params?.index || ''}`,
        'draw.viewersWatching': `${params?.count || 0} مشاهد`,
        'draw.entryPoolSize': 'حجم مجمع المشاركات',
        'draw.noActiveDraw': 'لا يوجد سحب نشط حالياً',
        'draw.offlineMessage': 'أنت غير متصل بالإنترنت',
        'draw.youWon': 'فزت!',
        'draw.shareWin': 'شارك فوزك',
        'draw.viewFullResults': 'عرض النتائج الكاملة',
        'draw.drawEnded': 'انتهى السحب',
        'draw.inviteFriends': 'ادعُ أصدقاءك',
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
const mockUseNetworkStatus = vi.fn();
vi.mock('@/shared/hooks/useNetworkStatus', () => ({
  useNetworkStatus: () => mockUseNetworkStatus(),
}));

// Mock draw service
const mockUseCurrentDraw = vi.fn();
const mockUseDrawDigitEvents = vi.fn();
vi.mock('../services/draw.service', () => ({
  useCurrentDraw: () => mockUseCurrentDraw(),
  useDrawDigitEvents: () => mockUseDrawDigitEvents(),
}));

describe('LiveDrawPage', () => {
  let queryClient: QueryClient;

  const renderLiveDrawPage = (drawId?: string): RenderResult => {
    const path = drawId ? `/draws/live/${drawId}` : '/draws/live';
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path="/draws/live/:drawId?" element={<LiveDrawPage />} />
            <Route path="/draws" element={<div>Draws Page</div>} />
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

    mockUseNetworkStatus.mockReturnValue(true);
    mockUseDrawDigitEvents.mockReturnValue({
      data: [],
      isLoading: false,
    });
  });

  describe('offline state', () => {
    it('should show offline message when network is down', () => {
      mockUseNetworkStatus.mockReturnValue(false);
      mockUseCurrentDraw.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      expect(screen.getByText('أنت غير متصل بالإنترنت')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton while fetching data', () => {
      mockUseCurrentDraw.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      // Skeleton elements should be present
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('no active draw state', () => {
    it('should show no active draw message when no live draw', () => {
      mockUseCurrentDraw.mockReturnValue({
        data: { status: 'scheduled' },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      expect(screen.getByText('لا يوجد سحب نشط حالياً')).toBeInTheDocument();
    });

    it('should show no active draw message when data is null', () => {
      mockUseCurrentDraw.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      expect(screen.getByText('لا يوجد سحب نشط حالياً')).toBeInTheDocument();
    });
  });

  describe('live draw state', () => {
    const mockLiveDraw = {
      draw_id: 'draw-123',
      draw_type: 'weekly',
      draw_date: '2024-01-15T18:00:00Z',
      status: 'live',
      jackpot_rollover_iqd: 100000000,
      entry_pool_size: 87000000,
    };

    beforeEach(() => {
      mockUseCurrentDraw.mockReturnValue({
        data: mockLiveDraw,
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render back button', () => {
      renderLiveDrawPage();
      expect(screen.getByText('رجوع')).toBeInTheDocument();
    });

    it('should render connection status', () => {
      renderLiveDrawPage();
      expect(screen.getByText('متصل')).toBeInTheDocument();
    });

    it('should render draw title', () => {
      renderLiveDrawPage();
      expect(screen.getByText('السحب الأسبوعي')).toBeInTheDocument();
    });

    it('should render viewer count', () => {
      renderLiveDrawPage();
      expect(screen.getByText(/مشاهد/)).toBeInTheDocument();
    });

    it('should render winning number slots', () => {
      renderLiveDrawPage();
      // Should have 3 winning number rows
      expect(screen.getByText('الرقم الفائز 1')).toBeInTheDocument();
      expect(screen.getByText('الرقم الفائز 2')).toBeInTheDocument();
      expect(screen.getByText('الرقم الفائز 3')).toBeInTheDocument();
    });

    it('should render entry pool size', () => {
      renderLiveDrawPage();
      expect(screen.getByText('حجم مجمع المشاركات')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseCurrentDraw.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      expect(screen.getByText('فشل في تحميل البيانات')).toBeInTheDocument();
    });

    it('should have retry button in error state', () => {
      const mockRefetch = vi.fn();
      mockUseCurrentDraw.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Failed to fetch'),
        refetch: mockRefetch,
      });

      renderLiveDrawPage();
      const retryButton = screen.getByRole('button');
      expect(retryButton).toBeInTheDocument();
    });
  });

  describe('monthly draw', () => {
    it('should render monthly draw title', () => {
      mockUseCurrentDraw.mockReturnValue({
        data: {
          draw_id: 'draw-123',
          draw_type: 'monthly',
          draw_date: '2024-01-15T18:00:00Z',
          status: 'live',
          jackpot_rollover_iqd: 500000000,
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      renderLiveDrawPage();
      expect(screen.getByText('السحب الشهري')).toBeInTheDocument();
    });
  });
});
