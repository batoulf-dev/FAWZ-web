/**
 * NotificationCenterPage
 * SCR-012: In-app Notification Center
 * Route: /notifications
 *
 * Mobile: Full-page view
 * Desktop: Right sidebar overlay
 */

import { useTranslation } from 'react-i18next';
import { Bell, Settings, X } from 'lucide-react';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNavigate } from 'react-router';
import { cn } from '@/core/utils/cn';
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

  // Close notifications (go back)
  const handleClose = (): void => {
    navigate(-1);
  };

  // Content to render (shared between mobile and desktop)
  const renderContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <div className="p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <NotificationSkeleton key={i} />
          ))}
        </div>
      );
    }

    if (isError) {
      return (
        <ErrorState
          title={t('errors.general')}
          message={error instanceof Error ? error.message : t('errors.serverError')}
          onRetry={() => refetch()}
          className="mt-12"
        />
      );
    }

    return (
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
    );
  };

  return (
    <>
      {/* Desktop: Backdrop overlay */}
      <div
        className="hidden lg:block fixed inset-0 bg-black/50 z-40 animate-in fade-in duration-200"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Mobile: Full page / Desktop: Right sidebar */}
      <div
        className={cn(
          // Mobile: full page
          'bg-bg-primary',
          // Desktop: fixed right sidebar with white background
          'lg:fixed lg:inset-y-0 lg:end-0 lg:z-50',
          'lg:w-[400px] lg:min-h-0 lg:h-full lg:bg-white',
          'lg:shadow-2xl lg:border-s lg:border-border-default',
          'lg:animate-in lg:slide-in-from-right lg:duration-200',
        )}
      >
        <NotificationHeader onSettingsClick={handleSettingsClick} onClose={handleClose} />
        <div className="lg:h-[calc(100%-57px)] lg:overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </>
  );
}

// Header component
interface NotificationHeaderProps {
  onSettingsClick: () => void;
  onClose: () => void;
}

function NotificationHeader({
  onSettingsClick,
  onClose,
}: NotificationHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-card lg:bg-white border-b border-border-default shadow-sm">
      <div className="flex items-center justify-between px-4 py-4">
        <button
          onClick={onClose}
          className="p-2 -ms-2 rounded-lg hover:bg-bg-muted transition-colors"
          aria-label={t('common.close')}
        >
          <X className="h-5 w-5 text-text-primary" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">
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

