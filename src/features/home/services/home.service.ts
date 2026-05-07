/**
 * Home Service
 * Aggregates data from multiple services for the home page
 */

import { useNextDraw } from '@/features/draw/services/draw.service';
import { useEntrySummary } from '@/features/entries/services/entries.service';
import { useActiveChallenges } from '@/features/challenges/services/challenges.service';
import { useReferralStats } from '@/features/referrals/services/referrals.service';
import { mockWalletBalance, mockMonthlySpend } from '@/test/fixtures';
import type { HomeStats, HomeChallengeItem, HomePageData } from '../types/home.types';

// ==========================================
// Query Keys Factory
// ==========================================

export const homeKeys = {
  all: ['home'] as const,
  stats: () => [...homeKeys.all, 'stats'] as const,
  pageData: () => [...homeKeys.all, 'pageData'] as const,
};

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

/**
 * Hook to get aggregated home page data
 * Combines data from draws, entries, and challenges services
 */
export function useHomePageData() {
  const nextDrawQuery = useNextDraw();
  const entrySummaryQuery = useEntrySummary();
  const challengesQuery = useActiveChallenges();
  const referralStatsQuery = useReferralStats();

  const isLoading =
    nextDrawQuery.isLoading ||
    entrySummaryQuery.isLoading ||
    challengesQuery.isLoading ||
    referralStatsQuery.isLoading;

  const isError =
    nextDrawQuery.isError ||
    entrySummaryQuery.isError ||
    challengesQuery.isError ||
    referralStatsQuery.isError;

  const error = nextDrawQuery.error || entrySummaryQuery.error || challengesQuery.error || referralStatsQuery.error;

  // Aggregate stats from different sources
  const stats: HomeStats | null =
    entrySummaryQuery.data
      ? {
          // User balance and spending (mock values - would come from wallet service)
          userBalance: mockWalletBalance,
          monthlySpend: mockMonthlySpend,
          ticketsEarned: entrySummaryQuery.data.entries_this_month ?? 0,

          // Active tickets for current draw
          activeTickets: entrySummaryQuery.data.active_entries ?? 0,

          // Jackpot info from next draw
          weeklyJackpot: nextDrawQuery.data?.jackpot_amount_iqd ?? 50000000,
          totalEntryPool: nextDrawQuery.data?.entry_pool_size ?? 0,
          lastJackpotWinner: null, // Would come from draw winners
          lastJackpotAmount: null,

          // Next draw info
          nextDrawId: nextDrawQuery.data?.draw_id ?? null,
          nextDrawDate: nextDrawQuery.data?.draw_date ?? null,
          nextDrawType: nextDrawQuery.data?.draw_type ?? 'weekly',
          drawStatus: (nextDrawQuery.data?.status as 'scheduled' | 'live' | 'completed') ?? 'scheduled',

          // Weekly Spark - unique transaction days this week
          weeklyUniqueDays: entrySummaryQuery.data.weekly_unique_days ?? 0,

          // Referral stats - friends referred this month
          referralCountMonth: referralStatsQuery.data?.referral_count_month ?? 0,
        }
      : null;

  // Transform challenges to home format
  const challenges: HomeChallengeItem[] =
    challengesQuery.data?.slice(0, 3).map((c) => ({
      challengeId: c.challenge_id,
      nameAr: c.name_ar,
      nameEn: c.name_en ?? c.name_ar,
      descriptionAr: c.description_ar ?? '',
      descriptionEn: c.description_en ?? c.description_ar ?? '',
      progress: c.userProgress?.current_value ?? 0,
      target: c.target_value,
      rewardEntries: c.reward_entries,
      rewardCashIqd: c.reward_cash_iqd,
      daysRemaining: c.daysRemaining ?? 0,
      isCompleted: c.isCompleted ?? false,
    })) ?? [];

  const data: HomePageData | null =
    stats
      ? {
          stats,
          challenges,
        }
      : null;

  const refetch = () => {
    nextDrawQuery.refetch();
    entrySummaryQuery.refetch();
    challengesQuery.refetch();
    referralStatsQuery.refetch();
  };

  return {
    data,
    isLoading,
    isError,
    error,
    refetch,
  };
}

/**
 * Hook to get home stats only (lighter weight)
 */
export function useHomeStats() {
  const entrySummaryQuery = useEntrySummary();
  const nextDrawQuery = useNextDraw();
  const referralStatsQuery = useReferralStats();

  const isLoading = entrySummaryQuery.isLoading || nextDrawQuery.isLoading || referralStatsQuery.isLoading;
  const isError = entrySummaryQuery.isError || nextDrawQuery.isError || referralStatsQuery.isError;

  const stats: HomeStats | null =
    entrySummaryQuery.data
      ? {
          userBalance: mockWalletBalance,
          monthlySpend: mockMonthlySpend,
          ticketsEarned: entrySummaryQuery.data.entries_this_month ?? 0,
          activeTickets: entrySummaryQuery.data.active_entries ?? 0,
          weeklyJackpot: nextDrawQuery.data?.jackpot_amount_iqd ?? 50000000,
          totalEntryPool: nextDrawQuery.data?.entry_pool_size ?? 0,
          lastJackpotWinner: null,
          lastJackpotAmount: null,
          nextDrawId: nextDrawQuery.data?.draw_id ?? null,
          nextDrawDate: nextDrawQuery.data?.draw_date ?? null,
          nextDrawType: nextDrawQuery.data?.draw_type ?? 'weekly',
          drawStatus: (nextDrawQuery.data?.status as 'scheduled' | 'live' | 'completed') ?? 'scheduled',
          weeklyUniqueDays: entrySummaryQuery.data.weekly_unique_days ?? 0,
          referralCountMonth: referralStatsQuery.data?.referral_count_month ?? 0,
        }
      : null;

  return {
    data: stats,
    isLoading,
    isError,
    refetch: () => {
      entrySummaryQuery.refetch();
      nextDrawQuery.refetch();
      referralStatsQuery.refetch();
    },
  };
}
