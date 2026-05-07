/**
 * NotificationPreferencesPage
 * SCR-013: Notification Preferences
 * Route: /notifications/settings
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useTranslation } from 'react-i18next';
import { ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router';
import { cn } from '@/core/utils/cn';
import { Card } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { ErrorState } from '@/shared/components/ErrorState';
import { Skeleton } from '@/shared/components/Skeleton';
import { useNotificationPreferences, useUpdateNotificationPreference } from '../index';
import toast from 'react-hot-toast';

// Preference categories with their keys and labels
const PREFERENCE_CATEGORIES = [
  { key: 'draw_reminders', labelKey: 'prefDrawReminders', editable: true },
  { key: 'draw_results', labelKey: 'prefDrawResults', editable: true },
  { key: 'entry_earned', labelKey: 'prefEntryEarned', editable: true },
  { key: 'challenge_updates', labelKey: 'prefChallengeUpdates', editable: true },
  { key: 'referral_rewards', labelKey: 'prefReferralRewards', editable: true },
  { key: 'system_critical', labelKey: 'prefSystemCritical', editable: false },
] as const;

export default function NotificationPreferencesPage(): JSX.Element {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Fetch preferences
  const {
    data: preferencesData,
    isLoading,
    isError,
    error,
    refetch,
  } = useNotificationPreferences();

  // Update mutation
  const updatePreference = useUpdateNotificationPreference();

  const preferences = preferencesData?.notification_preferences_list ?? [];

  // Handle toggle
  const handleToggle = (preferenceId: string, currentValue: boolean): void => {
    updatePreference.mutate(
      { id: preferenceId, data: { is_enabled: !currentValue } },
      {
        onError: () => {
          toast.error(t('notifications.saveError'));
        },
      },
    );
  };

  // Find preference by category
  const getPreferenceByCategory = (category: string) => {
    return preferences.find((p) => p.category === category);
  };

  // Handle back navigation
  const handleBack = (): void => {
    navigate(-1);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-bg-primary">
        <PreferencesHeader onBack={handleBack} />
        <div className="p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <PreferenceSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="bg-bg-primary">
        <PreferencesHeader onBack={handleBack} />
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
    <div className="bg-bg-primary">
      <PreferencesHeader onBack={handleBack} />

      <div className="py-4 space-y-4">
        <p className="text-sm text-text-secondary">
          {t('settings.notifications')}
        </p>

        <Card variant="outlined" padding="none">
          {PREFERENCE_CATEGORIES.map((category, index) => {
            const preference = getPreferenceByCategory(category.key);
            const isEnabled = preference?.is_enabled ?? true;
            const isLast = index === PREFERENCE_CATEGORIES.length - 1;

            return (
              <PreferenceRow
                key={category.key}
                label={t(`notifications.${category.labelKey}`)}
                isEnabled={isEnabled}
                isEditable={category.editable}
                isUpdating={
                  updatePreference.isPending &&
                  updatePreference.variables?.id === preference?.notification_preference_id
                }
                onToggle={() => {
                  if (category.editable && preference) {
                    handleToggle(preference.notification_preference_id, isEnabled);
                  }
                }}
                showBorder={!isLast}
              />
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// Header component
interface PreferencesHeaderProps {
  onBack: () => void;
}

function PreferencesHeader({ onBack }: PreferencesHeaderProps): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="sticky top-0 z-10 bg-bg-primary border-b border-border-default">
      <div className="flex items-center gap-3 px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          leftIcon={<ArrowRight className="h-5 w-5 ltr:rotate-180" />}
        />
        <h1 className="text-xl font-bold text-text-primary">
          {t('notifications.preferences')}
        </h1>
      </div>
    </div>
  );
}

// Preference row component
interface PreferenceRowProps {
  label: string;
  isEnabled: boolean;
  isEditable: boolean;
  isUpdating: boolean;
  onToggle: () => void;
  showBorder: boolean;
}

function PreferenceRow({
  label,
  isEnabled,
  isEditable,
  isUpdating,
  onToggle,
  showBorder,
}: PreferenceRowProps): JSX.Element {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-4',
        showBorder && 'border-b border-border-default',
      )}
    >
      <div className="flex items-center gap-3">
        {!isEditable && (
          <Lock className="h-4 w-4 text-text-muted" />
        )}
        <span
          className={cn(
            'text-sm',
            !isEditable ? 'text-text-muted' : 'text-text-primary',
          )}
        >
          {label}
        </span>
      </div>

      <Toggle
        enabled={isEnabled}
        disabled={!isEditable || isUpdating}
        onToggle={onToggle}
      />
    </div>
  );
}

// Toggle switch component
interface ToggleProps {
  enabled: boolean;
  disabled: boolean;
  onToggle: () => void;
}

function Toggle({ enabled, disabled, onToggle }: ToggleProps): JSX.Element {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full',
        'transition-colors duration-200 ease-in-out',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        enabled ? 'bg-brand-primary' : 'bg-bg-muted',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow',
          'ring-0 transition duration-200 ease-in-out',
          enabled ? 'translate-x-5 rtl:-translate-x-5' : 'translate-x-0.5 rtl:-translate-x-0.5',
        )}
      />
    </button>
  );
}

// Skeleton component
function PreferenceSkeleton(): JSX.Element {
  return (
    <Card variant="outlined" padding="sm" className="flex items-center justify-between">
      <Skeleton height={16} className="w-1/2" />
      <Skeleton width={44} height={24} rounded="full" />
    </Card>
  );
}
