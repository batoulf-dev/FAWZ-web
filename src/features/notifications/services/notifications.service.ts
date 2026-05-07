/**
 * Notifications Service
 * API functions and TanStack Query hooks for notifications
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  Notification,
  NotificationListResponse,
  NotificationListParams,
  MarkNotificationReadRequest,
  NotificationPreferencesListResponse,
  UpdateNotificationPreferenceRequest,
  UnreadNotificationCount,
} from '../types/notifications.types';

// API base path
const BASE_PATH = '/fawz_consumer_engagement';

// Query key factory
export const notificationKeys = {
  all: ['notifications'] as const,
  lists: () => [...notificationKeys.all, 'list'] as const,
  list: (params: NotificationListParams) => [...notificationKeys.lists(), params] as const,
  details: () => [...notificationKeys.all, 'detail'] as const,
  detail: (id: string) => [...notificationKeys.details(), id] as const,
  unreadCount: () => [...notificationKeys.all, 'unread-count'] as const,
  preferences: () => [...notificationKeys.all, 'preferences'] as const,
  preferencesList: () => [...notificationKeys.preferences(), 'list'] as const,
  preference: (id: string) => [...notificationKeys.preferences(), id] as const,
};

// API functions
async function fetchNotifications(params: NotificationListParams = {}): Promise<NotificationListResponse> {
  const response = await apiClient.get<NotificationListResponse>(`${BASE_PATH}/notifications`, { params });
  return response.data;
}

async function fetchNotificationById(id: string): Promise<Notification> {
  const response = await apiClient.get<Notification>(`${BASE_PATH}/notifications/${id}`);
  return response.data;
}

async function markNotificationAsRead(
  id: string,
  data: MarkNotificationReadRequest,
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(`${BASE_PATH}/notifications/${id}`, data);
  return response.data;
}

async function fetchNotificationPreferences(): Promise<NotificationPreferencesListResponse> {
  const response = await apiClient.get<NotificationPreferencesListResponse>(
    `${BASE_PATH}/notification_preferences`,
  );
  return response.data;
}

async function updateNotificationPreference(
  id: string,
  data: UpdateNotificationPreferenceRequest,
): Promise<{ message: string }> {
  const response = await apiClient.patch<{ message: string }>(
    `${BASE_PATH}/notification_preferences/${id}`,
    data,
  );
  return response.data;
}

// Query hooks

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Fetch notifications list
 */
export function useNotifications(params: NotificationListParams = {}) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => fetchNotifications(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Fetch single notification by ID
 */
export function useNotification(id: string) {
  return useQuery({
    queryKey: notificationKeys.detail(id),
    queryFn: () => fetchNotificationById(id),
    enabled: Boolean(id),
  });
}

/**
 * Fetch unread notification count
 */
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async (): Promise<UnreadNotificationCount> => {
      // Get unread notifications count from list
      const response = await fetchNotifications({ is_read: false, page_size: 1 });
      return { count: response.total_notifications };
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000, // Poll every minute
  });
}

/**
 * Mark notification as read mutation
 */
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      markNotificationAsRead(id, { is_read: true, read_at: new Date().toISOString() }),
    onMutate: async (notificationId: string) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.lists() });

      // Snapshot all cached notification lists
      const previousLists = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: notificationKeys.lists(),
      });

      // Optimistically update all cached lists
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: notificationKeys.lists() },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications_list: old.notifications_list.map((notification) =>
              notification.notification_id === notificationId
                ? { ...notification, is_read: true, read_at: new Date().toISOString() }
                : notification,
            ),
          };
        },
      );

      return { previousLists };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data);
          }
        });
      }
    },
    // Note: We don't invalidate on success since optimistic update is sufficient
    // and the mock API doesn't persist state changes
  });
}

/**
 * Mark all notifications as read mutation
 */
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // Get all unread notifications
      const unreadResponse = await fetchNotifications({ is_read: false, page_size: 100 });

      // Mark each as read
      const promises = unreadResponse.notifications_list.map((notification) =>
        markNotificationAsRead(notification.notification_id, {
          is_read: true,
          read_at: new Date().toISOString(),
        }),
      );

      await Promise.all(promises);
      return { marked: unreadResponse.notifications_list.length };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount() });
    },
  });
}

/**
 * Fetch notification preferences
 */
export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferencesList(),
    queryFn: fetchNotificationPreferences,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Update notification preference mutation
 */
export function useUpdateNotificationPreference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNotificationPreferenceRequest }) =>
      updateNotificationPreference(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: notificationKeys.preferencesList() });

      // Snapshot the previous value
      const previousPreferences = queryClient.getQueryData<NotificationPreferencesListResponse>(
        notificationKeys.preferencesList(),
      );

      // Optimistically update the preference
      if (previousPreferences) {
        queryClient.setQueryData<NotificationPreferencesListResponse>(
          notificationKeys.preferencesList(),
          {
            ...previousPreferences,
            notification_preferences_list: previousPreferences.notification_preferences_list.map(
              (pref) => (pref.notification_preference_id === id ? { ...pref, ...data } : pref),
            ),
          },
        );
      }

      return { previousPreferences };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousPreferences) {
        queryClient.setQueryData(notificationKeys.preferencesList(), context.previousPreferences);
      }
    },
    // Note: We don't invalidate on success since optimistic update is sufficient
    // and the mock API doesn't persist state changes
  });
}
