/**
 * Home Feature Types
 * Types for homepage data and components
 */

export interface HomeStats {
  // User balance and spending
  userBalance: number;
  monthlySpend: number;
  ticketsEarned: number;

  // Active tickets for current draw
  activeTickets: number;

  // Jackpot info
  weeklyJackpot: number;
  totalEntryPool: number;
  lastJackpotWinner: string | null;
  lastJackpotAmount: number | null;

  // Next draw info
  nextDrawId: string | null;
  nextDrawDate: string | null;
  nextDrawType: 'weekly' | 'monthly';
  drawStatus: 'scheduled' | 'live' | 'completed';

  // Weekly Spark (unique transaction days this week)
  weeklyUniqueDays: number;

  // Referral stats
  referralCountMonth: number;
}

export interface HomeChallengeItem {
  challengeId: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  progress: number;
  target: number;
  rewardEntries: number;
  rewardCashIqd: number;
  daysRemaining: number;
  isCompleted: boolean;
}

export interface HomePageData {
  stats: HomeStats;
  challenges: HomeChallengeItem[];
}
