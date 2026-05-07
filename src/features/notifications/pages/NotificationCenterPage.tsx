/**
 * NotificationCenterPage
 * SCR-012: In-app Notification Center
 * Route: /notifications
 */

import { useTranslation } from 'react-i18next';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNavigate } from 'react-router';
import {
  useNotifications,
  useMarkNotificationRead,
  type Notification,
} from '../index';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationSkeleton } from '../components/NotificationSkeleton';

export default function NotificationCenterPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotifications({
    page_size: 50,
  });

  // Mutations
  const markAsRead = useMarkNotificationRead();

  const notifications = notificationsData?.notifications_list ?? [];
  const hasNotifications = notifications.length > 0;

  // Handle mark as read
  const handleMarkAsRead = (notification: Notification): void => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.notification_id);
    }
  };

  // Navigate to settings
  const handleSettingsClick = (): void => {
    navigate('/notifications/settings');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <NotificationHeader onSettingsClick={handleSettingsClick} />
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <NotificationHeader onSettingsClick={handleSettingsClick} />
        <ErrorState
          title={t('errors.general')}
          message={error instanceof Error ? error.message : t('errors.serverError')}
          onRetry={() => refetch()}
          className="mt-12"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <NotificationHeader onSettingsClick={handleSettingsClick} />

      {/* Notifications List */}
      <div className="p-4 space-y-3">
        {!hasNotifications ? (
          <EmptyState
            icon={<Bell className="h-8 w-8" />}
            title={t('notifications.empty')}
            description={t('notifications.emptyDesc')}
          />
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.notification_id}
              notification={notification}
              onMarkAsRead={() => handleMarkAsRead(notification)}
              isMarkingRead={markAsRead.isPending}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Header component
interface NotificationHeaderProps {
  onSettingsClick: () => void;
}

function NotificationHeader({
  onSettingsClick,
}: NotificationHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-text-primary">
          {t('notifications.center')}
        </h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          leftIcon={<Settings className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}

