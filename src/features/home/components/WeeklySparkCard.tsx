/**
 * WeeklySparkCard Component
 * Shows 7-day pill row for weekly unique transaction days tracking
 */

import { useTranslation } from 'react-i18next';
import { Trophy, Flame } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { cn } from '@/core/utils/cn';

interface WeeklySparkCardProps {
  weeklyUniqueDays: number;
  isLoading?: boolean;
}

// Day labels for the pills
const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_LABELS_AR = ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'ح'];

export function WeeklySparkCard({
  weeklyUniqueDays,
  isLoading = false,
}: WeeklySparkCardProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === 'ar';
  const dayLabels = isRtl ? DAY_LABELS_AR : DAY_LABELS;

  // Get current day of week (0 = Sunday, adjust for Mon-Sun display)
  const today = new Date().getDay();
  const currentDayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0, Sun=6

  const isSparkEarned = weeklyUniqueDays >= 5;

  if (isLoading) {
    return (
      <Card className="bg-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between gap-2 mb-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-9 rounded-full" />
            ))}
          </div>
          <Skeleton className="h-4 w-40" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {t('home.weeklySpark')}
            </span>
          </div>
        </div>

        {/* 7 Day Pills Row */}
        <div className="flex justify-between gap-2 mb-3">
          {dayLabels.map((label, index) => {
            const isFilled = index < weeklyUniqueDays;
            const isCurrentDay = index === currentDayIndex && !isFilled;

            return (
              <div
                key={index}
                className={cn(
                  'flex-1 h-7 max-w-9 rounded-full flex items-center justify-center gap-0.5 text-xs font-medium transition-all',
                  isFilled && 'bg-amber-400 text-amber-900 shadow-sm shadow-amber-200',
                  isCurrentDay && 'border-2 border-amber-400 bg-transparent text-amber-500 animate-pulse',
                  !isFilled && !isCurrentDay && 'bg-muted text-muted-foreground'
                )}
              >
                <span>{label}</span>
                <Flame className={cn(
                  'h-2.5 w-2.5',
                  isFilled ? 'text-orange-600' : 'text-current opacity-40'
                )} />
              </div>
            );
          })}
        </div>

        {/* Status Text */}
        {isSparkEarned ? (
          <p className="text-sm text-amber-500 font-medium spark-confetti">
            {t('home.weeklySparkEarned')}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            {t('home.daysCompletedThisWeek', { count: weeklyUniqueDays })}
          </p>
        )}
      </CardContent>

      {/* Confetti animation styles */}
      <style>{`
        @keyframes confetti-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .spark-confetti {
          animation: confetti-pop 0.6s ease-in-out infinite;
        }
      `}</style>
    </Card>
  );
}
