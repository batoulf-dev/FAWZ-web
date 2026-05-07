/**
 * Draw Simulation Page
 * Replays the last finalized draw with slot machine animation
 * Then prompts user to view all past draws
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Trophy, History } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useDrawList } from '../services/draw.service';
import { useEntryList } from '@/features/entries/services/entries.service';
import { formatCurrency, formatLocalizedDate, DATE_FORMAT_PRESETS } from '@/core/utils/formatters';
import { DrawResultOverlay } from '../components';
import { compareTickets, PRIZE_TIERS } from '../components/utils';
import { cn } from '@/core/utils/cn';

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

// Loading skeleton
function SimulationSkeleton() {
  return (
    <div className="p-4 space-y-6">
      <Skeleton className="h-6 w-32" />
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

// Prompt to navigate to draws page
function ViewDrawsPrompt({ onViewDraws }: { onViewDraws: () => void }) {
  const { t } = useTranslation();

  return (
    <div className="animate-spring-up">
      <Card className="bg-white border-2 border-brand-primary/20 shadow-lg">
        <CardContent className="p-6 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-brand-primary/10 flex items-center justify-center">
            <History className="h-8 w-8 text-brand-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-primary mb-2">
              {t('draw.simulationComplete')}
            </h3>
            <p className="text-sm text-text-secondary">
              {t('draw.viewAllDrawsPrompt')}
            </p>
          </div>
          <Button
            onClick={onViewDraws}
            className="w-full"
            size="lg"
          >
            <History className="h-5 w-5 me-2" />
            {t('draw.viewAllDraws')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function DrawSimulationPage(): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();

  const [isRevealing, setIsRevealing] = useState(false);
  const [showResultOverlay, setShowResultOverlay] = useState(false);
  const [showViewDrawsPrompt, setShowViewDrawsPrompt] = useState(false);

  usePageTitle(t('draw.lastDrawSimulation'));

  // Fetch finalized draws to get the most recent one
  const {
    data: drawsData,
    isLoading,
    error,
    refetch,
  } = useDrawList({ status: 'finalized', page_size: 1 });

  // Get the most recent finalized draw
  const lastDraw = drawsData?.draws_list?.[0] ?? null;

  // Fetch user's entries for ticket comparison
  const { data: entriesData } = useEntryList({ outcome: 'active', page_size: 50 });

  // Build winning numbers from the draw data
  const winningNumbers = useMemo(() => {
    const numbers: string[] = [];
    if (lastDraw?.winning_number_1) numbers.push(String(lastDraw.winning_number_1).padStart(10, '0'));
    if (lastDraw?.winning_number_2) numbers.push(String(lastDraw.winning_number_2).padStart(10, '0'));
    if (lastDraw?.winning_number_3) numbers.push(String(lastDraw.winning_number_3).padStart(10, '0'));
    return numbers;
  }, [lastDraw]);

  // Extract user tickets from entries
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

  // Start revealing animation when draw data is loaded
  useEffect(() => {
    if (lastDraw && winningNumbers.length > 0 && !isRevealing) {
      // Small delay before starting animation
      const startTimeout = setTimeout(() => {
        setIsRevealing(true);
      }, 500);
      return () => clearTimeout(startTimeout);
    }
    return undefined;
  }, [lastDraw, winningNumbers.length, isRevealing]);

  // Show result overlay after animation completes
  useEffect(() => {
    if (isRevealing && winningNumbers.length > 0) {
      // Calculate total animation time: rows * 1500ms + 800ms per digit reveal + buffer
      const totalAnimationTime = (winningNumbers.length * 1500) + 1000;

      const overlayTimeout = setTimeout(() => {
        setShowResultOverlay(true);
      }, totalAnimationTime);

      return () => clearTimeout(overlayTimeout);
    }
    return undefined;
  }, [isRevealing, winningNumbers.length]);

  // Handle overlay close - show prompt to view draws
  const handleOverlayClose = useCallback(() => {
    setShowResultOverlay(false);
    setShowViewDrawsPrompt(true);
  }, []);

  const handleViewDraws = useCallback(() => {
    navigate('/draws');
  }, [navigate]);

  const handleShare = useCallback(() => {
    if (lastDraw) {
      navigate(`/prizes/share/${lastDraw.draw_id}`);
    }
  }, [navigate, lastDraw]);

  const handleInviteFriends = useCallback(() => {
    navigate('/referral');
  }, [navigate]);

  if (isLoading) {
    return <SimulationSkeleton />;
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

  if (!lastDraw) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('draw.noDrawsAvailable')}
          onRetry={() => navigate('/draws')}
        />
      </div>
    );
  }

  return (
    <div className="bg-surface-primary">
      {/* Result Overlay */}
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
        <div className="flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            <ArrowRight className="h-4 w-4 ltr:rotate-180" />
            {t('common:back')}
          </button>
        </div>

        {/* Draw Title Card */}
        <Card className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white">
          <CardContent className="p-4 text-center">
            <p className="text-sm opacity-80 mb-1">{t('draw.lastDrawReplay')}</p>
            <h1 className="text-xl font-bold mb-2">
              {lastDraw.draw_type === 'weekly' ? t('draw.weeklyDraw') : t('draw.monthlyDraw')}
            </h1>
            <p className="text-sm opacity-80 mb-3">
              {formatLocalizedDate(lastDraw.draw_date, DATE_FORMAT_PRESETS.full, lang)}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {formatCurrency(lastDraw.jackpot_amount_iqd ?? 10000000, lang)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Slot Machine Animation */}
        {winningNumbers.length > 0 && (
          <div className="space-y-4">
            {winningNumbers.map((winningNumber, rowIndex) => (
              <SlotMachineRow
                key={rowIndex}
                winningNumber={winningNumber}
                rowIndex={rowIndex}
                isRevealing={isRevealing}
                userTickets={userTickets}
              />
            ))}
          </div>
        )}

        {/* View Draws Prompt - shows after overlay is closed */}
        {showViewDrawsPrompt && (
          <ViewDrawsPrompt onViewDraws={handleViewDraws} />
        )}
      </div>
    </div>
  );
}
