/**
 * SCR-011: Prize History
 * User's winning history with payout status
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trophy, Calendar, CheckCircle2, Clock, Lock, Gift, ChevronLeft } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useMyWins, usePrizeSummary } from '../services/prizes.service';
import { formatCurrency, formatLocalizedDate } from '@/core/utils/formatters';
import type { PayoutStatus, PrizePayout } from '../types/prizes.types';

// Summary card component
function PrizeSummaryCard({ totalWins, totalAmount }: { totalWins: number; totalAmount: number }) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <Card className="bg-gradient-to-r from-brand-gold/10 to-brand-primary/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-gold/10 rounded-xl">
            <Trophy className="h-8 w-8 text-brand-gold" />
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">
              {t('prize.lifetimeWinnings')}
            </p>
            <p className="text-3xl font-bold text-brand-gold">
              {formatCurrency(totalAmount, lang)}
            </p>
            <p className="text-sm text-text-secondary">
              {totalWins} {t('prize.timesWon')}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Prize row component
function PrizeRow({
  drawDate,
  drawType,
  tier,
  amount,
  payoutStatus,
  onTap,
}: {
  drawDate: string;
  drawType: string;
  tier: string;
  amount: number;
  payoutStatus: PayoutStatus;
  onTap: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const statusConfig: Record<
    PayoutStatus,
    { icon: React.ReactNode; label: string; color: string }
  > = {
    pending: {
      icon: <Clock className="h-4 w-4" />,
      label: t('prize.statusPending'),
      color: 'bg-yellow-100 text-yellow-600',
    },
    processing: {
      icon: <Clock className="h-4 w-4" />,
      label: t('prize.statusProcessing'),
      color: 'bg-blue-100 text-blue-600',
    },
    on_hold: {
      icon: <Lock className="h-4 w-4" />,
      label: t('prize.statusHeld'),
      color: 'bg-orange-100 text-orange-600',
    },
    requires_review: {
      icon: <Clock className="h-4 w-4" />,
      label: t('prize.statusReview'),
      color: 'bg-blue-100 text-blue-600',
    },
    completed: {
      icon: <CheckCircle2 className="h-4 w-4" />,
      label: t('prize.statusCompleted'),
      color: 'bg-success/10 text-success',
    },
    failed: {
      icon: <Clock className="h-4 w-4" />,
      label: t('prize.statusFailed'),
      color: 'bg-error/10 text-error',
    },
    cancelled: {
      icon: <Clock className="h-4 w-4" />,
      label: t('prize.statusCancelled'),
      color: 'bg-gray-100 text-gray-500',
    },
    held_cap_exceeded: {
      icon: <Lock className="h-4 w-4" />,
      label: t('prize.statusCapExceeded'),
      color: 'bg-orange-100 text-orange-600',
    },
  };

  const config = statusConfig[payoutStatus] ?? statusConfig.pending;

  const tierLabels: Record<string, string> = {
    'last_3': t('prize.tierLast3'),
    'last_5': t('prize.tierLast5'),
    'last_7': t('prize.tierLast7'),
    'last_10': t('prize.tierLast10'),
    'jackpot': t('prize.tierJackpot'),
  };

  const formattedDate = formatLocalizedDate(drawDate, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }, lang);

  const isPaid = payoutStatus === 'completed';

  return (
    <Card
      className={`cursor-pointer hover:shadow-md transition-shadow ${isPaid ? 'border-success' : ''}`}
      onClick={onTap}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={drawType === 'weekly' ? 'default' : 'secondary'}>
                {drawType === 'weekly' ? t('draw.weekly') : t('draw.monthly')}
              </Badge>
              <Badge className="bg-brand-gold/10 text-brand-gold">
                {tierLabels[tier] || tier}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-text-secondary">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">{formattedDate}</span>
            </div>
          </div>
          <ChevronLeft className="h-5 w-5 text-text-muted ltr:rotate-180" />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-2xl font-bold text-brand-gold">
            {formatCurrency(amount, lang)}
          </p>
          <Badge className={config.color}>
            {config.icon}
            <span className="ms-1">{config.label}</span>
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function PrizeHistorySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-28 w-full rounded-xl" />
      {[1, 2, 3, 4].map((i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32 mb-3" />
            <div className="flex justify-between">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function PrizeHistoryPage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('prize.history'));

  const {
    data: wins,
    isLoading: winsLoading,
    error,
    refetch,
  } = useMyWins();

  const {
    data: summary,
    isLoading: summaryLoading,
  } = usePrizeSummary();

  const isLoading = winsLoading || summaryLoading;

  if (isLoading) {
    return (
      <div className="bg-surface-primary">
        <div className="p-4">
          <h1 className="text-xl font-bold text-text-primary mb-4">
            {t('prize.history')}
          </h1>
          <PrizeHistorySkeleton />
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

  const prizeList = wins ?? [];
  const totalWins = summary?.total_wins ?? prizeList.length;
  const totalAmount = summary?.lifetime_total_iqd ?? prizeList.reduce((sum: number, p: PrizePayout) => sum + p.prize_amount_iqd, 0);

  return (
    <div className="bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="py-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-text-primary">
            {t('prize.history')}
          </h1>
          <Gift className="h-6 w-6 text-brand-gold" />
        </div>

        {/* Summary Card */}
        {totalWins > 0 && (
          <PrizeSummaryCard totalWins={totalWins} totalAmount={totalAmount} />
        )}

        {/* Prize List */}
        {prizeList.length === 0 ? (
          <EmptyState
            icon={<Trophy className="h-12 w-12" />}
            title={t('prize.noWinsYet')}
            description={t('prize.keepPlaying')}
            actionLabel={t('prize.viewDraws')}
            onAction={() => navigate('/draws')}
          />
        ) : (
          <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {prizeList.map((prize) => (
              <PrizeRow
                key={prize.prize_payout_id}
                drawDate={prize.created_at}
                drawType={prize.draw_id?.includes('monthly') ? 'monthly' : 'weekly'}
                tier={prize.prize_tier}
                amount={prize.prize_amount_iqd}
                payoutStatus={prize.payout_status}
                onTap={() => navigate(`/draws/${prize.draw_id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
