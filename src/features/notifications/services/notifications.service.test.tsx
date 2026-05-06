/**
 * Notifications Service Tests
 * Tests for notification service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useNotifications,
  useNotification,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useNotificationPreferences,
  useUpdateNotificationPreference,
  notificationKeys,
} from './notifications.service';
import type { ReactNode } from 'react';

describe('notifications.service', () => {
  let queryClient: QueryClient;

  const createWrapper = (): React.FC<{ children: ReactNode }> =>
    function Wrapper({ children }: { children: ReactNode }): JSX.Element {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
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

  describe('notificationKeys', () => {
    it('should have correct base key', () => {
      expect(notificationKeys.all).toEqual(['notifications']);
    });

    it('should have correct lists key', () => {
      expect(notificationKeys.lists()).toEqual(['notifications', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(notificationKeys.list({ page: 1, is_read: false })).toEqual([
        'notifications',
        'list',
        { page: 1, is_read: false },
      ]);
    });

    it('should have correct detail key', () => {
      expect(notificationKeys.detail('123')).toEqual(['notifications', 'detail', '123']);
    });

    it('should have correct unread count key', () => {
      expect(notificationKeys.unreadCount()).toEqual(['notifications', 'unread-count']);
    });

    it('should have correct preferences keys', () => {
      expect(notificationKeys.preferences()).toEqual(['notifications', 'preferences']);
      expect(notificationKeys.preferencesList()).toEqual(['notifications', 'preferences', 'list']);
      expect(notificationKeys.preference('pref-1')).toEqual([
        'notifications',
        'preferences',
        'pref-1',
      ]);
    });
  });

  describe('useNotifications', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useNotifications(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(
        () => useNotifications({ is_read: false, page: 1 }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should use correct query key', () => {
      renderHook(() => useNotifications({ is_read: true }), {
        wrapper: createWrapper(),
      });

      const queries = queryClient.getQueryCache().findAll();
      const hasCorrectKey = queries.some(
        (q) =>
          Array.isArray(q.queryKey) &&
          q.queryKey[0] === 'notifications' &&
          q.queryKey[1] === 'list',
      );
      expect(hasCorrectKey).toBe(true);
    });
  });

  describe('useNotification', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useNotification('notification-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useNotification(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useUnreadNotificationCount', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useUnreadNotificationCount(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useMarkNotificationRead', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useMarkNotificationRead(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useNotificationPreferences', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useNotificationPreferences(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useUpdateNotificationPreference', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useUpdateNotificationPreference(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });
});
