/**
 * Profile Types
 * Types and Zod schemas for user profile feature
 */

import { z } from 'zod';

// Account status enum
export const AccountStatusEnum = z.enum([
  'active',
  'archived',
  'created',
  'onboarding',
  'standard',
  'suspended',
]);

export type AccountStatus = z.infer<typeof AccountStatusEnum>;

// Consumer user schema (Fawz profile extension)
export const ConsumerUserSchema = z.object({
  consumer_user_id: z.string().uuid(),
  tenant_id: z.string().uuid().optional(),
  superqi_user_id: z.string().uuid().optional(),
  display_name: z.string().optional().nullable(),
  phone_hash: z.string(),
  qi_card_number_hash: z.string(),
  account_status: AccountStatusEnum,
  is_new: z.boolean().default(true),
  is_ambassador: z.boolean().default(false),
  ambassador_since: z.string().date().optional().nullable(),
  city: z.string().optional().nullable(),
  governorate: z.string().optional().nullable(),
  referral_code: z.string().optional().nullable(),
  referral_code_expires_at: z.string().datetime().optional().nullable(),
  referral_count_month: z.number().int().default(0),
  referral_count_month_year_month: z.string().optional().nullable(),
  referred_by_user_id: z.string().uuid().optional().nullable(),
  total_entries_earned: z.number().int().default(0),
  total_prizes_won_iqd: z.number().int().default(0),
  lifetime_tx_count: z.number().int().default(0),
  weekly_unique_days: z.number().int().default(0),
  monthly_unique_days: z.number().int().default(0),
  weekly_spark_earned_month: z.number().int().optional().nullable(),
  weekly_spark_earned_year: z.number().int().optional().nullable(),
  last_active_at: z.string().datetime().optional().nullable(),
  last_transaction_date: z.string().date().optional().nullable(),
  device_fingerprint_hash: z.string().optional().nullable(),
  suspended_at: z.string().datetime().optional().nullable(),
  suspension_reason: z.string().optional().nullable(),
  deleted_at: z.string().datetime().optional().nullable(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime().optional(),
  created_by: z.string().optional().nullable(),
  updated_by: z.string().optional().nullable(),
});

export type ConsumerUser = z.infer<typeof ConsumerUserSchema>;

// Profile summary for display
export interface ProfileSummary {
  displayName: string;
  memberSince: string;
  accountTier: 'new' | 'established' | 'ambassador';
  totalEntriesEarned: number;
  totalPrizesWon: number;
  totalPrizesWonIqd: number;
  referralCount: number;
  badges: Badge[];
  isAmbassador: boolean;
  city?: string;
  governorate?: string;
}

// Badge structure
export interface Badge {
  id: string;
  name: string;
  name_ar: string;
  icon: string;
  earned_at: string;
}

// Consumer user list response
export const ConsumerUserListResponseSchema = z.object({
  consumer_users_list: z.array(ConsumerUserSchema),
  total_consumer_users: z.number(),
  page: z.number(),
  page_size: z.number(),
});

export type ConsumerUserListResponse = z.infer<typeof ConsumerUserListResponseSchema>;

// Update profile request
export const UpdateConsumerUserRequestSchema = z.object({
  display_name: z.string().optional(),
  city: z.string().optional(),
  governorate: z.string().optional(),
});

export type UpdateConsumerUserRequest = z.infer<typeof UpdateConsumerUserRequestSchema>;

// Winner card data for sharing
export interface WinnerCardData {
  userId: string;
  drawId: string;
  drawName: string;
  drawNameAr: string;
  winnerName: string;
  prizeAmount: number;
  prizeTier: string;
  prizeTierAr: string;
  winningNumber: string;
  drawDate: string;
  shareUrl: string;
}

// Profile stats
export interface ProfileStats {
  totalDrawsEntered: number;
  totalEntriesThisWeek: number;
  lastDrawEntryCount: number;
  winStreak: number;
  challengesCompleted: number;
}
