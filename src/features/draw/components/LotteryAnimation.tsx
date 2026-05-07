/**
 * Lottery Animation Component
 * Animated number reveal with shuffling effect for draw results
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { cn } from '@/core/utils/cn';

interface LotteryAnimationProps {
  /** The winning number to reveal (10 digits) */
  winningNumber: string;
  /** User's entry numbers to compare against (supports multiple tickets) */
  userTickets?: string[];
  /** @deprecated Use userTickets instead */
  userNumber?: string;
  /** Animation duration in ms (default 2000) */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: (matchingDigits: number) => void;
  /** Whether to auto-start animation */
  autoStart?: boolean;
  /** Label for this number row */
  label?: string;
}

function SpinningDigit({
  finalValue,
  isRevealed,
  isMatching,
  spinDuration,
  delay,
}: {
  finalValue: number;
  isRevealed: boolean;
  isMatching: boolean;
  spinDuration: number;
  delay: number;
}) {
  const [displayValue, setDisplayValue] = useState(Math.floor(Math.random() * 10));
  const [isSpinning, setIsSpinning] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isRevealed) return undefined;

    let stopTimeout: NodeJS.Timeout | null = null;

    // Start spinning after delay
    const startTimeout = setTimeout(() => {
      setIsSpinning(true);

      // Rapid number changes during spin
      intervalRef.current = setInterval(() => {
        setDisplayValue(Math.floor(Math.random() * 10));
      }, 50);

      // Stop spinning and show final value
      stopTimeout = setTimeout(() => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
        setIsSpinning(false);
        setShowFinal(true);
        setDisplayValue(finalValue);
      }, spinDuration);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (stopTimeout) {
        clearTimeout(stopTimeout);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRevealed, finalValue, spinDuration, delay]);

  return (
    <div
      className={cn(
        'w-8 h-12 flex items-center justify-center rounded-lg text-xl font-bold',
        'transition-all duration-300 transform',
        isSpinning && 'scale-110',
        // Matching digits: white background with golden border and golden text for readability
        showFinal && isMatching && 'bg-white border-2 border-brand-gold text-brand-gold scale-110 shadow-lg shadow-brand-gold/40',
        showFinal && !isMatching && 'bg-surface-secondary text-text-primary',
        !showFinal && 'bg-surface-tertiary text-text-muted'
      )}
    >
      <span
        className={cn(
          'transition-transform',
          isSpinning && 'animate-pulse'
        )}
      >
        {showFinal ? finalValue : isSpinning ? displayValue : '?'}
      </span>
    </div>
  );
}

export function LotteryAnimation({
  winningNumber,
  userTickets,
  userNumber,
  duration = 2000,
  onComplete,
  autoStart = true,
  label,
}: LotteryAnimationProps): JSX.Element {
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const digits = winningNumber.padStart(10, '0').split('').map(Number);

  // Support both userTickets array and legacy userNumber prop
  const allUserTickets = useMemo(
    () => userTickets ?? (userNumber ? [userNumber] : []),
    [userTickets, userNumber]
  );

  // Calculate best matching digits from any user ticket (lottery style)
  const calculateBestMatchingDigits = useCallback(() => {
    if (allUserTickets.length === 0) return 0;

    let bestMatches = 0;
    for (const ticket of allUserTickets) {
      const userDigits = ticket.padStart(10, '0').split('').map(Number);
      let matches = 0;
      for (let i = digits.length - 1; i >= 0; i--) {
        if (digits[i] === userDigits[i]) {
          matches++;
        } else {
          break;
        }
      }
      bestMatches = Math.max(bestMatches, matches);
    }
    return bestMatches;
  }, [digits, allUserTickets]);

  useEffect(() => {
    if (autoStart && !isAnimating && !isComplete) {
      setIsAnimating(true);

      // Complete after full duration
      const timeout = setTimeout(() => {
        setIsAnimating(false);
        setIsComplete(true);
        const matchingDigits = calculateBestMatchingDigits();
        onComplete?.(matchingDigits);
      }, duration + 500); // Extra time for final reveal

      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [autoStart, isAnimating, isComplete, duration, onComplete, calculateBestMatchingDigits]);

  const matchingDigits = calculateBestMatchingDigits();

  return (
    <div className="space-y-2">
      {label && (
        <p className="text-sm text-text-secondary text-center">{label}</p>
      )}
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {digits.map((digit, idx) => {
          // Only highlight if user has a valid prize tier match (>= 3 digits)
          // matchingDigits must be >= 3 to qualify for any prize tier
          const hasValidMatch = matchingDigits >= 3;
          const isMatching = hasValidMatch && idx >= digits.length - matchingDigits;
          const delay = idx * (duration / digits.length);
          const spinDuration = duration / 2;

          return (
            <SpinningDigit
              key={idx}
              finalValue={digit}
              isRevealed={isAnimating || isComplete}
              isMatching={isMatching}
              spinDuration={spinDuration}
              delay={delay}
            />
          );
        })}
      </div>
    </div>
  );
}

export default LotteryAnimation;
