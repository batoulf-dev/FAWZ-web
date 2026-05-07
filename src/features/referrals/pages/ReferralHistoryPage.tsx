/**
 * SCR-010: Referral History
 * List of all referrals with status
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Users, CheckCircle2, Clock, XCircle, Gift } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useReferralHistory } from '../services/referrals.service';
import { formatNumber, formatLocalizedDate } from '@/core/utils/formatters';
import type { ReferralStatus } from '../types/referrals.types';

// Referral row component
function ReferralRow({
  maskedName,
  status,
  qualifiedAt,
  rewardEntries,
  rewardCash,
}: {
  maskedName: string;
  status: ReferralStatus;
  qualifiedAt?: string;
  rewardEntries: number;
  rewardCash: number;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const statusConfig: Record<
    ReferralStatus,
    { icon: React.ReactNode; label: string; color: string }
  > = {
    initiated: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusInitiated'),
      color: 'bg-gray-100 text-gray-600',
    },
    clicked: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusClicked'),
      color: 'bg-gray-100 text-gray-600',
    },
    registered: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusRegistered'),
      color: 'bg-blue-100 text-blue-600',
    },
    pending: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusPending'),
      color: 'bg-yellow-100 text-yellow-600',
    },
    qualified: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: t('referral.statusQualified'),
      color: 'bg-green-100 text-green-600',
    },
    rewarded: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: t('referral.statusRewarded'),
      color: 'bg-success/10 text-success',
    },
    pending_review: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusPendingReview'),
      color: 'bg-orange-100 text-orange-600',
    },
    rejected: {
      icon: <XCircle className="h-4 w-4" />,
      label: t('referral.statusRejected'),
      color: 'bg-error/10 text-error',
    },
    expired: {
      icon: <XCircle className="h-4 w-4" />,
      label: t('referral.statusExpired'),
      color: 'bg-gray-100 text-gray-500',
    },
    archived: {
      icon: <Clock className="h-4 w-4" />,
      label: t('referral.statusArchived'),
      color: 'bg-gray-100 text-gray-400',
    },
  };

  const config = statusConfig[status];
  const isSuccessful = status === 'rewarded' || status === 'qualified';

  const formattedDate = qualifiedAt
    ? formatLocalizedDate(qualifiedAt, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }, lang)
    : null;

  return (
    <Card className={isSuccessful ? 'border-success' : ''}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center">
              <Users className="h-5 w-5 text-text-muted" />
            </div>
            <div>
              <p className="font-medium text-text-primary">{maskedName}</p>
              {formattedDate && (
                <p className="text-sm text-text-secondary">
                  {t('referral.qualifiedOn', { date: formattedDate })}
                </p>
              )}
            </div>
          </div>
          <Badge className={config.color}>
            {config.icon}
            <span className="ms-1">{config.label}</span>
          </Badge>
        </div>

        {isSuccessful && (rewardEntries > 0 || rewardCash > 0) && (
          <div className="mt-3 pt-3 border-t border-border-primary">
            <div className="flex items-center gap-2 text-brand-gold">
              <Gift className="h-4 w-4" />
              <span className="text-sm font-medium">
                {rewardEntries > 0 && `+${rewardEntries} ${t('entries.numbers')}`}
                {rewardEntries > 0 && rewardCash > 0 && ' + '}
                {rewardCash > 0 && `${formatNumber(rewardCash, lang)} IQD`}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function HistorySkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Skeleton className="w-10 h-10 rounded-full" />
              <div>
                <Skeleton className="h-4 w-24 mb-1" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ReferralHistoryPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('referral.history'));

  const {
    data: referrals,
    isLoading,
    error,
    refetch,
  } = useReferralHistory();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="text-text-secondary"
            >
              <ArrowRight className="h-5 w-5 rtl:rotate-180" />
            </button>
            <h1 className="text-xl font-bold text-text-primary">
              {t('referral.history')}
            </h1>
          </div>
          <HistorySkeleton />
        </div>
      </div>
    );
  }

  if (error && isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Mask name for privacy
  const maskName = (name: string) => {
    if (!name || name.length < 3) return '***';
    const first = name.charAt(0);
    const last = name.charAt(name.length - 1);
    return `${first}${'*'.repeat(Math.min(name.length - 2, 5))}${last}`;
  };

  return (
    <div className="min-h-screen bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-5 w-5 rtl:rotate-180" />
          </button>
          <h1 className="text-xl font-bold text-text-primary">
            {t('referral.history')}
          </h1>
        </div>

        {/* Referral List */}
        {!referrals || referrals.length === 0 ? (
          <EmptyState
            icon={<Users className="h-12 w-12" />}
            title={t('referral.noReferralsYet')}
            description={t('referral.shareYourLink')}
            actionLabel={t('referral.inviteNow')}
            onAction={() => navigate('/referral')}
          />
        ) : (
          <div className="space-y-3">
            {referrals.map((referral) => (
              <ReferralRow
                key={referral.referral_id}
                maskedName={maskName(referral.referred_id ?? '')}
                status={referral.status}
                qualifiedAt={referral.qualified_at}
                rewardEntries={referral.referrer_reward_entries}
                rewardCash={referral.referrer_reward_cash_iqd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
