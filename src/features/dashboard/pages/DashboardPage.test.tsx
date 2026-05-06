/**
 * DashboardPage Tests
 * Tests for dashboard page structure and loading states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from './DashboardPage';

// Mock i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, params?: Record<string, unknown>) => {
      const translations: Record<string, string> = {
        'home.title': 'الرئيسية',
        'home.welcome': 'مرحباً',
        'draw.weekly': 'السحب الأسبوعي',
        'draw.monthly': 'السحب الشهري',
        'draw.live': 'مباشر',
        'draw.liveNow': 'السحب مباشر الآن!',
        'entries.myNumbers': 'أرقامي في السحب',
        'entries.noEntriesYet': 'لا توجد أرقام بعد',
        'entries.startPayingToEarn': 'ابدأ الدفع لكسب الأرقام',
        'entries.numbers': 'رقم',
        'challenge.weeklySpark': 'الشعلة الأسبوعية',
        'challenge.weeklySparkProgress': `${params?.days ?? 0} أيام مكتملة`,
        'challenge.activeChallenges': 'التحديات النشطة',
        'challenge.endsIn': `ينتهي خلال ${params?.days ?? 0} أيام`,
        'referral.inviteFriends': 'ادعُ أصدقاءك',
        'referral.successfulReferrals': 'إحالات ناجحة',
        'common.details': 'التفاصيل',
        'common.viewAll': 'عرض الكل',
        'nav.draws': 'السحوبات',
        'nav.prizes': 'الجوائز',
        'errors.loadFailed': 'فشل تحميل البيانات',
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

// Mock auth store
vi.mock('@/stores/auth.store', () => ({
  useAuthStore: () => ({
    user: { id: 'user-1', first_name: 'Test' },
  }),
}));

// Mock service hooks - loading state
const mockUseNextDraw = vi.fn();
const mockUseActiveChallenges = vi.fn();
const mockUseEntrySummary = vi.fn();
const mockUseReferralStats = vi.fn();

vi.mock('@/features/draw/services/draw.service', () => ({
  useNextDraw: () => mockUseNextDraw(),
}));

vi.mock('@/features/challenges/services/challenges.service', () => ({
  useActiveChallenges: () => mockUseActiveChallenges(),
}));

vi.mock('@/features/entries/services/entries.service', () => ({
  useEntrySummary: () => mockUseEntrySummary(),
}));

vi.mock('@/features/referrals/services/referrals.service', () => ({
  useReferralStats: () => mockUseReferralStats(),
}));

// Mock react-router
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe('DashboardPage', () => {
  let queryClient: QueryClient;

  const renderDashboard = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <DashboardPage />
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

    // Reset mocks to loading state by default
    mockUseNextDraw.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
      refetch: vi.fn(),
    });

    mockUseActiveChallenges.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    mockUseEntrySummary.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });

    mockUseReferralStats.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    });
  });

  describe('loading state', () => {
    it('should show loading skeleton while fetching data', () => {
      renderDashboard();
      // Skeleton elements should be present
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    beforeEach(() => {
      mockUseNextDraw.mockReturnValue({
        data: {
          draw_id: 'draw-1',
          draw_date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          draw_type: 'weekly',
          jackpot_rollover_iqd: 1000000,
          status: 'scheduled',
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseActiveChallenges.mockReturnValue({
        data: [
          {
            challenge_id: 'ch-1',
            name_ar: 'تحدي الأسبوع',
            target_value: 10,
            reward_entries: 5,
            daysRemaining: 3,
            userProgress: { current_value: 5 },
          },
        ],
        isLoading: false,
        error: null,
      });

      mockUseEntrySummary.mockReturnValue({
        data: {
          current_draw_count: 25,
          lifetime_count: 100,
          weekly_unique_days: 4,
        },
        isLoading: false,
        error: null,
      });

      mockUseReferralStats.mockReturnValue({
        data: { successful_referrals: 5 },
        isLoading: false,
        error: null,
      });
    });

    it('should render welcome message', () => {
      renderDashboard();
      expect(screen.getByText('مرحباً')).toBeInTheDocument();
    });

    it('should render entry count', () => {
      renderDashboard();
      expect(screen.getByText('25')).toBeInTheDocument();
      expect(screen.getByText('أرقامي في السحب')).toBeInTheDocument();
    });

    it('should render weekly spark section', () => {
      renderDashboard();
      expect(screen.getByText('الشعلة الأسبوعية')).toBeInTheDocument();
    });

    it('should render active challenges section', () => {
      renderDashboard();
      expect(screen.getByText('التحديات النشطة')).toBeInTheDocument();
    });

    it('should render referral section', () => {
      renderDashboard();
      expect(screen.getByText('ادعُ أصدقاءك')).toBeInTheDocument();
    });

    it('should render quick action buttons', () => {
      renderDashboard();
      expect(screen.getByText('السحوبات')).toBeInTheDocument();
      expect(screen.getByText('الجوائز')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    beforeEach(() => {
      mockUseNextDraw.mockReturnValue({
        data: null,
        isLoading: false,
        error: new Error('Network error'),
        refetch: vi.fn(),
      });

      mockUseActiveChallenges.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      mockUseEntrySummary.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });

      mockUseReferralStats.mockReturnValue({
        data: null,
        isLoading: false,
        error: null,
      });
    });

    it('should show error state when data fails to load', () => {
      renderDashboard();
      expect(screen.getByText('فشل تحميل البيانات')).toBeInTheDocument();
    });

    it('should have retry button in error state', () => {
      renderDashboard();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('empty state for new user', () => {
    beforeEach(() => {
      mockUseNextDraw.mockReturnValue({
        data: {
          draw_id: 'draw-1',
          draw_date: new Date(Date.now() + 86400000).toISOString(),
          draw_type: 'weekly',
          jackpot_rollover_iqd: 1000000,
          status: 'scheduled',
        },
        isLoading: false,
        error: null,
        refetch: vi.fn(),
      });

      mockUseActiveChallenges.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
      });

      mockUseEntrySummary.mockReturnValue({
        data: {
          current_draw_count: 0,
          lifetime_count: 0,
          weekly_unique_days: 0,
        },
        isLoading: false,
        error: null,
      });

      mockUseReferralStats.mockReturnValue({
        data: { successful_referrals: 0 },
        isLoading: false,
        error: null,
      });
    });

    it('should show empty state for new user with no entries', () => {
      renderDashboard();
      expect(screen.getByText('لا توجد أرقام بعد')).toBeInTheDocument();
    });
  });
});
