/**
 * TicketStatsRow Component
 * 2-column info grid showing active tickets count and countdown timer
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Ticket, Clock } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatNumber, formatCountdown, getSecondsUntil } from '@/core/utils/formatters';

interface TicketStatsRowProps {
  activeTickets: number;
  nextDrawDate: string | null;
  drawType: 'weekly' | 'monthly';
  isLoading?: boolean;
  onTicketsClick?: () => void;
  onCountdownClick?: () => void;
}

export function TicketStatsRow({
  activeTickets,
  nextDrawDate,
  drawType,
  isLoading = false,
  onTicketsClick,
  onCountdownClick,
}: TicketStatsRowProps): React.ReactElement {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  // Live countdown state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    nextDrawDate ? getSecondsUntil(nextDrawDate) : 0
  );

  // Update countdown every second
  useEffect(() => {
    if (!nextDrawDate) return;

    // Initial calculation
    setSecondsRemaining(getSecondsUntil(nextDrawDate));

    const interval = setInterval(() => {
      const remaining = getSecondsUntil(nextDrawDate);
      setSecondsRemaining(remaining);

      // Stop interval when countdown reaches 0
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDrawDate]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-24 rounded-xl" />
        <Skeleton className="h-24 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Active Tickets Card */}
      <Card
        className="bg-brand-primary/5 border-brand-primary/20 cursor-pointer hover:bg-brand-primary/10 transition-colors"
        onClick={onTicketsClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
              <Ticket className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium">{t('home.activeTickets')}</span>
          </div>
          <p className="text-3xl font-bold text-text-primary">
            {formatNumber(activeTickets, lang)}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {t('home.inCurrentDraw')}
          </p>
        </CardContent>
      </Card>

      {/* Countdown Timer Card */}
      <Card
        className="bg-gradient-to-br from-brand-primary/5 to-brand-primary/10 border-brand-primary/20 cursor-pointer hover:from-brand-primary/10 hover:to-brand-primary/15 transition-colors"
        onClick={onCountdownClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-brand-primary mb-2">
            <div className="p-1.5 bg-brand-primary/10 rounded-lg">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-xs font-medium">
              {drawType === 'weekly' ? t('draw.weeklyDraw') : t('draw.monthlyDraw')}
            </span>
          </div>

          {secondsRemaining > 0 ? (
            <>
              <p className="text-2xl font-bold text-text-primary font-mono tracking-wider">
                {formatCountdown(secondsRemaining)}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t('home.untilDraw')}
              </p>
            </>
          ) : (
            <>
              <p className="text-xl font-bold text-success">
                {t('draw.liveNow')}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                {t('home.watchLive')}
              </p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
