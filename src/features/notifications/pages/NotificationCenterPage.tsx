/**
 * NotificationCenterPage
 * SCR-012: In-app Notification Center
 * Route: /notifications
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Bell, Settings, CheckCheck } from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Button } from '@/shared/components/Button';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { useNavigate } from 'react-router';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  type Notification,
} from '../index';
import { NotificationItem } from '../components/NotificationItem';
import { NotificationSkeleton } from '../components/NotificationSkeleton';

type FilterTab = 'all' | 'unread';

export default function NotificationCenterPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>('all');

  // Fetch notifications
  const {
    data: notificationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotifications({
    is_read: activeTab === 'unread' ? false : undefined,
    page_size: 50,
  });

  // Mutations
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();

  const notifications = notificationsData?.notifications_list ?? [];
  const hasNotifications = notifications.length > 0;
  const hasUnread = notifications.some((n) => !n.is_read);

  // Handle mark as read
  const handleMarkAsRead = (notification: Notification): void => {
    if (!notification.is_read) {
      markAsRead.mutate(notification.notification_id);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = (): void => {
    markAllAsRead.mutate();
  };

  // Navigate to settings
  const handleSettingsClick = (): void => {
    navigate('/notifications/settings');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary">
        <NotificationHeader
          onSettingsClick={handleSettingsClick}
          onMarkAllRead={handleMarkAllAsRead}
          hasUnread={false}
          isMarkingAll={false}
        />
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
        <NotificationHeader
          onSettingsClick={handleSettingsClick}
          onMarkAllRead={handleMarkAllAsRead}
          hasUnread={false}
          isMarkingAll={false}
        />
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
      <NotificationHeader
        onSettingsClick={handleSettingsClick}
        onMarkAllRead={handleMarkAllAsRead}
        hasUnread={hasUnread}
        isMarkingAll={markAllAsRead.isPending}
      />

      {/* Filter Tabs */}
      <div className="px-4 pt-2">
        <div className="flex gap-2 border-b border-border-default">
          <TabButton
            active={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
          >
            {t('notifications.all')}
          </TabButton>
          <TabButton
            active={activeTab === 'unread'}
            onClick={() => setActiveTab('unread')}
          >
            {t('notifications.unread')}
          </TabButton>
        </div>
      </div>

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
  onMarkAllRead: () => void;
  hasUnread: boolean;
  isMarkingAll: boolean;
}

function NotificationHeader({
  onSettingsClick,
  onMarkAllRead,
  hasUnread,
  isMarkingAll,
}: NotificationHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-text-primary">
          {t('notifications.center')}
        </h1>
        <div className="flex items-center gap-2">
          {hasUnread && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onMarkAllRead}
              isLoading={isMarkingAll}
              leftIcon={<CheckCheck className="h-4 w-4" />}
            >
              {t('notifications.markAllRead')}
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onSettingsClick}
            leftIcon={<Settings className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
}

// Tab button component
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function TabButton({ active, onClick, children }: TabButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-4 py-2 text-sm font-medium transition-colors',
        'border-b-2 -mb-px',
        active
          ? 'text-brand-primary border-brand-primary'
          : 'text-text-secondary border-transparent hover:text-text-primary',
      )}
    >
      {children}
    </button>
  );
}
