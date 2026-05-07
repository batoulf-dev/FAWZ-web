/**
 * DrawHeroCard Component
 * Full-width dominant hero card showing active tickets and countdown/live status
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { TicketCheck, Clock } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Skeleton } from '@/shared/components/Skeleton';
import { formatNumber, formatCountdown, getSecondsUntil, formatDate } from '@/core/utils/formatters';
import { cn } from '@/core/utils/cn';

interface DrawHeroCardProps {
  activeTickets: number;
  nextDrawDate: string | null;
  drawType: 'weekly' | 'monthly';
  drawStatus: 'scheduled' | 'live' | 'completed';
  isLoading?: boolean;
  onTicketsClick?: () => void;
  /** @deprecated - DrawHeroCard always navigates to /draws now */
  onDrawClick?: () => void;
}

export function DrawHeroCard({
  activeTickets,
  nextDrawDate,
  drawType,
  drawStatus,
  isLoading = false,
  onTicketsClick,
  onDrawClick: _onDrawClick,
}: DrawHeroCardProps): React.ReactElement {
  // _onDrawClick is intentionally unused - DrawHeroCard always navigates to /draws
  void _onDrawClick;
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const lang = i18n.language;

  // Live countdown state
  const [secondsRemaining, setSecondsRemaining] = useState<number>(
    nextDrawDate ? getSecondsUntil(nextDrawDate) : 0
  );

  // Update countdown every second
  useEffect(() => {
    if (!nextDrawDate || drawStatus === 'live') return;

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
  }, [nextDrawDate, drawStatus]);

  const isLive = drawStatus === 'live';

  const handleClick = (): void => {
    if (isLive) {
      navigate('/draws/live');
    } else {
      // DEV ONLY: Always navigate to past draws list (SCR-003) when clicking the hero card
      // This is for browsing results, NOT the next/scheduled draw
      navigate('/draws');
    }
  };

  if (isLoading) {
    return (
      <Card className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-white/10 shadow-2xl shadow-black/50">
        <CardContent className="p-5 min-h-[200px] flex flex-col justify-center">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <Skeleton className="h-12 w-20 mb-2 bg-zinc-700" />
              <Skeleton className="h-4 w-28 bg-zinc-700" />
            </div>
            <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="flex-1 text-end">
              <Skeleton className="h-4 w-20 mb-2 ms-auto bg-zinc-700" />
              <Skeleton className="h-8 w-28 ms-auto bg-zinc-700" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'bg-gradient-to-br from-zinc-950 via-zinc-900 to-black border border-white/10 shadow-2xl shadow-black/50 overflow-hidden cursor-pointer transition-all relative',
        isLive && 'ring-2 ring-red-500 animate-pulse'
      )}
      onClick={handleClick}
    >
      {/* Premium shine overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left golden glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_20%_-10%,rgba(251,191,36,0.25),transparent)]" />
        {/* Bottom-right purple glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_90%_110%,rgba(168,85,247,0.2),transparent)]" />
        {/* Center subtle highlight */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_30%_at_50%_0%,rgba(255,255,255,0.15),transparent)]" />
        {/* Top edge shine line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        {/* Glossy top reflection */}
        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.08] to-transparent" />
      </div>

      {/* Subtle sparkle pattern */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.8)_1px,transparent_1px)] bg-[length:24px_24px]" />
      </div>

      <CardContent className="p-5 relative min-h-[200px] flex flex-col justify-center">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Ticket Count */}
          <div
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              onTicketsClick?.();
            }}
          >
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-5xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]">
                {formatNumber(activeTickets, lang)}
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-2">
              {t('home.activeTickets')}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full">
              <TicketCheck className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-medium text-amber-300">
                {t('home.inCurrentDraw')}
              </span>
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />

          {/* Right: Countdown/Live Status */}
          <div className="flex-1 text-end">
            <div className="inline-flex items-center gap-1.5 mb-2 justify-end">
              <Clock className="h-4 w-4 text-purple-400" />
              <p className="text-purple-400 text-xs font-medium uppercase tracking-wide">
                {drawType === 'weekly' ? t('draw.weeklyDraw') : t('draw.monthlyDraw')}
              </p>
            </div>

            {isLive ? (
              <>
                <p className="text-3xl font-bold text-emerald-400 mb-1 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]">
                  {t('draw.liveNow')}
                </p>
                <p className="text-zinc-400 text-sm">
                  {t('home.watchLive')} →
                </p>
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-white font-mono tracking-wider mb-1 drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                  {formatCountdown(secondsRemaining)}
                </p>
                {nextDrawDate && (
                  <p className="text-zinc-400 text-sm">
                    {formatDate(nextDrawDate, 'PPP', lang)}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
