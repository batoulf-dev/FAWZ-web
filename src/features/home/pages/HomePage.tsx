/**
 * SCR-001: Home Page (Fawz Tab)
 * Main dashboard showing draw hero, jackpot, weekly spark, challenges, referral teaser, and balance
 */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Trophy, ChevronLeft, Sparkles } from 'lucide-react';
import { Skeleton } from '@/shared/components/Skeleton';
import { ErrorState } from '@/shared/components/ErrorState';
import { OfflineBanner } from '@/shared/components/OfflineBanner';
import { usePageTitle } from '@/shared/hooks/usePageTitle';
import { useNetworkStatus } from '@/shared/hooks/useNetworkStatus';
import { useAuthStore } from '@/stores/auth.store';
import { useHomePageData } from '../services/home.service';
import { DrawHeroCard } from '../components/DrawHeroCard';
import { JackpotCard } from '../components/JackpotCard';
import { WeeklySparkCard } from '../components/WeeklySparkCard';
import { ReferralTeaserCard } from '../components/ReferralTeaserCard';
import { CompactBalanceCard } from '../components/CompactBalanceCard';
import { ChallengeListItem, ChallengeListSkeleton } from '../components/ChallengeListItem';

// Desktop-only welcome section with personalized greeting
function DesktopWelcomeSection(): React.ReactElement | null {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const isArabic = i18n.language === 'ar';

  // Get time-based greeting
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return isArabic ? 'صباح الخير' : 'Good morning';
    if (hour < 17) return isArabic ? 'مساء الخير' : 'Good afternoon';
    return isArabic ? 'مساء الخير' : 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <div className="hidden lg:block mb-2">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-text-secondary mt-1">
            {isArabic
              ? 'إليك نظرة عامة على حسابك اليوم'
              : "Here's your account overview for today"}
          </p>
        </div>
        <div className="flex items-center gap-2 text-brand-gold">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium">
            {t('home.goodLuck')}
          </span>
        </div>
      </div>
    </div>
  );
}

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

// Live draw banner/button that appears when countdown hits 10s
// Mobile: Full-width orange banner below hero card
// Desktop: Compact button
function LiveDrawBanner({
  onClick,
}: {
  onClick: () => void;
}): React.ReactElement {
  const { t } = useTranslation();

  return (
    <>
      {/* Mobile: Full-width banner */}
      <button
        onClick={onClick}
        className="lg:hidden w-full bg-orange-500 text-white py-3 cursor-pointer hover:bg-orange-600 transition-colors"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="h-3.5 w-3.5 rounded-full bg-red-600 animate-[pulse_0.75s_ease-in-out_infinite]" />
          <span className="text-sm font-semibold">
            {t('home.liveDrawBannerWatch')}
          </span>
        </div>
      </button>

      {/* Desktop: Large centered button */}
      <button
        onClick={onClick}
        className="hidden lg:inline-flex items-center gap-3 bg-orange-500 text-white px-8 py-4 rounded-full cursor-pointer hover:bg-orange-600 transition-colors shadow-lg"
      >
        <span className="h-4 w-4 rounded-full bg-red-600 animate-[pulse_0.75s_ease-in-out_infinite]" />
        <span className="text-lg font-semibold">
          {t('home.liveDrawBannerWatch')}
        </span>
      </button>
    </>
  );
}


export default function HomePage(): React.ReactElement {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isOnline = useNetworkStatus();

  usePageTitle(t('home.title'));

  const { data, isLoading, isError, refetch } = useHomePageData();

  // State for countdown - track seconds remaining to show banner at 10s
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(null);

  // Calculate initial seconds remaining
  const nextDrawDate = data?.stats?.nextDrawDate;

  // Update countdown every second (continues past 0 to track negative values)
  useEffect(() => {
    if (!nextDrawDate) return;

    // Calculate seconds (can be negative after draw time)
    const calcSeconds = (): number => {
      const target = new Date(nextDrawDate).getTime();
      return Math.floor((target - Date.now()) / 1000);
    };

    // Initial calculation
    setSecondsRemaining(calcSeconds());

    const interval = setInterval(() => {
      const remaining = calcSeconds();
      setSecondsRemaining(remaining);

      // Stop interval 10 seconds after draw starts (when banner should hide)
      if (remaining <= -10) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextDrawDate]);

  // Live banner is visible when:
  // - Draw status is 'live' (not finalized/completed)
  // - OR countdown is between -5 to 10 seconds (stay visible 5s after draw starts)
  const drawStatus = data?.stats?.drawStatus;
  const isDrawFinalized = drawStatus === 'finalized' || drawStatus === 'completed';
  const isLiveBannerVisible =
    !isDrawFinalized &&
    (drawStatus === 'live' ||
      (secondsRemaining !== null && secondsRemaining <= 10 && secondsRemaining >= -5));

  // Handle navigation
  const handleTicketsClick = () => navigate('/entries');
  const handleDrawClick = () => {
    // Navigate to simulation page which replays the last draw
    navigate('/draws/simulation');
  };
  const handleJackpotClick = () => navigate('/draws');
  const handleViewAllChallenges = () => navigate('/challenges');
  // Handler for live draw banner click
  const handleLiveBannerClick = () => navigate('/draws/live');

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-surface-primary">
        <HomePageSkeleton />
      </div>
    );
  }

  // Error state (only show if online - offline has different handling)
  if (isError && isOnline) {
    return (
      <div className="bg-surface-primary p-4">
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

  return (
    <div className="bg-surface-primary">
      
      {/* Offline Banner */}
      {!isOnline && <OfflineBanner />}

      <div className="py-4 space-y-4">
        {/* Desktop Welcome Section */}
        <DesktopWelcomeSection />

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

        {/* Live Draw Banner/Button - appears when countdown <= 10s */}
        {/* Mobile: edge-to-edge banner / Desktop: large centered button */}
        {isLiveBannerVisible && (
          <div className="-mx-8 md:-mx-10 lg:mx-0 lg:flex lg:justify-center">
            <LiveDrawBanner onClick={handleLiveBannerClick} />
          </div>
        )}

        {/* 2. Jackpot + Weekly Spark - Two column grid on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <JackpotCard
            jackpotAmount={stats?.weeklyJackpot ?? 0}
            entryPoolSize={stats?.totalEntryPool ?? 0}
            lastWinner={stats?.lastJackpotWinner}
            lastWinAmount={stats?.lastJackpotAmount}
            isLoading={!stats}
            onClick={handleJackpotClick}
          />

          <WeeklySparkCard
            weeklyUniqueDays={stats?.weeklyUniqueDays ?? 0}
            isLoading={!stats}
          />
        </div>

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
                <ChevronLeft className="h-4 w-4 ltr:rotate-180" />
              </button>
            )}
          </div>

          {/* Challenge List or Empty State */}
          {challenges.length > 0 ? (
            <div className="grid grid-cols-1 min-[1000px]:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
              {challenges.map((challenge) => (
                <ChallengeListItem
                  key={challenge.challengeId}
                  challenge={challenge}
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
