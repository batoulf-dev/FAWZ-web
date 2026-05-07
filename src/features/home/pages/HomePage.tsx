/**
 * SCR-001: Home Page (Fawz Tab)
 * Main dashboard showing draw hero, jackpot, weekly spark, challenges, referral teaser, and balance
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trophy, ChevronLeft } from 'lucide-react';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useHomePageData } from '../services/home.service';
import { DrawHeroCard } from '../components/DrawHeroCard';
import { JackpotCard } from '../components/JackpotCard';
import { WeeklySparkCard } from '../components/WeeklySparkCard';
import { ReferralTeaserCard } from '../components/ReferralTeaserCard';
import { CompactBalanceCard } from '../components/CompactBalanceCard';
import { ChallengeListItem, ChallengeListSkeleton } from '../components/ChallengeListItem';

// Loading skeleton for entire page
function HomePageSkeleton(): React.ReactElement {
  return (
    <div className="p-4 space-y-4">
      {/* Draw Hero Card Skeleton */}
      <Skeleton className="h-36 w-full rounded-2xl" />

      {/* Jackpot Card Skeleton */}
      <Skeleton className="h-44 w-full rounded-2xl" />

      {/* Weekly Spark Skeleton */}
      <Skeleton className="h-28 w-full rounded-2xl" />

      {/* Challenges Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
        <ChallengeListSkeleton />
      </div>

      {/* Referral Teaser Skeleton */}
      <Skeleton className="h-20 w-full rounded-2xl" />

      {/* Balance Card Skeleton */}
      <Skeleton className="h-16 w-full rounded-2xl" />
    </div>
  );
}

// DEV ONLY: Live draw banner that appears when countdown hits 10s
// This is the orange banner that shows when the draw goes live
function LiveDrawBannerNew({
  onClick,
}: {
  onClick: () => void;
}): React.ReactElement {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className="w-full bg-orange-500 text-white px-4 py-3 cursor-pointer hover:bg-orange-600 transition-colors"
    >
      <div className="flex items-center justify-center gap-2">
        {/* Pulsing red dot only */}
        <span className="relative flex h-3 w-3">
          <span className="animate-ping inline-flex h-full w-full rounded-full bg-red-500" />
        </span>
        <span className="text-sm font-semibold">
          {t('home.liveDrawBannerWatch')}
        </span>
      </div>
    </button>
  );
}

// Legacy: Live draw redirect banner component (auto-redirect)
function LiveDrawBanner({
  onCancel,
}: {
  onCancel: () => void;
}): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className="bg-red-600 text-white px-4 py-3 animate-pulse">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          {t('home.liveDrawBanner')}
        </span>
        <button
          onClick={onCancel}
          className="text-sm text-white underline hover:no-underline"
        >
          {t('home.notNow')}
        </button>
      </div>
    </div>
  );
}

export default function HomePage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('home.title'));

  const { data, isLoading, isError, refetch } = useHomePageData();

  // State for cancelled redirect
  const [cancelledRedirect, setCancelledRedirect] = useState(false);

  // DEV ONLY: State for live draw banner (countdown starts at 12s, shows at 10s)
  const [isLiveBannerVisible, setIsLiveBannerVisible] = useState(false);

  // DEV ONLY: Timer to show live draw banner (countdown starts at 12s, banner appears at 10s)
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLiveBannerVisible(true);
    }, 2000); // DEV ONLY: countdown starts at 12s, shows banner when it hits 10s (2 second delay)
    return () => clearTimeout(timeout);
  }, []);

  // Legacy: Live draw auto-redirect effect
  useEffect(() => {
    if (data?.stats.drawStatus === 'live' && !cancelledRedirect) {
      const timer = setTimeout(() => {
        navigate('/draws/live');
      }, 3000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [data?.stats.drawStatus, cancelledRedirect, navigate]);

  // Handle navigation
  const handleTicketsClick = () => navigate('/entries');
  const handleDrawClick = () => {
    // DEV ONLY: Always navigate to past draws list
    navigate('/draws');
  };
  const handleJackpotClick = () => navigate('/draws');
  const handleChallengeClick = (challengeId: string) => navigate(`/challenges/${challengeId}`);
  const handleViewAllChallenges = () => navigate('/challenges');
  const handleCancelRedirect = () => setCancelledRedirect(true);
  // DEV ONLY: Handler for live draw banner click
  const handleLiveBannerClick = () => navigate('/draws/live');

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface-primary">
        <HomePageSkeleton />
      </div>
    );
  }

  // Error state (only show if online - offline has different handling)
  if (isError && isOnline) {
    return (
      <div className="min-h-screen bg-surface-primary p-4">
        <ErrorState
          message={t('errors.loadFailed')}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  // Data state (normal rendering)
  const stats = data?.stats;
  const challenges = data?.challenges ?? [];
  const isLive = stats?.drawStatus === 'live';
  const showLiveBanner = isLive && !cancelledRedirect;

  return (
    <div className="min-h-screen bg-surface-primary">
      {/* Live Draw Redirect Banner - appears at very top */}
      {showLiveBanner && (
        <LiveDrawBanner onCancel={handleCancelRedirect} />
      )}

      {/* Offline Banner */}
      {!isOnline && <OfflineBanner />}

      {/* DEV ONLY: Live Draw Banner - edge-to-edge, appears when countdown hits 10s */}
      {isLiveBannerVisible && (
        <LiveDrawBannerNew onClick={handleLiveBannerClick} />
      )}

      <div className="p-4 space-y-4">
        {/* 1. Draw Hero Card (DOMINANT) */}
        <DrawHeroCard
          activeTickets={stats?.activeTickets ?? 0}
          nextDrawDate={stats?.nextDrawDate ?? null}
          drawType={stats?.nextDrawType ?? 'weekly'}
          drawStatus={stats?.drawStatus ?? 'scheduled'}
          isLoading={!stats}
          onTicketsClick={handleTicketsClick}
          onDrawClick={handleDrawClick}
        />

        {/* 2. Jackpot Card */}
        <JackpotCard
          jackpotAmount={stats?.weeklyJackpot ?? 0}
          entryPoolSize={stats?.totalEntryPool ?? 0}
          lastWinner={stats?.lastJackpotWinner}
          lastWinAmount={stats?.lastJackpotAmount}
          isLoading={!stats}
          onClick={handleJackpotClick}
        />

        {/* 3. Weekly Spark Section */}
        <WeeklySparkCard
          weeklyUniqueDays={stats?.weeklyUniqueDays ?? 0}
          isLoading={!stats}
        />

        {/* 4. Active Challenges Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-brand-primary" />
              <h2 className="font-semibold text-text-primary">
                {t('home.activeChallenges')}
              </h2>
            </div>
            {challenges.length > 0 && (
              <button
                onClick={handleViewAllChallenges}
                className="flex items-center gap-1 text-sm text-brand-primary hover:text-brand-primary-dark transition-colors"
              >
                <span>{t('common.viewAll')}</span>
                <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
              </button>
            )}
          </div>

          {/* Challenge List or Empty State */}
          {challenges.length > 0 ? (
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <ChallengeListItem
                  key={challenge.challengeId}
                  challenge={challenge}
                  onClick={() => handleChallengeClick(challenge.challengeId)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface-secondary rounded-xl p-6 text-center">
              <Trophy className="h-10 w-10 text-text-muted mx-auto mb-2" />
              <p className="text-text-secondary">
                {t('home.noChallengesAvailable')}
              </p>
              <button
                onClick={handleViewAllChallenges}
                className="mt-3 text-sm text-brand-primary font-medium"
              >
                {t('home.exploreChallenges')}
              </button>
            </div>
          )}
        </div>

        {/* 5. Referral Teaser Card */}
        <ReferralTeaserCard
          referralCountMonth={stats?.referralCountMonth ?? 0}
          isLoading={!stats}
        />

        {/* 6. Compact Balance Card (DEMOTED - at bottom) */}
        <CompactBalanceCard
          balance={stats?.userBalance ?? 0}
          monthlySpend={stats?.monthlySpend ?? 0}
          isLoading={!stats}
        />
      </div>
    </div>
  );
}
