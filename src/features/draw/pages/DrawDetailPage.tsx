/**
 * SCR-004: Draw Detail
 * Detailed view of a specific draw with winning numbers
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Trophy, Users, Calendar, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Badge } from '@/shared/components/Badge';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useDraw, useDrawWinners } from '../services/draw.service';
import { formatCurrency } from '@/core/utils/formatters';

// Winning number display component
function WinningNumber({
  number,
  label,
  userMatchingDigits,
}: {
  number: string;
  label: string;
  userMatchingDigits: number;
}) {
  const digits = number.split('');

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary text-center">{label}</p>
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {digits.map((digit, idx) => {
          const isMatching = idx >= digits.length - userMatchingDigits;
          return (
            <div
              key={idx}
              className={`
                w-8 h-12 flex items-center justify-center
                rounded-lg text-xl font-bold
                ${isMatching
                  ? 'bg-brand-gold text-white'
                  : 'bg-surface-secondary text-text-primary'
                }
              `}
            >
              {digit}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Winner tier summary row
function TierSummary({
  tier,
  count,
  prizePerWinner,
}: {
  tier: string;
  count: number;
  prizePerWinner: number;
}) {
  const { t } = useTranslation('consumer');

  const tierLabels: Record<string, string> = {
    'last_3': t('draw.tierLast3'),
    'last_5': t('draw.tierLast5'),
    'last_7': t('draw.tierLast7'),
    'last_10': t('draw.tierLast10'),
    'jackpot': t('draw.tierJackpot'),
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium text-text-primary">{tierLabels[tier] || tier}</p>
        <p className="text-sm text-text-secondary">
          {count.toLocaleString('ar-IQ')} {t('draw.winners')}
        </p>
      </div>
      <p className="font-semibold text-brand-primary">
        {formatCurrency(prizePerWinner)}
      </p>
    </div>
  );
}

// User matches section
function UserMatchesSection({
  matches,
  onShare,
}: {
  matches: Array<{
    entryNumber: string;
    digitsMatched: number;
    prizeIqd: number;
    tier: string;
  }>;
  onShare: () => void;
}) {
  const { t } = useTranslation('consumer');

  if (matches.length === 0) {
    return (
      <Card className="bg-surface-secondary">
        <CardContent className="p-4 text-center">
          <p className="text-text-secondary">
            {t('draw.noMatchingNumbers')}
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalPrize = matches.reduce((sum, m) => sum + m.prizeIqd, 0);

  return (
    <Card className="border-brand-gold border-2 bg-brand-gold/5">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-text-primary">{t('draw.yourPrize')}</h3>
          <span className="text-2xl font-bold text-brand-gold">
            {formatCurrency(totalPrize)}
          </span>
        </div>

        <div className="space-y-3 mb-4">
          {matches.map((match, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-border-primary last:border-0">
              <div>
                <p className="font-mono text-text-primary">{match.entryNumber}</p>
                <p className="text-sm text-text-secondary">
                  {match.digitsMatched} {t('draw.digitsMatched')}
                </p>
              </div>
              <Badge variant="success" className="bg-brand-gold text-white">
                {formatCurrency(match.prizeIqd)}
              </Badge>
            </div>
          ))}
        </div>

        <Button onClick={onShare} className="w-full">
          <Share2 className="h-5 w-5 me-2" />
          {t('draw.shareWin')}
        </Button>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function DrawDetailSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-32 w-full rounded-xl" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24 mx-auto" />
            <div className="flex justify-center gap-1">
              {Array.from({ length: 10 }).map((_, j) => (
                <Skeleton key={j} className="w-8 h-12 rounded-lg" />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
  );
}

export default function DrawDetailPage(): React.ReactElement {
  const { t } = useTranslation('consumer');
  const navigate = useNavigate();
  const { drawId } = useParams<{ drawId: string }>();
  const isOnline = useNetworkStatus();

  usePageTitle(t('draw.drawDetail'));

  const {
    data: draw,
    isLoading,
    error,
    refetch,
  } = useDraw(drawId ?? '', !!drawId);

  // Winners data is fetched but displayed via userMatches
  useDrawWinners(drawId ?? '', !!drawId);

  const handleShare = () => {
    navigate('/win-share', { state: { drawId } });
  };

  if (isLoading) {
    return <DrawDetailSkeleton />;
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

  if (!draw) {
    return (
      <div className="p-4">
        <ErrorState message={t('draw.notFound')} />
      </div>
    );
  }

  const formattedDate = new Date(draw.draw_date).toLocaleDateString('ar-IQ', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Build winning numbers from the draw data
  const winningNumbers: string[] = [];
  if (draw.winning_number_1) winningNumbers.push(String(draw.winning_number_1).padStart(10, '0'));
  if (draw.winning_number_2) winningNumbers.push(String(draw.winning_number_2).padStart(10, '0'));
  if (draw.winning_number_3) winningNumbers.push(String(draw.winning_number_3).padStart(10, '0'));
  // Fallback for demo
  if (winningNumbers.length === 0) {
    winningNumbers.push('1234567890', '0987654321', '5678901234');
  }

  // Mock user matches (in production comes from API)
  const userMatches: Array<{
    entryNumber: string;
    digitsMatched: number;
    prizeIqd: number;
    tier: string;
  }> = [];

  // Mock tier summary (in production comes from API)
  const tierSummary = [
    { tier: 'last_3', count: 50000, prizePerWinner: 10000 },
    { tier: 'last_5', count: 5000, prizePerWinner: 100000 },
    { tier: 'last_7', count: 500, prizePerWinner: 1000000 },
    { tier: 'last_10', count: 50, prizePerWinner: 10000000 },
    { tier: 'jackpot', count: draw.jackpot_claimed ? 1 : 0, prizePerWinner: draw.jackpot_rollover_iqd ?? 0 },
  ];

  return (
    <div className="min-h-screen bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            {t('common:back')}
          </button>
        </div>

        {/* Draw Info Card */}
        <Card className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {draw.draw_type === 'weekly' ? t('draw.weekly') : t('draw.monthly')}
              </Badge>
              <Badge
                variant={draw.status === 'finalized' ? 'success' : 'default'}
                className={draw.status === 'finalized' ? 'bg-success text-white' : ''}
              >
                {t(`draw.status.${draw.status}`)}
              </Badge>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-80">{formattedDate}</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <Users className="h-4 w-4 opacity-80" />
              <span className="text-sm opacity-80">
                {(draw.total_winners ?? 0).toLocaleString('ar-IQ')} {t('draw.winners')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-bold">
                {formatCurrency(draw.total_payout_iqd ?? 0)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Winning Numbers */}
        <div>
          <h2 className="font-bold text-text-primary mb-4">
            {t('draw.winningNumbers')}
          </h2>
          <div className="space-y-4">
            {winningNumbers.map((number, idx) => (
              <WinningNumber
                key={idx}
                number={number}
                label={t('draw.winningNumber', { index: idx + 1 })}
                userMatchingDigits={0}
              />
            ))}
          </div>
        </div>

        {/* Jackpot Status */}
        <Card className={draw.jackpot_claimed ? 'border-brand-gold border-2' : ''}>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
            <p className="font-bold text-text-primary mb-1">
              {t('draw.jackpot')}
            </p>
            <p className="text-2xl font-bold text-brand-gold mb-2">
              {formatCurrency(draw.jackpot_rollover_iqd ?? 0)}
            </p>
            <p className="text-sm text-text-secondary">
              {draw.jackpot_claimed ? t('draw.jackpotClaimed') : t('draw.jackpotRolledOver')}
            </p>
          </CardContent>
        </Card>

        {/* Winner Summary by Tier */}
        <div>
          <h2 className="font-bold text-text-primary mb-3">
            {t('draw.winnerSummary')}
          </h2>
          <Card>
            <CardContent className="p-4 divide-y divide-border-primary">
              {tierSummary.map((tier) => (
                <TierSummary
                  key={tier.tier}
                  tier={tier.tier}
                  count={tier.count}
                  prizePerWinner={tier.prizePerWinner}
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* User Matches Section */}
        <div>
          <h2 className="font-bold text-text-primary mb-3">
            {t('draw.yourNumbers')}
          </h2>
          <UserMatchesSection matches={userMatches} onShare={handleShare} />
        </div>
      </div>
    </div>
  );
}
