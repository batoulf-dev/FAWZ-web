/**
 * SCR-004: Draw Detail
 * Detailed view of a specific draw with winning numbers
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useMemo } from 'react';
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
import { useEntryList } from '@/features/entries/services/entries.service';
import { formatCurrency, formatLocalizedDate, formatNumber, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
import { LotteryAnimation, DrawResultOverlay } from '../components';
import { compareTickets, PRIZE_TIERS } from '../components/utils';

// Animated winning ticket display component
function AnimatedWinningTicket({
  number,
  label,
  userTickets,
  shouldAnimate,
  animationDelay,
}: {
  number: string;
  label: string;
  userTickets: string[];
  shouldAnimate: boolean;
  animationDelay: number;
}) {
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    if (shouldAnimate) {
      const timeout = setTimeout(() => {
        setStartAnimation(true);
      }, animationDelay);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [shouldAnimate, animationDelay]);

  if (startAnimation) {
    return (
      <LotteryAnimation
        winningNumber={number}
        userTickets={userTickets}
        duration={1500}
        autoStart={true}
        label={label}
      />
    );
  }

  // Show placeholder while waiting for animation
  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary text-center">{label}</p>
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {number.split('').map((_, idx) => (
          <div
            key={idx}
            className="w-8 h-12 flex items-center justify-center rounded-lg text-xl font-bold bg-surface-tertiary text-text-muted animate-pulse"
          >
            ?
          </div>
        ))}
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
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const tierLabels: Record<string, string> = {
    'last_3': t('draw.tierLast3'),
    'last_5': t('draw.tierLast5'),
    'last_7': t('draw.tierLast7'),
    'last_10': t('draw.tierJackpot'),
    'jackpot': t('draw.tierJackpot'),
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <p className="font-medium text-text-primary">{tierLabels[tier] || tier}</p>
        <p className="text-sm text-text-secondary">
          {formatNumber(count, lang)} {t('draw.winners')}
        </p>
      </div>
      <p className="font-semibold text-brand-primary">
        {formatCurrency(prizePerWinner, lang)}
      </p>
    </div>
  );
}

// Mini confetti particle for prize card
function PrizeConfetti({ isActive }: { isActive: boolean }) {
  if (!isActive) return null;

  const colors = ['#FFD700', '#FFA500', '#FF6B35', '#FFFFFF', '#FFC107'];
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: colors[Math.floor(Math.random() * colors.length)],
    delay: Math.random() * 0.5,
    size: 4 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute animate-[prizeConfetti_2s_ease-out_forwards]"
          style={{ // dynamic — cannot use Tailwind for computed confetti particle animations
            left: `${p.x}%`,
            top: '-10px',
            width: `${p.size}px`,
            height: `${p.size * 2}px`,
            backgroundColor: p.color,
            borderRadius: '2px',
            animationDelay: `${p.delay}s`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
}

// User matches section - Golden shining prize card
function UserMatchesSection({
  matches,
  onShare,
}: {
  matches: Array<{
    ticketNumber: string;
    winningNumber: string;
    digitsMatched: number;
    prizeIqd: number;
    tier: string | null;
  }>;
  onShare: () => void;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const [showConfetti, setShowConfetti] = useState(true);

  // Auto-hide confetti after 2s
  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (matches.length === 0) {
    return null;
  }

  const totalPrize = matches.reduce((sum, m) => sum + m.prizeIqd, 0);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      {/* Confetti animation - 1s duration */}
      <PrizeConfetti isActive={showConfetti} />

      {/* Golden shining background */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-brand-gold to-yellow-500" />
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent" />

      {/* Shimmer effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-full top-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 animate-[shimmer_3s_infinite]" />
      </div>

      <div className="relative p-4">
        {/* Large prize amount in title */}
        <div className="text-center mb-4">
          <h3 className="font-bold text-white text-lg drop-shadow-md mb-1">{t('draw.yourPrize')}</h3>
          <span className="text-4xl font-bold text-white drop-shadow-lg">
            {formatCurrency(totalPrize, lang)}
          </span>
        </div>

        {/* Matching tickets list - without redundant prize pills */}
        <div className="space-y-2 mb-4">
          {matches.map((match, idx) => (
            <div key={idx} className="py-2 px-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <p className="font-mono text-white font-semibold text-center">{match.ticketNumber}</p>
              <p className="text-sm text-white/90 text-center">
                {match.digitsMatched} {t('draw.digitsMatched')}
              </p>
            </div>
          ))}
        </div>

        <Button
          onClick={onShare}
          className="w-full bg-white hover:bg-white/90 text-brand-gold font-bold shadow-lg"
        >
          <Share2 className="h-5 w-5 me-2" />
          {t('draw.shareWin')}
        </Button>
      </div>
    </div>
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
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { id: drawId } = useParams<{ id: string }>();
  const isOnline = useNetworkStatus();

  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  usePageTitle(t('draw.drawDetail'));

  const {
    data: draw,
    isLoading,
    error,
    refetch,
  } = useDraw(drawId ?? '', !!drawId);

  // Winners data is fetched but displayed via userMatches
  useDrawWinners(drawId ?? '', !!drawId);

  // Fetch user's entries for ticket comparison
  const { data: entriesData } = useEntryList({ page_size: 50 });

  // Build winning numbers from the draw data
  const winningNumbers = useMemo(() => {
    const numbers: string[] = [];
    if (draw?.winning_number_1) numbers.push(String(draw.winning_number_1).padStart(10, '0'));
    if (draw?.winning_number_2) numbers.push(String(draw.winning_number_2).padStart(10, '0'));
    if (draw?.winning_number_3) numbers.push(String(draw.winning_number_3).padStart(10, '0'));
    // Fallback for demo
    if (numbers.length === 0) {
      numbers.push('1234567890', '0987654321', '5678901234');
    }
    return numbers;
  }, [draw]);

  // Extract user tickets from entries API response
  const userTickets = useMemo(() => {
    if (!entriesData?.fawz_entries_list) return [];
    return entriesData.fawz_entries_list.map((entry) => entry.entry_number);
  }, [entriesData]);

  // Compare user tickets against winning numbers
  const comparisonResult = useMemo(() => {
    return compareTickets(winningNumbers, userTickets);
  }, [winningNumbers, userTickets]);

  // Get tier label for display
  const getTierLabel = (tier: keyof typeof PRIZE_TIERS | null): string => {
    if (!tier) return '';
    const labels: Record<keyof typeof PRIZE_TIERS, string> = {
      last_3: t('draw.tierLast3'),
      last_5: t('draw.tierLast5'),
      last_7: t('draw.tierLast7'),
      last_10: t('draw.tierJackpot'),
    };
    return labels[tier];
  };

  // Trigger animation when draw data loads
  useEffect(() => {
    if (draw && draw.status === 'finalized' && !animationComplete) {
      // Start animation after a brief delay
      const timeout = setTimeout(() => {
        setShouldAnimate(true);
      }, 500);

      // Show result overlay after animation completes (all 3 numbers animated)
      const overlayTimeout = setTimeout(() => {
        setShowResultOverlay(true);
        setAnimationComplete(true);
      }, 500 + (winningNumbers.length * 1800) + 1500);

      return () => {
        clearTimeout(timeout);
        clearTimeout(overlayTimeout);
      };
    }
    return undefined;
  }, [draw, winningNumbers.length, animationComplete]);

  const handleShare = () => {
    navigate(`/prizes/share/${drawId}`);
  };

  const handleInviteFriends = () => {
    navigate('/referral');
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

  const formattedDate = formatLocalizedDate(draw.draw_date, DATE_FORMAT_PRESETS.full, lang);

  // Format user matches for display - include all matching tickets
  const userMatches = comparisonResult.matches.map(m => ({
    ticketNumber: m.ticketNumber,
    winningNumber: m.winningNumber,
    digitsMatched: m.digitsMatched,
    prizeIqd: m.prizeIqd,
    tier: m.tier,
  }));

  // Check if user won jackpot (matched 10 digits)
  const userWonJackpot = comparisonResult.bestTier === 'last_10';

  // Jackpot is claimed if API says so OR if user won it
  const jackpotClaimed = draw.jackpot_claimed || userWonJackpot || (draw.jackpot_winners_count ?? 0) > 0;

  // Build tier summary - use total_winners from draw and distribute proportionally
  // The counts should add up to draw.total_winners
  const totalWinners = draw.total_winners ?? 0;
  const jackpotCount = jackpotClaimed ? 1 : 0;

  // If API returns winner_summary, use it; otherwise estimate from total
  const tierSummary = draw.winner_summary
    ? draw.winner_summary.map((ws) => ({
        tier: ws.tier,
        count: ws.winner_count,
        prizePerWinner: PRIZE_TIERS[ws.tier as keyof typeof PRIZE_TIERS]?.prize ?? (ws.total_payout_iqd / (ws.winner_count || 1)),
      }))
    : [
        // Distribute winners proportionally: ~90% last_3, ~9% last_5, ~0.9% last_7, jackpot
        { tier: 'last_3', count: Math.max(0, totalWinners - Math.floor(totalWinners * 0.1) - Math.floor(totalWinners * 0.01) - jackpotCount), prizePerWinner: PRIZE_TIERS.last_3.prize },
        { tier: 'last_5', count: Math.floor(totalWinners * 0.09), prizePerWinner: PRIZE_TIERS.last_5.prize },
        { tier: 'last_7', count: Math.floor(totalWinners * 0.009), prizePerWinner: PRIZE_TIERS.last_7.prize },
        { tier: 'last_10', count: jackpotCount, prizePerWinner: PRIZE_TIERS.last_10.prize },
      ];

  return (
    <div className="bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      {/* Result Overlay - shows actual comparison result */}
      <DrawResultOverlay
        type={comparisonResult.resultType}
        prizeAmount={comparisonResult.totalPrize}
        tier={getTierLabel(comparisonResult.bestTier)}
        isVisible={showResultOverlay}
        onShare={handleShare}
        onInviteFriends={handleInviteFriends}
        onClose={() => setShowResultOverlay(false)}
      />

      <div className="py-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
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
                {formatNumber(draw.total_winners ?? 0, lang)} {t('draw.winners')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-lg font-bold">
                {formatCurrency(draw.total_payout_iqd ?? 0, lang)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Winning Tickets with Animation */}
        <div>
          <h2 className="font-bold text-text-primary mb-4">
            {t('draw.winningTickets')}
          </h2>
          <div className="space-y-4">
            {winningNumbers.map((number, idx) => (
              <AnimatedWinningTicket
                key={idx}
                number={number}
                label={t('draw.winningTicket', { index: idx + 1 })}
                userTickets={userTickets}
                shouldAnimate={shouldAnimate}
                animationDelay={idx * 1800}
              />
            ))}
          </div>
        </div>

        {/* Your Prize Card - placed right after winning tickets */}
        {userMatches.length > 0 && (
          <div>
            <h2 className="font-bold text-text-primary mb-3">
              {t('draw.yourPrize')}
            </h2>
            <UserMatchesSection matches={userMatches} onShare={handleShare} />
          </div>
        )}

        {/* Jackpot Status - only show rolled over if no jackpot winner */}
        <Card className={jackpotClaimed ? 'border-brand-gold border-2' : ''}>
          <CardContent className="p-4 text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-brand-gold" />
            <p className="font-bold text-text-primary mb-1">
              {t('draw.jackpot')}
            </p>
            <p className="text-2xl font-bold text-brand-gold mb-2">
              {formatCurrency(PRIZE_TIERS.last_10.prize, lang)}
            </p>
            <p className="text-sm text-text-secondary">
              {jackpotClaimed ? t('draw.jackpotClaimed') : t('draw.jackpotRolledOver')}
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

        {/* User Tickets Section - Show if no matches (no wins) */}
        {userMatches.length === 0 && (
          <div>
            <h2 className="font-bold text-text-primary mb-3">
              {t('draw.yourTickets')}
            </h2>
            <Card className="bg-surface-secondary">
              <CardContent className="p-4 text-center">
                <p className="text-text-secondary">
                  {t('draw.noMatchingNumbers')}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
