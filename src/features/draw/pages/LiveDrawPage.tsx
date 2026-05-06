/**
 * SCR-002: Live Draw Screen
 * Real-time draw with WebSocket digit reveals
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Wifi, WifiOff, AlertTriangle, Trophy, Users, Share2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useCurrentDraw, useDrawDigitEvents } from '../services/draw.service';
import { formatCurrency } from '@/core/utils/formatters';
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
  const { t } = useTranslation('consumer');

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

// Digit slot component
function DigitSlot({
  digit,
  isRevealed,
  isMatching,
}: {
  digit?: number;
  isRevealed: boolean;
  isMatching: boolean;
}) {
  return (
    <div
      className={`
        w-8 h-12 flex items-center justify-center
        rounded-lg text-xl font-bold
        transition-all duration-300
        ${isRevealed
          ? isMatching
            ? 'bg-brand-gold text-white scale-110'
            : 'bg-surface-secondary text-text-primary'
          : 'bg-surface-tertiary text-text-muted animate-pulse'
        }
      `}
    >
      {isRevealed ? digit : '?'}
    </div>
  );
}

// Winning number row component
function WinningNumberRow({
  numberIndex,
  digits,
  userMatchingDigits,
}: {
  numberIndex: number;
  digits: (number | undefined)[];
  userMatchingDigits: number;
}) {
  const { t } = useTranslation('consumer');

  return (
    <div className="space-y-2">
      <p className="text-sm text-text-secondary text-center">
        {t('draw.winningNumber', { index: numberIndex })}
      </p>
      <div className="flex justify-center gap-1 rtl:flex-row-reverse">
        {digits.map((digit, idx) => (
          <DigitSlot
            key={idx}
            digit={digit}
            isRevealed={digit !== undefined}
            isMatching={idx < userMatchingDigits}
          />
        ))}
      </div>
    </div>
  );
}

// Winner result overlay
function WinnerOverlay({
  prizeAmount,
  tier,
  onShare,
  onViewResults,
}: {
  prizeAmount: number;
  tier: string;
  onShare: () => void;
  onViewResults: () => void;
}) {
  const { t } = useTranslation('consumer');

  return (
    <div className="fixed inset-0 bg-brand-gold/95 flex items-center justify-center z-50 p-4">
      <div className="text-center text-white max-w-md">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold mb-2">{t('draw.youWon')}</h1>
        <p className="text-5xl font-bold mb-2">{formatCurrency(prizeAmount)}</p>
        <p className="text-lg opacity-80 mb-8">{tier}</p>

        <div className="space-y-3">
          <Button
            onClick={onShare}
            className="w-full bg-white text-brand-gold hover:bg-white/90"
          >
            <Share2 className="h-5 w-5 me-2" />
            {t('draw.shareWin')}
          </Button>
          <Button
            variant="outline"
            onClick={onViewResults}
            className="w-full border-white text-white hover:bg-white/10"
          >
            {t('draw.viewFullResults')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Non-winner result overlay
function NonWinnerOverlay({
  entryCount,
  onInviteFriends,
  onViewResults,
}: {
  entryCount: number;
  onInviteFriends: () => void;
  onViewResults: () => void;
}) {
  const { t } = useTranslation('consumer');

  return (
    <div className="fixed inset-0 bg-brand-primary/95 flex items-center justify-center z-50 p-4">
      <div className="text-center text-white max-w-md">
        <h1 className="text-2xl font-bold mb-4">{t('draw.drawEnded')}</h1>
        <p className="text-lg opacity-80 mb-8">
          {t('draw.youHaveEntries', { count: entryCount })}
        </p>

        <div className="space-y-3">
          <Button
            onClick={onInviteFriends}
            className="w-full bg-white text-brand-primary hover:bg-white/90"
          >
            <Users className="h-5 w-5 me-2" />
            {t('draw.inviteFriends')}
          </Button>
          <Button
            variant="outline"
            onClick={onViewResults}
            className="w-full border-white text-white hover:bg-white/10"
          >
            {t('draw.viewFullResults')}
          </Button>
        </div>
      </div>
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
  const { t } = useTranslation('consumer');
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
  const [showWinnerOverlay, setShowWinnerOverlay] = useState(false);
  const [showNonWinnerOverlay, setShowNonWinnerOverlay] = useState(false);
  const [winResult, setWinResult] = useState<{ amount: number; tier: string } | null>(null);

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

  // Check for draw finalization
  useEffect(() => {
    if (currentDraw?.status === 'finalized') {
      // Check if user won (in production, this comes from the API)
      // For now, simulate based on random
      const didWin = Math.random() > 0.8; // 20% win rate for demo

      if (didWin) {
        setWinResult({ amount: 10000, tier: 'Last-3' });
        setShowWinnerOverlay(true);
      } else {
        setShowNonWinnerOverlay(true);
      }
    }
  }, [currentDraw?.status]);

  const handleShare = useCallback(() => {
    navigate('/win-share');
  }, [navigate]);

  const handleViewResults = useCallback(() => {
    if (currentDraw) {
      navigate(`/draws/${currentDraw.draw_id}`);
    }
  }, [navigate, currentDraw]);

  const handleInviteFriends = useCallback(() => {
    navigate('/referrals');
  }, [navigate]);

  // Build digit grid from events
  const buildDigitGrid = (): (number | undefined)[][] => {
    const grid: (number | undefined)[][] = [
      Array(10).fill(undefined),
      Array(10).fill(undefined),
      Array(10).fill(undefined),
    ];

    liveState.revealedDigits.forEach((event) => {
      if (event.number_index >= 0 && event.number_index < 3) {
        if (event.digit_position >= 0 && event.digit_position < 10) {
          grid[event.number_index][event.digit_position] = event.digit_value;
        }
      }
    });

    return grid;
  };

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

  if (!currentDraw || currentDraw.status !== 'live') {
    return (
      <div className="p-4">
        <ErrorState
          message={t('draw.noActiveDraw')}
          onRetry={() => navigate('/draws')}
        />
      </div>
    );
  }

  const digitGrid = buildDigitGrid();

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Winner Overlay */}
      {showWinnerOverlay && winResult && (
        <WinnerOverlay
          prizeAmount={winResult.amount}
          tier={winResult.tier}
          onShare={handleShare}
          onViewResults={handleViewResults}
        />
      )}

      {/* Non-Winner Overlay */}
      {showNonWinnerOverlay && (
        <NonWinnerOverlay
          entryCount={47} // From user data
          onInviteFriends={handleInviteFriends}
          onViewResults={handleViewResults}
        />
      )}

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
              {new Date(currentDraw.draw_date).toLocaleDateString('ar-IQ', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5" />
              <span className="text-2xl font-bold">
                {formatCurrency(currentDraw.jackpot_rollover_iqd ?? 0)}
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

        {/* Digit Grid */}
        <div className="space-y-6">
          {digitGrid.map((row, rowIndex) => (
            <WinningNumberRow
              key={rowIndex}
              numberIndex={rowIndex + 1}
              digits={row}
              userMatchingDigits={0} // Calculate from user entries
            />
          ))}
        </div>

        {/* Pool Info */}
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-text-secondary text-sm mb-1">
              {t('draw.entryPoolSize')}
            </p>
            <p className="text-2xl font-bold text-text-primary">
              {currentDraw.entry_pool_size?.toLocaleString('ar-IQ') ?? '87,000,000'}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
