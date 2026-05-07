/**
 * SCR-007: Challenges Screen
 * List of active and completed challenges
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trophy, Clock, Gift, ChevronLeft, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useActiveChallenges, useOnboardingChallenges } from '../services/challenges.service';
import { useAuthStore } from '@/stores/auth.store';
import { formatNumber } from '@/core/utils/formatters';
import type { ChallengeWithProgress } from '../types/challenges.types';

// Challenge card component
function ChallengeCard({
  challenge,
}: {
  challenge: ChallengeWithProgress;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const progress = challenge.userProgress?.current_value ?? 0;
  const target = challenge.target_value;
  const progressPercent = Math.min((progress / target) * 100, 100);
  const isCompleted = challenge.isCompleted;

  // Format reward text
  const rewardText = challenge.reward_entries
    ? `+${challenge.reward_entries} ${t('entries.numbers')}`
    : '';
  const cashReward = challenge.reward_cash_iqd
    ? `+${formatNumber(challenge.reward_cash_iqd, lang)} IQD`
    : '';

  // Get display text based on language
  const isArabic = lang === 'ar' || lang.startsWith('ar-');
  const displayName = isArabic ? challenge.name_ar : challenge.name_en;
  const displayDescription = isArabic ? challenge.description_ar : challenge.description_en;

  return (
    <Card
      className={isCompleted ? 'bg-success/5 border-success' : ''}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {isCompleted && (
                <CheckCircle2 className="h-5 w-5 text-success" />
              )}
              <h3 className="font-bold text-text-primary">{displayName}</h3>
            </div>
            <p className="text-sm text-text-secondary line-clamp-2">
              {displayDescription}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!isCompleted && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">
                {progress}/{target}
              </span>
              <span className="text-brand-primary font-medium">
                {Math.round(progressPercent)}%
              </span>
            </div>
            <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-gold rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }} // dynamic — cannot use Tailwind
              />
            </div>
          </div>
        )}

        {/* Reward and Time */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-brand-gold">
            <Gift className="h-4 w-4" />
            <span className="text-sm font-medium">
              {rewardText}
              {rewardText && cashReward ? ' + ' : ''}
              {cashReward}
            </span>
          </div>
          {!isCompleted && challenge.daysRemaining !== undefined && (
            <div className="flex items-center gap-1 text-text-secondary">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                {t('challenge.daysLeft', { days: challenge.daysRemaining })}
              </span>
            </div>
          )}
          {isCompleted && (
            <Badge variant="success">{t('challenge.completed')}</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Onboarding progress card
function OnboardingProgressCard({
  completed,
  total,
}: {
  completed: number;
  total: number;
}) {
  const { t } = useTranslation();

  return (
    <Card
      className="bg-gradient-to-br from-brand-primary from-60% to-brand-gold text-white"
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="font-bold text-lg mb-1">
              {t('challenge.onboarding')}
            </h2>
            <p className="text-sm opacity-80">
              {t('challenge.onboardingDescription')}
            </p>
          </div>
          <div className="text-3xl font-bold">
            {completed}/{total}
          </div>
        </div>
        <div className="h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${(completed / total) * 100}%` }} // dynamic — cannot use Tailwind
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function ChallengesSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-xl" />
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-5 w-48 mb-2" />
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-2 w-full mb-3 rounded-full" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ChallengesPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();
  // User state used for role checks
  useAuthStore((state) => state.user);
  const [showCompleted, setShowCompleted] = useState(false);

  usePageTitle(t('challenge.challenges'));

  const {
    data: activeChallenges,
    isLoading: activeLoading,
    error: activeError,
    refetch: refetchActive,
  } = useActiveChallenges();

  const {
    data: onboardingChallenges,
    isLoading: onboardingLoading,
  } = useOnboardingChallenges();

  const isLoading = activeLoading || onboardingLoading;
  const error = activeError;

  // Filter active vs completed
  const active = activeChallenges?.filter((c) => !c.isCompleted) ?? [];
  const completed = activeChallenges?.filter((c) => c.isCompleted) ?? [];

  // Calculate onboarding progress
  const onboardingCompleted = onboardingChallenges?.filter(
    (c) => activeChallenges?.find((ac) => ac.challenge_id === c.challenge_id)?.isCompleted
  ).length ?? 0;
  const onboardingTotal = onboardingChallenges?.length ?? 4;
  const isNewUser = onboardingCompleted < onboardingTotal;

  if (isLoading) {
    return (
      <div className="bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('challenge.challenges')}
          </h1>
          <ChallengesSkeleton />
        </div>
      </div>
    );
  }

  if (error && isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetchActive()}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {t('challenge.challenges')}
          </h1>
          <Trophy className="h-6 w-6 text-[#FFC107]" />
        </div>

        {/* Onboarding Progress (for new users) */}
        {isNewUser && onboardingChallenges && (
          <OnboardingProgressCard
            completed={onboardingCompleted}
            total={onboardingTotal}
          />
        )}

        {/* Active Challenges */}
        {active.length > 0 && (
          <div>
            <h2 className="font-semibold text-text-primary mb-3">
              {t('challenge.activeChallenges')}
            </h2>
            <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {active.map((challenge) => (
                <ChallengeCard
                  key={challenge.challenge_id}
                  challenge={challenge}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {active.length === 0 && !isNewUser && (
          <EmptyState
            icon={<Trophy className="h-12 w-12" />}
            title={t('challenge.noActiveChallenges')}
            description={t('challenge.checkBackLater')}
          />
        )}

        {/* Completed Challenges */}
        {completed.length > 0 && (
          <div>
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className="flex items-center justify-between w-full py-2"
            >
              <h2 className="font-semibold text-text-primary">
                {t('challenge.completedChallenges')} ({completed.length})
              </h2>
              <ChevronLeft
                className={`h-5 w-5 text-text-muted transition-transform ${showCompleted ? 'rotate-90' : 'ltr:rotate-180'}`}
              />
            </button>

            {showCompleted && (
              <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mt-2">
                {completed.map((challenge) => (
                  <ChallengeCard
                    key={challenge.challenge_id}
                    challenge={challenge}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
