/**
 * NotificationItem Component
 * Single notification row in the notification center
 */

import { useTranslation } from 'react-i18next';
import {
  Bell,
  Trophy,
  Gift,
  Users,
  Zap,
  AlertTriangle,
  Target,
  ChevronLeft,
} from 'lucide-react';
import { cn } from '@/core/utils/cn';
import { Card } from '@/shared/components/Card';
import type { Notification, NotificationType } from '../types/notifications.types';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: () => void;
  isMarkingRead: boolean;
}

// Icon mapping for notification types
const notificationIcons: Record<string, React.ReactNode> = {
  draw_reminder: <Bell className="h-5 w-5" />,
  draw_result_winner: <Trophy className="h-5 w-5" />,
  draw_result_non_winner: <Bell className="h-5 w-5" />,
  entry_earned: <Zap className="h-5 w-5" />,
  prize_credited: <Gift className="h-5 w-5" />,
  referral_reward: <Users className="h-5 w-5" />,
  referral_success: <Users className="h-5 w-5" />,
  challenge_checkpoint: <Target className="h-5 w-5" />,
  challenge_completed: <Trophy className="h-5 w-5" />,
  challenge_progress: <Target className="h-5 w-5" />,
  system_critical: <AlertTriangle className="h-5 w-5" />,
  account_suspended: <AlertTriangle className="h-5 w-5" />,
  default: <Bell className="h-5 w-5" />,
};

// Icon background colors
const iconBgColors: Record<string, string> = {
  draw_result_winner: 'bg-success-light text-success',
  prize_credited: 'bg-success-light text-success',
  draw_result_non_winner: 'bg-bg-muted text-text-muted',
  system_critical: 'bg-error-light text-error',
  account_suspended: 'bg-error-light text-error',
  referral_reward: 'bg-brand-primary/10 text-brand-primary',
  referral_success: 'bg-brand-primary/10 text-brand-primary',
  entry_earned: 'bg-brand-secondary/10 text-brand-secondary',
  default: 'bg-bg-muted text-text-muted',
};

function getNotificationIcon(type?: NotificationType): React.ReactNode {
  if (!type) return notificationIcons.default;
  return notificationIcons[type] ?? notificationIcons.default;
}

function getIconBgColor(type?: NotificationType): string {
  if (!type) return iconBgColors.default;
  return iconBgColors[type] ?? iconBgColors.default;
}

export function NotificationItem({
  notification,
  onMarkAsRead,
  isMarkingRead,
}: NotificationItemProps): JSX.Element {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return t('notifications.minutesAgo', { count: diffMins });
    if (diffHours < 24) return t('notifications.hoursAgo', { count: diffHours });
    return t('notifications.daysAgo', { count: diffDays });
  };

  return (
    <button
      type="button"
      onClick={onMarkAsRead}
      disabled={isMarkingRead}
      className="w-full text-start"
    >
      <Card
        variant="outlined"
        padding="sm"
        className={cn(
          'flex items-start gap-3 transition-colors hover:bg-bg-muted/50',
          !notification.is_read && 'border-s-4 border-s-brand-primary',
        )}
      >
        {/* Icon */}
        <div
          className={cn(
            'shrink-0 rounded-full p-2',
            getIconBgColor(notification.notification_type),
          )}
        >
          {getNotificationIcon(notification.notification_type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <p
            className={cn(
              'text-sm line-clamp-1',
              notification.is_read ? 'text-text-secondary' : 'text-text-primary font-semibold',
            )}
          >
            {isArabic ? notification.title_ar : notification.title_en || notification.title_ar}
          </p>

          {/* Body */}
          <p className="text-sm text-text-muted line-clamp-2 mt-0.5">
            {isArabic ? notification.body_ar : notification.body_en || notification.body_ar}
          </p>

          {/* Time */}
          <p className="text-xs text-text-muted mt-1">
            {formatRelativeTime(notification.created_at)}
          </p>
        </div>

        {/* Arrow */}
        {notification.deep_link && (
          <ChevronLeft
            className={cn(
              'shrink-0 h-5 w-5 text-text-muted',
              'rtl:rotate-180',
            )}
          />
        )}
      </Card>
    </button>
  );
}
