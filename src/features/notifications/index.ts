/**
 * Notifications Feature
 * Public API exports
 */

// Types
export * from './types/notifications.types';

// Services & Hooks
export {
  notificationKeys,
  useNotifications,
  useNotification,
  useUnreadNotificationCount,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useNotificationPreferences,
  useUpdateNotificationPreference,
} from './services/notifications.service';

// Components
export { NotificationItem } from './components/NotificationItem';
export { NotificationSkeleton } from './components/NotificationSkeleton';
