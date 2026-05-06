/**
 * SCR-001: Fawz Tab Home
 * Main dashboard with entry count, draw countdown, challenges, referrals
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router';
import { Bell, Gift, Users, ChevronLeft, Trophy, Ticket } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/Card';
import { Button } from '@/shared/components/Button';
import { Skeleton } from '@/shared/components/Skeleton';
import { EmptyState } from '@/shared/components/EmptyState';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useNextDraw } from '@/features/draw/services/draw.service';
import { useActiveChallenges } from '@/features/challenges/services/challenges.service';
import { useEntrySummary } from '@/features/entries/services/entries.service';
import { useReferralStats } from '@/features/referrals/services/referrals.service';
import { formatCurrency, formatCountdown } from '@/core/utils/formatters';
import { useEffect, useState } from 'react';

// Weekly Spark Progress Component
function WeeklySparkBar({ daysCompleted }: { daysCompleted: number }) {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  return (
    <div className="flex items-center gap-1">
      {days.map((day, index) => (
        <div
          key={day}
          className={`h-2 flex-1 rounded-full ${
            index < daysCompleted ? 'bg-brand-gold' : 'bg-surface-secondary'
          }`}
          title={day}
        />
      ))}
    </div>
  );
}

// Challenge Card Component
function ChallengeCard({
  name,
  progress,
  target,
  reward,
  daysRemaining,
  challengeId,
}: {
  name: string;
  progress: number;
  target: number;
  reward: string;
  daysRemaining: number;
  challengeId: string;
}) {
  const { t } = useTranslation('consumer');
  const navigate = useNavigate();
  const progressPercent = Math.min((progress / target) * 100, 100);

  return (
    <Card
      className="min-w-[280px] cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/challenges/${challengeId}`)}
    >
      <CardContent className="p-4">
        <h3 className="font-semibold text-text-primary mb-2">{name}</h3>
        <div className="mb-2">
          <div className="h-2 bg-surface-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">
            {progress}/{target}
          </span>
          <span className="text-brand-primary font-medium">{reward}</span>
        </div>
        <p className="text-xs text-text-muted mt-2">
          {t('challenge.endsIn', { days: daysRemaining })}
        </p>
      </CardContent>
    </Card>
  );
}

// Draw Countdown Component
function DrawCountdown({ drawDate, jackpot, drawType }: {
  drawDate: string;
  jackpot: number;
  drawType: string;
}) {
  const { t } = useTranslation('consumer');
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const draw = new Date(drawDate);
      const diff = draw.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown(t('draw.live'));
        return;
      }

      setCountdown(formatCountdown(diff));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [drawDate, t]);

  return (
    <Card
      className="bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white cursor-pointer"
      onClick={() => navigate('/draws')}
    >
      <CardContent className="p-6 text-center">
        <p className="text-sm opacity-80 mb-1">
          {drawType === 'weekly' ? t('draw.weekly') : t('draw.monthly')}
        </p>
        <p className="text-3xl font-bold mb-2">{countdown}</p>
        <div className="flex items-center justify-center gap-2">
          <Trophy className="h-5 w-5" />
          <span className="text-xl font-semibold">{formatCurrency(jackpot)}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// Entry Count Hero Component
function EntryCountHero({ count, onTap }: { count: number; onTap: () => void }) {
  const { t } = useTranslation('consumer');

  return (
    <Card
      className="bg-brand-gold/10 border-brand-gold/20 cursor-pointer"
      onClick={onTap}
    >
      <CardContent className="p-6 text-center">
        <Ticket className="h-8 w-8 text-brand-gold mx-auto mb-2" />
        <p className="text-5xl font-bold text-brand-gold mb-1">{count}</p>
        <p className="text-text-secondary">{t('entries.myNumbers')}</p>
      </CardContent>
    </Card>
  );
}

// Loading skeleton
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
      <Skeleton className="h-32 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <Skeleton key={i} className="h-2 flex-1 rounded-full" />
        ))}
      </div>
      <div className="flex gap-4 overflow-x-auto">
        <Skeleton className="h-32 min-w-[280px] rounded-xl" />
        <Skeleton className="h-32 min-w-[280px] rounded-xl" />
      </div>
    </div>
  );
}

export default function DashboardPage(): React.ReactElement {
  const { t } = useTranslation('consumer');
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('home.title'));

  // Data fetching
  const {
    data: nextDraw,
    isLoading: drawLoading,
    error: drawError,
    refetch: refetchDraw,
  } = useNextDraw();

  const {
    data: challenges,
    isLoading: challengesLoading,
    error: challengesError,
  } = useActiveChallenges();

  const {
    data: entrySummary,
    isLoading: entriesLoading,
    error: entriesError,
  } = useEntrySummary();

  const { data: referralStats } = useReferralStats();

  const isLoading = drawLoading || challengesLoading || entriesLoading;
  const error = drawError || challengesError || entriesError;

  // Check if live draw is active
  const isLiveDraw = nextDraw?.status === 'live';

  // Auto-redirect to live draw
  useEffect(() => {
    if (isLiveDraw) {
      navigate('/draws/live');
    }
  }, [isLiveDraw, navigate]);

  if (isLoading) {
    return (
      <div className="p-4">
        <DashboardSkeleton />
      </div>
    );
  }

  if (error && isOnline) {
    return (
      <div className="p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetchDraw()}
        />
      </div>
    );
  }

  const entryCount = entrySummary?.current_draw_count ?? 0;
  const weeklySparkDays = entrySummary?.weekly_unique_days ?? 0;
  const isNewUser = entryCount === 0 && !entrySummary?.lifetime_count;

  return (
    <div className="min-h-screen bg-surface-primary">
      {!isOnline && <OfflineBanner />}

      <div className="p-4 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-text-primary">
            {t('home.welcome')}
          </h1>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Bell className="h-6 w-6" />
            {/* Notification badge - would be dynamic */}
          </button>
        </div>

        {/* Live Draw Banner */}
        {isLiveDraw && (
          <Card
            className="bg-error animate-pulse cursor-pointer"
            onClick={() => navigate('/draws/live')}
          >
            <CardContent className="p-4 text-center text-white">
              <span className="text-lg font-bold">
                🔴 {t('draw.liveNow')}
              </span>
            </CardContent>
          </Card>
        )}

        {/* Draw Countdown */}
        {nextDraw && !isLiveDraw && (
          <DrawCountdown
            drawDate={nextDraw.draw_date}
            jackpot={nextDraw.jackpot_rollover_iqd ?? 0}
            drawType={nextDraw.draw_type}
          />
        )}

        {/* Entry Count Hero */}
        {isNewUser ? (
          <EmptyState
            icon={<Ticket className="h-12 w-12" />}
            title={t('entries.noEntriesYet')}
            description={t('entries.startPayingToEarn')}
          />
        ) : (
          <EntryCountHero
            count={entryCount}
            onTap={() => navigate('/my-numbers')}
          />
        )}

        {/* Weekly Spark Progress */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-text-primary">
              {t('challenge.weeklySpark')}
            </h2>
            <Link
              to="/challenges/weekly-spark"
              className="text-sm text-brand-primary"
            >
              {t('common.details')}
            </Link>
          </div>
          <WeeklySparkBar daysCompleted={weeklySparkDays} />
          <p className="text-xs text-text-muted mt-1">
            {t('challenge.weeklySparkProgress', { days: weeklySparkDays })}
          </p>
        </div>

        {/* Active Challenges */}
        {challenges && challenges.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-text-primary">
                {t('challenge.activeChallenges')}
              </h2>
              <Link
                to="/challenges"
                className="text-sm text-brand-primary flex items-center gap-1"
              >
                {t('common.viewAll')}
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
              {challenges.slice(0, 3).map((challenge) => (
                <ChallengeCard
                  key={challenge.challenge_id}
                  challengeId={challenge.challenge_id}
                  name={challenge.name_ar}
                  progress={challenge.userProgress?.current_value ?? 0}
                  target={challenge.target_value}
                  reward={`+${challenge.reward_entries} ${t('entries.numbers')}`}
                  daysRemaining={challenge.daysRemaining ?? 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* Referral Teaser */}
        <Card
          className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 cursor-pointer"
          onClick={() => navigate('/referrals')}
        >
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-primary/10 rounded-lg">
                <Users className="h-5 w-5 text-brand-primary" />
              </div>
              <div>
                <p className="font-semibold text-text-primary">
                  {t('referral.inviteFriends')}
                </p>
                <p className="text-sm text-text-secondary">
                  {referralStats?.successful_referrals ?? 0} {t('referral.successfulReferrals')}
                </p>
              </div>
            </div>
            <Gift className="h-6 w-6 text-brand-gold" />
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/draws')}
            className="justify-start"
          >
            <Trophy className="h-5 w-5 me-2" />
            {t('nav.draws')}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate('/prizes')}
            className="justify-start"
          >
            <Gift className="h-5 w-5 me-2" />
            {t('nav.prizes')}
          </Button>
        </div>
      </div>
    </div>
  );
}
