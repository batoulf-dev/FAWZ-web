/**
 * SCR-002: Live Draw Screen
 * Real-time draw with WebSocket digit reveals
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Wifi, WifiOff, AlertTriangle, Trophy, Users, Loader2, History } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useCurrentDraw, useNextDraw, useDrawDigitEvents } from '../services/draw.service';
import { useEntryList } from '@/features/entries/services/entries.service';
import { formatCurrency, formatLocalizedDate, formatNumber, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
import { DrawResultOverlay } from '../components';
import { compareTickets, PRIZE_TIERS } from '../components/utils';
import { cn } from '@/core/utils/cn';
import type { DrawDigitEvent } from '../types/draw.types';

// Connection status type with connecting state
type ConnectionStatusType = 'connecting' | 'connected' | 'degraded' | 'disconnected';

// Draw phase for state machine
type DrawPhase = 'countdown' | 'waiting' | 'revealing' | 'results';

// Local state interface for live draw
interface LocalLiveDrawState {
  connectionState: ConnectionStatusType;
  currentNumberIndex: number;
  revealedDigits: DrawDigitEvent[];
  viewerCount: number;
}

// Connection status component with fade transitions
function ConnectionStatus({
  status,
  prevStatus,
}: {
  status: ConnectionStatusType;
  prevStatus: ConnectionStatusType | null;
}) {
  const { t } = useTranslation();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayStatus, setDisplayStatus] = useState(status);

  useEffect(() => {
    if (prevStatus !== null && prevStatus !== status) {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setDisplayStatus(status);
        setIsTransitioning(false);
      }, 150);
      return () => clearTimeout(timeout);
    }
    setDisplayStatus(status);
    return undefined;
  }, [status, prevStatus]);

  const statusConfig = {
    connecting: {
      icon: <Loader2 className="h-4 w-4 animate-spin" />,
      text: t('draw.connecting'),
      className: 'text-info bg-info/10',
    },
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

  const config = statusConfig[displayStatus];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm transition-all duration-300',
        config.className,
        isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
      )}
    >
      {config.icon}
      <span>{config.text}</span>
    </div>
  );
}

// Pre-draw countdown timer component
function PreDrawCountdown({
  targetTime,
  onComplete,
}: {
  targetTime: Date;
  onComplete: () => void;
}) {
  const { t } = useTranslation();
  const [secondsRemaining, setSecondsRemaining] = useState(() => {
    const diff = Math.max(0, Math.floor((targetTime.getTime() - Date.now()) / 1000));
    return diff;
  });
  const [prevSeconds, setPrevSeconds] = useState(secondsRemaining);
  const hasCompletedRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((targetTime.getTime() - Date.now()) / 1000));
      setPrevSeconds(secondsRemaining);
      setSecondsRemaining(diff);

      if (diff <= 0 && !hasCompletedRef.current) {
        hasCompletedRef.current = true;
        clearInterval(interval);
        onComplete();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onComplete, secondsRemaining]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isLastTenSeconds = secondsRemaining <= 10 && secondsRemaining > 0;
  const digitChanged = prevSeconds !== secondsRemaining;

  // Format as MM:SS
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return (
    <div className="text-center space-y-3">
      <p className="text-text-secondary text-sm">{t('draw.startsIn')}</p>
      <div
        className={cn(
          'flex items-center justify-center gap-2 rtl:flex-row-reverse',
          isLastTenSeconds && 'animate-countdown-pulse'
        )}
      >
        {/* Minutes */}
        <div className="flex gap-1">
          {formattedMinutes.split('').map((digit, idx) => (
            <div
              key={`min-${idx}`}
              className={cn(
                'w-12 h-16 flex items-center justify-center rounded-xl text-3xl font-bold',
                'bg-surface-secondary text-text-primary shadow-md',
                'transition-transform duration-200',
                digitChanged && 'animate-countdown-flip'
              )}
            >
              {digit}
            </div>
          ))}
        </div>

        {/* Separator */}
        <span className={cn(
          'text-3xl font-bold text-text-primary',
          isLastTenSeconds && 'text-brand-gold'
        )}>:</span>

        {/* Seconds */}
        <div className="flex gap-1">
          {formattedSeconds.split('').map((digit, idx) => (
            <div
              key={`sec-${idx}`}
              className={cn(
                'w-12 h-16 flex items-center justify-center rounded-xl text-3xl font-bold',
                'bg-surface-secondary text-text-primary shadow-md',
                'transition-transform duration-200',
                isLastTenSeconds && 'bg-brand-gold/20 text-brand-gold border-2 border-brand-gold',
                digitChanged && 'animate-countdown-flip'
              )}
            >
              {digit}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Waiting state component
function WaitingState() {
  const { t } = useTranslation();

  return (
    <div className="text-center py-8 space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-brand-primary/10 flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-brand-primary animate-spin" />
      </div>
      <p className="text-text-secondary">{t('draw.waitingForDraw')}</p>
    </div>
  );
}

// Slot machine digit component
function SlotMachineDigit({
  finalValue,
  isRevealing,
  isMatching,
  revealDelay,
}: {
  finalValue: number;
  isRevealing: boolean;
  isMatching: boolean;
  revealDelay: number;
}) {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRevealing) return undefined;

    // Start shuffling after delay
    const startTimeout = setTimeout(() => {
      setIsShuffling(true);

      // Rapid number changes during shuffle
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10));
      }, 50);

      // Stop shuffling and reveal final value
      const stopTimeout = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsShuffling(false);
        setDisplayValue(finalValue);
      }, 800);

      return () => clearTimeout(stopTimeout);
    }, revealDelay);

    return () => {
      clearTimeout(startTimeout);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRevealing, finalValue, revealDelay]);

  const showFinal = displayValue === finalValue && !isShuffling;

  return (
    <div
      className={cn(
        'w-8 h-12 flex items-center justify-center rounded-lg text-xl font-bold',
        'transition-all duration-300 transform',
        isShuffling && 'animate-slot-shuffle',
        showFinal && isMatching && 'bg-white border-2 border-brand-gold text-brand-gold scale-110 shadow-lg animate-digit-glow',
        showFinal && !isMatching && 'bg-surface-secondary text-text-primary',
        !showFinal && !isShuffling && 'bg-surface-tertiary text-text-muted',
        isShuffling && 'bg-surface-tertiary text-text-muted'
      )}
    >
      {displayValue !== null ? displayValue : '?'}
    </div>
  );
}

// Slot machine row for a winning number
function SlotMachineRow({
  winningNumber,
  rowIndex,
  isRevealing,
  userTickets,
}: {
  winningNumber: string;
  rowIndex: number;
  isRevealing: boolean;
  userTickets: string[];
}) {
  const { t } = useTranslation();
  const digits = winningNumber.padStart(10, '0').split('').map(Number);

  // Calculate matching digits for highlighting
  const calculateMatchCount = useCallback(() => {
    let bestMatches = 0;
    for (const ticket of userTickets) {
      const ticketDigits = ticket.padStart(10, '0');
      let matches = 0;
      for (let i = 9; i >= 0; i--) {
        if (winningNumber[i] === ticketDigits[i]) {
          matches++;
        } else {
          break;
        }
      }
      bestMatches = Math.max(bestMatches, matches);
    }
    return bestMatches;
  }, [winningNumber, userTickets]);

  const matchCount = calculateMatchCount();
  const hasValidMatch = matchCount >= 3;

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary text-center">
        {t('draw.winningTicket', { index: rowIndex + 1 })}
      </p>
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {digits.map((digit, idx) => {
          const isMatching = hasValidMatch && idx >= (10 - matchCount);
          // Stagger the reveal: each row has a base delay, each digit within row has additional delay
          const rowDelay = rowIndex * 1500;
          const digitDelay = idx * 80;

          return (
            <SlotMachineDigit
              key={idx}
              finalValue={digit}
              isRevealing={isRevealing}
              isMatching={isMatching}
              revealDelay={rowDelay + digitDelay}
            />
          );
        })}
      </div>
    </div>
  );
}

// Matching tickets slide-up card with white background and subtle animations
function MatchingTicketsCard({
  userTickets,
  winningNumbers,
  isVisible,
}: {
  userTickets: string[];
  winningNumbers: string[];
  isVisible: boolean;
}) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Find all matching tickets with their tier info
  const matchingTickets = useMemo(() => {
    const matches: Array<{
      ticket: string;
      matchCount: number;
      tier: keyof typeof PRIZE_TIERS | null;
      prizeAmount: number;
    }> = [];

    for (const ticket of userTickets) {
      const ticketPadded = ticket.padStart(10, '0');
      let bestMatchCount = 0;

      for (const winNum of winningNumbers) {
        let matchCount = 0;
        for (let i = 9; i >= 0; i--) {
          if (ticketPadded[i] === winNum[i]) {
            matchCount++;
          } else {
            break;
          }
        }
        bestMatchCount = Math.max(bestMatchCount, matchCount);
      }

      if (bestMatchCount >= 3) {
        let tier: keyof typeof PRIZE_TIERS | null = null;
        if (bestMatchCount >= 10) tier = 'last_10';
        else if (bestMatchCount >= 7) tier = 'last_7';
        else if (bestMatchCount >= 5) tier = 'last_5';
        else if (bestMatchCount >= 3) tier = 'last_3';

        const prizeAmount = tier ? PRIZE_TIERS[tier].prize : 0;

        matches.push({
          ticket,
          matchCount: bestMatchCount,
          tier,
          prizeAmount,
        });
      }
    }

    return matches.sort((a, b) => b.matchCount - a.matchCount);
  }, [userTickets, winningNumbers]);

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

  const totalPrize = matchingTickets.reduce((sum, m) => sum + m.prizeAmount, 0);
  const hasMatches = matchingTickets.length > 0;

  if (!isVisible) return null;

  return (
    <div className="animate-spring-up">
      <Card
        className={cn(
          'relative overflow-hidden border-2 transition-shadow duration-500',
          hasMatches
            ? 'bg-white border-brand-gold/30 shadow-lg'
            : 'bg-surface-secondary border-border-default'
        )}
      >
        {/* Subtle gradient overlay for winners */}
        {hasMatches && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/5 via-transparent to-brand-secondary/5 pointer-events-none" />
        )}

        <CardContent className="p-4 space-y-4 relative">
          {hasMatches ? (
            <>
              <div className="text-center">
                {/* Trophy with subtle glow */}
                <div className="relative inline-block mb-3">
                  <div className="absolute inset-0 bg-brand-gold/20 rounded-full blur-xl scale-150" />
                  <Trophy className="relative h-10 w-10 text-brand-gold drop-shadow-sm" />
                </div>
                <h3 className="text-xl font-bold text-brand-gold">
                  {t('draw.youWon')}
                </h3>
                <p className="text-3xl font-bold text-text-primary mt-2">
                  {formatCurrency(totalPrize, lang)}
                </p>
              </div>

              <div className="space-y-3">
                {matchingTickets.map((match, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-brand-gold/5 rounded-lg border border-brand-gold/10"
                  >
                    <div>
                      <p className="font-mono text-sm font-semibold text-text-primary">
                        {match.ticket}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {match.matchCount} {t('draw.digitsMatched')}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-bold text-brand-gold">
                        {formatCurrency(match.prizeAmount, lang)}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {getTierLabel(match.tier)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-text-secondary">{t('draw.noMatchingTickets')}</p>
              <p className="text-sm text-text-muted mt-1">{t('draw.keepTrying')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Draw Complete card - shown after overlay is dismissed
function DrawCompleteCard({
  isVisible,
  onViewAllDraws,
}: {
  isVisible: boolean;
  onViewAllDraws: () => void;
}) {
  const { t } = useTranslation();

  if (!isVisible) return null;

  return (
    <div className="animate-spring-up">
      <Card className="bg-white border border-border-default shadow-sm">
        <CardContent className="p-6 text-center space-y-4">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-primary/10 flex items-center justify-center">
            <History className="h-8 w-8 text-brand-primary" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-text-primary">
            {t('draw.simulationComplete')}
          </h3>

          {/* Description */}
          <p className="text-text-secondary">
            {t('draw.viewAllDrawsPrompt')}
          </p>

          {/* Button */}
          <button
            onClick={onViewAllDraws}
            className="w-full lg:w-auto lg:mx-auto flex items-center justify-center gap-2 bg-brand-primary text-white py-3 px-10 rounded-xl font-semibold hover:bg-brand-primary-dark transition-colors"
          >
            <History className="h-5 w-5" />
            {t('draw.viewAllDraws')}
          </button>
        </CardContent>
      </Card>
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

  // Connection state with previous value for fade transitions
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatusType>('connecting');
  const [prevConnectionStatus, setPrevConnectionStatus] = useState<ConnectionStatusType | null>(null);

  const [liveState, setLiveState] = useState<LocalLiveDrawState>({
    connectionState: 'connecting',
    currentNumberIndex: 0,
    revealedDigits: [],
    viewerCount: 0,
  });

  // Draw phase state machine
  const [drawPhase, setDrawPhase] = useState<DrawPhase>('countdown');
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [showMatchingCard, setShowMatchingCard] = useState(false);
  const [overlayDismissed, setOverlayDismissed] = useState(false);

  usePageTitle(t('draw.liveDraw'));

  // Try to get live draw first, fall back to next scheduled draw
  const {
    data: liveDraw,
    isLoading: isLoadingLive,
    error: liveError,
    refetch: refetchLive,
  } = useCurrentDraw();

  const {
    data: nextDraw,
    isLoading: isLoadingNext,
    error: nextError,
    refetch: refetchNext,
  } = useNextDraw();

  // Use live draw if available, otherwise use next scheduled draw
  const currentDraw = liveDraw ?? nextDraw;
  const isLoading = isLoadingLive || isLoadingNext;
  const error = liveError ?? nextError;
  const refetch = () => {
    refetchLive();
    refetchNext();
  };

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

  // Get draw target time for countdown
  const drawTargetTime = useMemo(() => {
    if (currentDraw?.draw_date) {
      // If draw_date is a full ISO string, use it directly
      if (currentDraw.draw_date.includes('T')) {
        return new Date(currentDraw.draw_date);
      }
      // Otherwise combine with draw_time
      const timeStr = currentDraw.draw_time || '21:00:00';
      return new Date(`${currentDraw.draw_date}T${timeStr}`);
    }
    // Default: 12 seconds from now for testing
    return new Date(Date.now() + 12000);
  }, [currentDraw]);

  // Auto-connect on mount and handle reconnection
  useEffect(() => {
    // Start with connecting state
    setConnectionStatus('connecting');

    // Simulate connection establishment
    const connectTimeout = setTimeout(() => {
      if (isOnline) {
        setPrevConnectionStatus('connecting');
        setConnectionStatus('connected');
        setLiveState((prev) => ({ ...prev, connectionState: 'connected' }));
      } else {
        setPrevConnectionStatus('connecting');
        setConnectionStatus('disconnected');
      }
    }, 1500);

    return () => clearTimeout(connectTimeout);
  }, [isOnline]);

  // Handle connection status changes
  useEffect(() => {
    if (!isOnline) {
      setPrevConnectionStatus(connectionStatus);
      setConnectionStatus('disconnected');
    } else if (connectionStatus === 'disconnected') {
      // Auto-reconnect when coming back online
      setPrevConnectionStatus('disconnected');
      setConnectionStatus('connecting');
      const reconnectTimeout = setTimeout(() => {
        setPrevConnectionStatus('connecting');
        setConnectionStatus('connected');
      }, 1000);
      return () => clearTimeout(reconnectTimeout);
    }
    return undefined;
  }, [isOnline, connectionStatus]);

  // Handle countdown completion
  const handleCountdownComplete = useCallback(() => {
    setDrawPhase('waiting');

    // Transition to revealing after a short delay
    const revealTimeout = setTimeout(() => {
      setDrawPhase('revealing');
    }, 2000);

    return () => clearTimeout(revealTimeout);
  }, []);

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

  // Determine phase based on draw status
  useEffect(() => {
    if (currentDraw?.status === 'live') {
      if (drawPhase === 'countdown') {
        // Check if we should skip countdown
        const now = Date.now();
        const targetTime = drawTargetTime.getTime();
        if (now >= targetTime) {
          setDrawPhase('revealing');
        }
      }
    } else if (currentDraw?.status === 'finalized') {
      // Go to revealing phase first to show slot machine animation
      // The revealing useEffect will transition to results after animation
      if (drawPhase === 'countdown' || drawPhase === 'waiting') {
        setDrawPhase('revealing');
      }
    }
  }, [currentDraw?.status, drawPhase, drawTargetTime]);

  // Show result overlay directly after shuffle animation completes
  useEffect(() => {
    if (drawPhase === 'revealing') {
      // Calculate total animation time: 3 rows * 1500ms + 800ms per digit reveal
      const totalAnimationTime = (winningNumbers.length * 1500) + 1000;

      // Show result overlay directly after shuffle finishes
      const overlayTimeout = setTimeout(() => {
        setShowResultOverlay(true);
        setDrawPhase('results');
      }, totalAnimationTime);

      return () => {
        clearTimeout(overlayTimeout);
      };
    }
    return undefined;
  }, [drawPhase, winningNumbers.length]);

  // Show overlay immediately when entering results phase (from any source)
  useEffect(() => {
    if (drawPhase === 'results' && !showResultOverlay && !overlayDismissed) {
      setShowResultOverlay(true);
    }
  }, [drawPhase, showResultOverlay, overlayDismissed]);

  // Handle overlay close - show matching card after overlay is dismissed
  const handleOverlayClose = useCallback(() => {
    setShowResultOverlay(false);
    setOverlayDismissed(true);
    // Show the matching card after overlay closes
    setShowMatchingCard(true);
  }, []);

  const handleShare = useCallback(() => {
    if (currentDraw) {
      navigate(`/prizes/share/${currentDraw.draw_id}`);
    }
  }, [navigate, currentDraw]);

  const handleInviteFriends = useCallback(() => {
    navigate('/referral');
  }, [navigate]);

  const handleViewAllDraws = useCallback(() => {
    navigate('/draws');
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

  if (!currentDraw || (currentDraw.status !== 'live' && currentDraw.status !== 'finalized' && currentDraw.status !== 'scheduled')) {
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
    <div className="bg-surface-primary">
      {/* Result Overlay - shows actual comparison result */}
      <DrawResultOverlay
        type={comparisonResult.resultType}
        prizeAmount={comparisonResult.totalPrize}
        tier={getTierLabel(comparisonResult.bestTier)}
        isVisible={showResultOverlay}
        onShare={handleShare}
        onInviteFriends={handleInviteFriends}
        onClose={handleOverlayClose}
      />

      <div className="py-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t('common:back')}
          </button>
          <ConnectionStatus
            status={connectionStatus}
            prevStatus={prevConnectionStatus}
          />
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
                {formatCurrency(currentDraw.jackpot_amount_iqd ?? 10000000, lang)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Viewer Count */}
        <div className="flex items-center justify-center gap-2 text-text-secondary">
          <Users className="h-4 w-4" />
          <span className="text-sm">
            {t('draw.viewersWatching', { count: formatNumber(liveState.viewerCount || 543210, lang) })}
          </span>
        </div>

        {/* Pre-draw Countdown Phase */}
        {drawPhase === 'countdown' && (
          <Card>
            <CardContent className="p-6">
              <PreDrawCountdown
                targetTime={drawTargetTime}
                onComplete={handleCountdownComplete}
              />
            </CardContent>
          </Card>
        )}

        {/* Waiting Phase */}
        {drawPhase === 'waiting' && <WaitingState />}

        {/* Revealing Phase - Slot Machine Animation */}
        {(drawPhase === 'revealing' || drawPhase === 'results') && (
          <div className="space-y-4">
            {winningNumbers.map((winningNumber, rowIndex) => (
              <SlotMachineRow
                key={rowIndex}
                winningNumber={winningNumber}
                rowIndex={rowIndex}
                isRevealing={drawPhase === 'revealing' || drawPhase === 'results'}
                userTickets={userTickets}
              />
            ))}

            {/* Matching Tickets Card - slides up after reveal */}
            <MatchingTicketsCard
              userTickets={userTickets}
              winningNumbers={winningNumbers}
              isVisible={showMatchingCard}
            />

            {/* Draw Complete Card - shows after overlay is dismissed */}
            <DrawCompleteCard
              isVisible={showMatchingCard}
              onViewAllDraws={handleViewAllDraws}
            />
          </div>
        )}

        {/* Pool Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-text-secondary text-sm mb-1">
              {t('draw.entryPoolSize')}
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {formatNumber(currentDraw.entry_pool_size ?? 0, lang)}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
