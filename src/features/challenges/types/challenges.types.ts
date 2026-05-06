/**
 * Challenges Types and Zod Schemas
 * Based on backend-fawz-challenge-system API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const ChallengeTypeEnum = z.enum([
  'onboarding',
  'weekly_spark',
  'monthly',
  'community',
  'special',
]);
export type ChallengeType = z.infer<typeof ChallengeTypeEnum>;

export const ChallengeStatusEnum = z.enum([
  'draft',
  'scheduled',
  'active',
  'expired',
  'cancelled',
]);
export type ChallengeStatus = z.infer<typeof ChallengeStatusEnum>;

export const ProgressStatusEnum = z.enum([
  'not_started',
  'in_progress',
  'completed',
  'expired',
]);
export type ProgressStatus = z.infer<typeof ProgressStatusEnum>;

export const BadgeTypeEnum = z.enum([
  'onboarding',
  'challenge',
  'milestone',
  'ambassador',
  'special',
]);
export type BadgeType = z.infer<typeof BadgeTypeEnum>;

// ==========================================
// Entity Types
// ==========================================

// Challenge checkpoint
export interface ChallengeCheckpoint {
  checkpoint_index: number;
  target_value: number;
  reward_entries: number;
  reward_cash_iqd: number;
  is_claimed?: boolean;
  claimed_at?: string;
}

// Challenge entity
export interface Challenge {
  challenge_id: string;
  tenant_id: string;
  challenge_type: ChallengeType;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon_url?: string;
  // Dates
  start_date: string;
  end_date: string;
  // Target
  target_type: string;
  target_value: number;
  target_category_filter?: string;
  // Rewards
  reward_entries: number;
  reward_cash_iqd: number;
  reward_badge_id?: string;
  // Checkpoints
  checkpoints?: ChallengeCheckpoint[];
  // Status
  status: ChallengeStatus;
  display_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// User challenge progress
export interface UserChallengeProgress {
  user_challenge_progress_id: string;
  tenant_id: string;
  consumer_user_id: string;
  challenge_id: string;
  current_value: number;
  target_value: number;
  progress_percent: number;
  status: ProgressStatus;
  started_at: string;
  completed_at?: string;
  last_updated_at: string;
  // Checkpoint tracking
  checkpoints_claimed: number[];
  // Rewards
  total_entries_earned: number;
  total_cash_earned_iqd: number;
  created_at: string;
  updated_at: string;
}

// Badge entity
export interface Badge {
  badge_id: string;
  tenant_id: string;
  badge_code: string;
  badge_type: BadgeType;
  name_ar: string;
  name_en: string;
  description_ar?: string;
  description_en?: string;
  icon_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// User badge
export interface UserBadge {
  user_badge_id: string;
  tenant_id: string;
  consumer_user_id: string;
  badge_id: string;
  earned_at: string;
  badge?: Badge;
  created_at: string;
}

// Community challenge score
export interface CommunityChallengeScore {
  community_challenge_score_id: string;
  tenant_id: string;
  challenge_id: string;
  current_community_value: number;
  target_value: number;
  participant_count: number;
  milestone_reached: number;
  last_updated_at: string;
}

// ==========================================
// API Response Types
// ==========================================

// List challenges response
export interface ChallengeListResponse {
  challenges_list: Challenge[];
  total_challenges: number;
  page: number;
  page_size: number;
}

// List user challenge progress response
export interface UserChallengeProgressListResponse {
  user_challenge_progresses_list: UserChallengeProgress[];
  total_user_challenge_progresses: number;
  page: number;
  page_size: number;
}

// List badges response
export interface BadgeListResponse {
  badges_list: Badge[];
  total_badges: number;
  page: number;
  page_size: number;
}

// List user badges response
export interface UserBadgeListResponse {
  user_badges_list: UserBadge[];
  total_user_badges: number;
  page: number;
  page_size: number;
}

// ==========================================
// Query Params
// ==========================================

export interface ChallengeListParams {
  page?: number;
  page_size?: number;
  challenge_type?: ChallengeType;
  status?: ChallengeStatus;
  is_featured?: boolean;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface UserProgressListParams {
  page?: number;
  page_size?: number;
  status?: ProgressStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==========================================
// UI Display Types
// ==========================================

// Challenge with user progress
export interface ChallengeWithProgress extends Challenge {
  userProgress?: UserChallengeProgress;
  isActive: boolean;
  isCompleted: boolean;
  daysRemaining: number;
}

// Challenge card display data
export interface ChallengeCardData {
  id: string;
  name: string;
  description?: string;
  iconUrl?: string;
  type: ChallengeType;
  progress: number;
  currentValue: number;
  targetValue: number;
  rewardEntries: number;
  rewardCashIqd: number;
  daysRemaining: number;
  isCompleted: boolean;
  checkpoints?: {
    index: number;
    target: number;
    isClaimed: boolean;
    isReached: boolean;
  }[];
}

// Weekly Spark state
export interface WeeklySparkState {
  uniqueDays: number;
  targetDays: number;
  daysCompleted: boolean[];
  currentStreak: number;
  isCompleted: boolean;
}

// Onboarding progress state
export interface OnboardingProgressState {
  challenges: ChallengeWithProgress[];
  completedCount: number;
  totalCount: number;
  isAllCompleted: boolean;
}
