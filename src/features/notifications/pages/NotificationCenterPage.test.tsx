/**
 * NotificationCenterPage Tests
 * Tests for notification center page rendering and states
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, RenderResult } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NotificationCenterPage from './NotificationCenterPage';

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
        'notifications.center': 'مركز الإشعارات',
        'notifications.all': 'الكل',
        'notifications.unread': 'غير مقروءة',
        'notifications.empty': 'لا توجد إشعارات',
        'notifications.emptyDesc': 'ستظهر إشعاراتك هنا',
        'notifications.markAllRead': 'تحديد الكل كمقروء',
        'errors.general': 'حدث خطأ',
        'errors.serverError': 'خطأ في الخادم',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock notification hooks
const mockUseNotifications = vi.fn();
const mockMarkNotificationRead = vi.fn();
const mockMarkAllNotificationsRead = vi.fn();

vi.mock('../index', () => ({
  useNotifications: () => mockUseNotifications(),
  useMarkNotificationRead: () => ({
    mutate: mockMarkNotificationRead,
    isPending: false,
  }),
  useMarkAllNotificationsRead: () => ({
    mutate: mockMarkAllNotificationsRead,
    isPending: false,
  }),
}));

// Mock NotificationItem component
vi.mock('../components/NotificationItem', () => ({
  NotificationItem: ({ notification }: { notification: { notification_id: string; title: string } }) => (
    <div data-testid="notification-item">{notification.title}</div>
  ),
}));

// Mock NotificationSkeleton component
vi.mock('../components/NotificationSkeleton', () => ({
  NotificationSkeleton: () => <div data-testid="notification-skeleton" className="skeleton" />,
}));

describe('NotificationCenterPage', () => {
  let queryClient: QueryClient;

  const renderPage = (): RenderResult => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <NotificationCenterPage />
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
      mockUseNotifications.mockReturnValue({
        data: undefined,
        isLoading: true,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });

      renderPage();
      expect(screen.getByText('مركز الإشعارات')).toBeInTheDocument();
      expect(screen.getAllByTestId('notification-skeleton').length).toBeGreaterThan(0);
    });
  });

  describe('data loaded state', () => {
    const mockNotifications = [
      {
        notification_id: 'notif-1',
        title: 'فزت بجائزة!',
        body: 'مبروك',
        is_read: false,
        created_at: '2024-01-15T10:00:00Z',
      },
      {
        notification_id: 'notif-2',
        title: 'سحب جديد',
        body: 'السحب الأسبوعي',
        is_read: true,
        created_at: '2024-01-14T10:00:00Z',
      },
    ];

    beforeEach(() => {
      mockUseNotifications.mockReturnValue({
        data: { notifications_list: mockNotifications },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should render page title', () => {
      renderPage();
      expect(screen.getByRole('heading', { name: 'مركز الإشعارات' })).toBeInTheDocument();
    });

    it('should render filter tabs', () => {
      renderPage();
      expect(screen.getByText('الكل')).toBeInTheDocument();
      expect(screen.getByText('غير مقروءة')).toBeInTheDocument();
    });

    it('should render notification items', () => {
      renderPage();
      expect(screen.getAllByTestId('notification-item').length).toBe(2);
    });

    it('should show mark all read button when has unread', () => {
      renderPage();
      expect(screen.getByText('تحديد الكل كمقروء')).toBeInTheDocument();
    });
  });

  describe('empty state', () => {
    beforeEach(() => {
      mockUseNotifications.mockReturnValue({
        data: { notifications_list: [] },
        isLoading: false,
        isError: false,
        error: null,
        refetch: vi.fn(),
      });
    });

    it('should show empty state when no notifications', () => {
      renderPage();
      expect(screen.getByText('لا توجد إشعارات')).toBeInTheDocument();
    });

    it('should show empty state description', () => {
      renderPage();
      expect(screen.getByText('ستظهر إشعاراتك هنا')).toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('should show error state when fetch fails', () => {
      mockUseNotifications.mockReturnValue({
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
