/**
 * ChallengeListItem Component
 * Challenge row with progress bar for homepage
 */

import { useTranslation } from 'react-i18next';
import { Target, Gift, Clock, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatNumber } from '@/core/utils/formatters';
import type { HomeChallengeItem } from '../types/home.types';

interface ChallengeListItemProps {
  challenge: HomeChallengeItem;
  onClick?: () => void;
}

export function ChallengeListItem({
  challenge,
  onClick,
}: ChallengeListItemProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const progressPercent = Math.min(
    (challenge.progress / challenge.target) * 100,
    100
  );

  // Get display name based on language
  const displayName = lang === 'ar' || lang.startsWith('ar-')
    ? challenge.nameAr
    : challenge.nameEn;

  // Format reward text
  const rewardText = challenge.rewardEntries > 0
    ? `+${formatNumber(challenge.rewardEntries, lang)} ${t('entries.numbers')}`
    : '';
  const cashReward = challenge.rewardCashIqd > 0
    ? `+${formatNumber(challenge.rewardCashIqd, lang)} IQD`
    : '';

  if (challenge.isCompleted) {
    return (
      <Card
        className="bg-success/5 border-success/20 cursor-pointer hover:bg-success/10 transition-colors"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 bg-success/10 rounded-lg flex-shrink-0">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-primary truncate">
                  {displayName}
                </p>
                <p className="text-sm text-success">
                  {t('challenge.completed')}
                </p>
              </div>
            </div>
            <Badge variant="success" className="flex-shrink-0">
              {rewardText || cashReward}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-all"
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="p-2 bg-brand-primary/10 rounded-lg flex-shrink-0">
              <Target className="h-5 w-5 text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-text-primary truncate">
                {displayName}
              </p>
              <div className="flex items-center gap-2 text-xs text-text-secondary mt-0.5">
                <Clock className="h-3 w-3" />
                <span>
                  {t('challenge.daysLeft', { days: challenge.daysRemaining })}
                </span>
              </div>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 text-text-muted flex-shrink-0 rtl:rotate-180" />
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-text-secondary">
              {formatNumber(challenge.progress, lang)} / {formatNumber(challenge.target, lang)}
            </span>
            <span className="text-brand-primary font-medium">
              {Math.round(progressPercent)}%
            </span>
          </div>
          <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-primary to-brand-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward */}
        <div className="flex items-center gap-2 text-brand-gold">
          <Gift className="h-4 w-4" />
          <span className="text-sm font-medium">
            {rewardText}
            {rewardText && cashReward ? ' + ' : ''}
            {cashReward}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton for challenge list
export function ChallengeListSkeleton(): React.ReactElement {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-1.5" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full mb-3" />
            <Skeleton className="h-4 w-28" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
