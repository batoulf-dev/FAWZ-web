/**
 * NotificationPreferencesPage Tests
 * Tests for notification preferences page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationPreferencesPage from './NotificationPreferencesPage';

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
        'notifications.preferences': 'إعدادات الإشعارات',
        'notifications.prefDrawReminders': 'تذكيرات السحب',
        'notifications.prefDrawResults': 'نتائج السحب',
        'notifications.prefEntryEarned': 'كسب رقم جديد',
        'notifications.prefChallengeUpdates': 'تحديثات التحديات',
        'notifications.prefReferralRewards': 'مكافآت الإحالة',
        'notifications.prefSystemCritical': 'إشعارات النظام',
        'notifications.saveError': 'فشل الحفظ',
        'settings.notifications': 'إدارة إشعاراتك',
        'errors.general': 'حدث خطأ',
        'errors.serverError': 'خطأ في الخادم',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock notification hooks
const mockUseNotificationPreferences = vi.fn();
const mockUpdatePreference = vi.fn();

vi.mock('../index', () => ({
  useNotificationPreferences: () => mockUseNotificationPreferences(),
  useUpdateNotificationPreference: () => ({
    mutate: mockUpdatePreference,
    isPending: false,
    variables: null,
  }),
}));

describe('NotificationPreferencesPage', () => {
  let queryClient: QueryClient;

  const renderPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationPreferencesPage />
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
    vi.clearAllMocks();
  });

  describe('loading state', () => {
    it('should show loading skeletons while fetching data', () => {
      mockUseNotificationPreferences.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPage();
      expect(screen.getByText('إعدادات الإشعارات')).toBeInTheDocument();
      // Should have skeleton elements
      const skeletons = document.querySelectorAll('.skeleton');
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    const mockPreferences = [
      {
        notification_preference_id: 'pref-1',
        category: 'draw_reminders',
        is_enabled: true,
      },
      {
        notification_preference_id: 'pref-2',
        category: 'draw_results',
        is_enabled: false,
      },
      {
        notification_preference_id: 'pref-3',
        category: 'system_critical',
        is_enabled: true,
      },
    ];

    beforeEach(() => {
      mockUseNotificationPreferences.mockReturnValue({
        data: { notification_preferences_list: mockPreferences },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render page title', () => {
      renderPage();
      expect(screen.getByRole('heading', { name: 'إعدادات الإشعارات' })).toBeInTheDocument();
    });

    it('should render preference categories', () => {
      renderPage();
      expect(screen.getByText('تذكيرات السحب')).toBeInTheDocument();
      expect(screen.getByText('نتائج السحب')).toBeInTheDocument();
    });

    it('should render toggle switches', () => {
      renderPage();
      const switches = screen.getAllByRole('switch');
      expect(switches.length).toBeGreaterThan(0);
    });

    it('should show lock icon for non-editable preferences', () => {
      renderPage();
      // System critical preference should have a lock icon
      const lockIcons = document.querySelectorAll('.lucide-lock');
      expect(lockIcons.length).toBeGreaterThan(0);
    });

    it('should render back button', () => {
      renderPage();
      const backButton = document.querySelector('.lucide-arrow-right');
      expect(backButton).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseNotificationPreferences.mockReturnValue({
        data: undefined,
        isLoading: false,
        isError: true,
        error: new Error('Failed to fetch'),
        refetch: vi.fn(),
      });

      renderPage();
      expect(screen.getByText('حدث خطأ')).toBeInTheDocument();
    });
  });
});
