/**
 * SCR-002: Live Draw Screen
 * Real-time draw with WebSocket digit reveals
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Wifi, WifiOff, AlertTriangle, Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useCurrentDraw, useDrawDigitEvents } from '../services/draw.service';
import { useEntryList } from '@/features/entries/services/entries.service';
import { formatCurrency, formatLocalizedDate, formatNumber, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
import { LotteryAnimation, DrawResultOverlay } from '../components';
import { compareTickets, PRIZE_TIERS } from '../components/utils';
import type { DrawDigitEvent } from '../types/draw.types';

// Local state interface for live draw
interface LocalLiveDrawState {
  connectionState: 'connecting' | 'connected' | 'disconnected';
  currentNumberIndex: number;
  revealedDigits: DrawDigitEvent[];
  viewerCount: number;
}

// Connection status component
function ConnectionStatus({ status }: { status: 'connected' | 'degraded' | 'disconnected' }) {
  const { t } = useTranslation();

  const statusConfig = {
    connected: {
      icon: <Wifi className="h-4 w-4" />,
      text: t('draw.connected'),
      className: 'text-success bg-success/10',
    },
    degraded: {
      icon: <AlertTriangle className="h-4 w-4" />,
      text: t('draw.slowConnection'),
      className: 'text-warning bg-warning/10',
    },
    disconnected: {
      icon: <WifiOff className="h-4 w-4" />,
      text: t('draw.disconnected'),
      className: 'text-error bg-error/10',
    },
  };

  const config = statusConfig[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${config.className}`}>
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}


// Animated winning ticket row component
function AnimatedWinningTicketRow({
  ticketIndex,
  winningNumber,
  isAnimating,
  animationDelay,
}: {
  ticketIndex: number;
  winningNumber: string;
  isAnimating: boolean;
  animationDelay: number;
}) {
  const { t } = useTranslation();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setShouldAnimate(true);
      }, animationDelay);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isAnimating, animationDelay]);

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary text-center">
        {t('draw.winningTicket', { index: ticketIndex })}
      </p>
      {shouldAnimate ? (
        <LotteryAnimation
          winningNumber={winningNumber}
          duration={1500}
          autoStart={true}
        />
      ) : (
        <div className="flex justify-center gap-1 rtl:flex-row-reverse">
          {Array.from({ length: 10 }).map((_, idx) => (
            <div
              key={idx}
              className="w-8 h-12 flex items-center justify-center rounded-lg text-xl font-bold bg-surface-tertiary text-text-muted animate-pulse"
            >
              ?
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// User ticket comparison row - shows user's ticket with matching digits highlighted
function UserTicketComparisonRow({
  userTickets,
  winningNumbers,
  isAnimating,
  animationDelay,
}: {
  userTickets: string[];
  winningNumbers: string[];
  isAnimating: boolean;
  animationDelay: number;
}) {
  const { t } = useTranslation();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleDisplay, setShuffleDisplay] = useState('??????????');
  const [isRevealed, setIsRevealed] = useState(false);

  // Get current ticket
  const currentTicket = userTickets[currentTicketIndex]?.padStart(10, '0') || '0000000000';

  // Find best match for current ticket against all winning numbers
  const findBestMatch = (ticket: string) => {
    let bestMatches = 0;
    let bestWinningNumber = winningNumbers[0] || '0000000000';

    for (const winNum of winningNumbers) {
      let matches = 0;
      for (let i = 9; i >= 0; i--) {
        if (ticket[i] === winNum[i]) {
          matches++;
        } else {
          break;
        }
      }
      if (matches > bestMatches) {
        bestMatches = matches;
        bestWinningNumber = winNum;
      }
    }
    return { matchCount: bestMatches, winningNumber: bestWinningNumber };
  };

  const { matchCount, winningNumber: matchedWinningNumber } = findBestMatch(currentTicket);

  useEffect(() => {
    if (isAnimating) {
      const timeout = setTimeout(() => {
        setShouldAnimate(true);
        setIsShuffling(true);
      }, animationDelay);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [isAnimating, animationDelay]);

  // Shuffle animation
  useEffect(() => {
    if (!isShuffling) return undefined;

    let count = 0;
    const maxCount = 20;
    const interval = setInterval(() => {
      // Generate random digits
      const randomDigits = Array.from({ length: 10 }, () =>
        Math.floor(Math.random() * 10)
      ).join('');
      setShuffleDisplay(randomDigits);
      count++;

      if (count >= maxCount) {
        clearInterval(interval);
        setIsShuffling(false);
        setIsRevealed(true);
      }
    }, 75);

    return () => clearInterval(interval);
  }, [isShuffling]);

  // Cycle through tickets
  useEffect(() => {
    if (!isRevealed || userTickets.length <= 1) return undefined;

    const interval = setInterval(() => {
      setCurrentTicketIndex((prev) => (prev + 1) % userTickets.length);
      // Reset and reshuffle for new ticket
      setIsRevealed(false);
      setIsShuffling(true);
    }, 4000);

    return () => clearInterval(interval);
  }, [isRevealed, userTickets.length]);

  if (!shouldAnimate) {
    return (
      <div className="space-y-2 p-4 bg-brand-primary/5 rounded-xl border-2 border-brand-primary/20">
        <p className="text-sm text-brand-primary text-center font-medium">
          {t('draw.yourTicket')}
        </p>
        <div className="flex justify-center gap-1 rtl:flex-row-reverse">
          {Array.from({ length: 10 }).map((_, idx) => (
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

  const displayDigits = isRevealed ? currentTicket : shuffleDisplay;

  return (
    <div className="space-y-2 p-4 bg-brand-primary/5 rounded-xl border-2 border-brand-primary/20">
      <p className="text-sm text-brand-primary text-center font-medium">
        {t('draw.yourTicket')} {userTickets.length > 1 && `(${currentTicketIndex + 1}/${userTickets.length})`}
      </p>
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {displayDigits.split('').map((digit, idx) => {
          // Check if this digit matches (from end)
          const isMatching = isRevealed && idx >= (10 - matchCount) &&
            currentTicket[idx] === matchedWinningNumber[idx];

          return (
            <div
              key={idx}
              className={`
                w-8 h-12 flex items-center justify-center rounded-lg text-xl font-bold
                transition-all duration-300
                ${isRevealed
                  ? isMatching
                    ? 'bg-white border-2 border-brand-gold text-brand-gold shadow-md'
                    : 'bg-surface-secondary text-text-primary'
                  : 'bg-surface-tertiary text-text-muted'
                }
                ${isShuffling ? 'animate-pulse' : ''}
              `}
            >
              {digit}
            </div>
          );
        })}
      </div>
      {isRevealed && matchCount >= 3 && (
        <p className="text-center text-sm text-brand-gold font-medium mt-2">
          {matchCount} {t('draw.digitsMatched')}!
        </p>
      )}
    </div>
  );
}

// Loading skeleton
function LiveDrawSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-24 w-full rounded-xl" />
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
    </div>
  );
}

export default function LiveDrawPage(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const { drawId } = useParams<{ drawId?: string }>();
  const isOnline = useNetworkStatus();

  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'degraded' | 'disconnected'>('disconnected');
  const [liveState, setLiveState] = useState<LocalLiveDrawState>({
    connectionState: 'disconnected',
    currentNumberIndex: 0,
    revealedDigits: [],
    viewerCount: 0,
  });
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  usePageTitle(t('draw.liveDraw'));

  const {
    data: currentDraw,
    isLoading,
    error,
    refetch,
  } = useCurrentDraw();

  const {
    data: digitEvents,
  } = useDrawDigitEvents(drawId ?? currentDraw?.draw_id ?? '', !!currentDraw);

  // Fetch user's active entries for ticket comparison
  const {
    data: entriesData,
  } = useEntryList({ outcome: 'active', page_size: 50 });

  // Build winning numbers from the draw data
  const winningNumbers = useMemo(() => {
    const numbers: string[] = [];
    if (currentDraw?.winning_number_1) numbers.push(String(currentDraw.winning_number_1).padStart(10, '0'));
    if (currentDraw?.winning_number_2) numbers.push(String(currentDraw.winning_number_2).padStart(10, '0'));
    if (currentDraw?.winning_number_3) numbers.push(String(currentDraw.winning_number_3).padStart(10, '0'));
    // Fallback for demo
    if (numbers.length === 0) {
      numbers.push('1234567890', '0987654321', '5678901234');
    }
    return numbers;
  }, [currentDraw]);

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

  // Simulate WebSocket connection (in production, use real WebSocket)
  useEffect(() => {
    if (!currentDraw || currentDraw.status !== 'live') {
      setConnectionStatus('disconnected');
      return;
    }

    // Simulate connection
    setConnectionStatus('connected');
    setLiveState((prev) => ({ ...prev, connectionState: 'connected' }));

    // In production, connect to WebSocket here:
    // const ws = new WebSocket(`wss://api.example.com/ws/draw/${currentDraw.draw_id}`);
    // ws.onmessage = handleWebSocketMessage;
    // ws.onclose = () => setConnectionStatus('disconnected');
    // return () => ws.close();
  }, [currentDraw]);

  // Process digit events
  useEffect(() => {
    if (digitEvents && digitEvents.length > 0) {
      const sortedEvents = [...digitEvents].sort((a, b) =>
        new Date(a.entered_at).getTime() - new Date(b.entered_at).getTime()
      );
      setLiveState((prev) => ({
        ...prev,
        revealedDigits: sortedEvents,
        currentNumberIndex: sortedEvents[sortedEvents.length - 1]?.number_index ?? 0,
      }));
    }
  }, [digitEvents]);

  // Start animation when draw goes live
  useEffect(() => {
    if (currentDraw?.status === 'live') {
      // Small delay before starting animation
      const timeout = setTimeout(() => {
        setIsAnimating(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [currentDraw?.status]);

  // Check for draw finalization and show result overlay
  useEffect(() => {
    if (currentDraw?.status === 'finalized' && !animationComplete) {
      // Show result overlay after animation completes
      const overlayTimeout = setTimeout(() => {
        setShowResultOverlay(true);
        setAnimationComplete(true);
      }, 500 + (winningNumbers.length * 2000) + 1500);

      return () => clearTimeout(overlayTimeout);
    }
    return undefined;
  }, [currentDraw?.status, winningNumbers.length, animationComplete]);

  const handleShare = useCallback(() => {
    if (currentDraw) {
      navigate(`/prizes/share/${currentDraw.draw_id}`);
    }
  }, [navigate, currentDraw]);

  const handleInviteFriends = useCallback(() => {
    navigate('/referral');
  }, [navigate]);


  if (!isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('draw.offlineMessage')}
          onRetry={undefined}
        />
      </div>
    );
  }

  if (isLoading) {
    return <LiveDrawSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  if (!currentDraw || (currentDraw.status !== 'live' && currentDraw.status !== 'finalized')) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('draw.noActiveDraw')}
          onRetry={() => navigate('/draws')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-primary">
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

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 rtl:rotate-180" />
            {t('common:back')}
          </button>
          <ConnectionStatus status={connectionStatus} />
        </div>

        {/* Draw Title */}
        <Card className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
          <CardContent className="p-4 text-center">
            <h1 className="text-xl font-bold mb-2">
              {currentDraw.draw_type === 'weekly' ? t('draw.weeklyDraw') : t('draw.monthlyDraw')}
            </h1>
            <p className="text-sm opacity-80 mb-3">
              {formatLocalizedDate(currentDraw.draw_date, DATE_FORMAT_PRESETS.full, lang)}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {formatCurrency(10000000, lang)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Viewer Count */}
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <Users className="h-4 w-4" />
          <span className="text-sm">
            {t('draw.viewersWatching', { count: liveState.viewerCount || 543210 })}
          </span>
        </div>

        {/* Animated Digit Grid - Winning Tickets */}
        <div className="space-y-4">
          {winningNumbers.map((winningNumber, rowIndex) => (
            <AnimatedWinningTicketRow
              key={rowIndex}
              ticketIndex={rowIndex + 1}
              winningNumber={winningNumber}
              isAnimating={isAnimating}
              animationDelay={rowIndex * 1500}
            />
          ))}
        </div>

        {/* User Ticket Comparison - 4th Row */}
        <UserTicketComparisonRow
          userTickets={userTickets}
          winningNumbers={winningNumbers}
          isAnimating={isAnimating}
          animationDelay={(winningNumbers.length * 1500) + 500}
        />

        {/* Pool Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-text-secondary text-sm mb-1">
              {t('draw.entryPoolSize')}
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {currentDraw.entry_pool_size ? formatNumber(currentDraw.entry_pool_size, lang) : '87,000,000'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
