/**
 * Test Fixtures
 * Typed mock data for all entities
 */

import type { User, AuthTokens } from '@/core/types/api.types';
import type {
  Draw,
  DrawWinner,
  DrawListResponse,
  DrawWinnerListResponse,
} from '@/features/draw/types/draw.types';
import type {
  FawzEntry,
  FawzEntryListResponse,
  EntrySummary,
} from '@/features/entries/types/entries.types';
import type {
  Notification,
  NotificationListResponse,
  NotificationPreference,
  NotificationPreferencesListResponse,
} from '@/features/notifications/types/notifications.types';
import type {
  Challenge,
  ChallengeListResponse,
  UserChallengeProgress,
  UserChallengeProgressListResponse,
  Badge,
  BadgeListResponse,
} from '@/features/challenges/types/challenges.types';
import type {
  Referral,
  ReferralListResponse,
  ReferralLink,
  ReferralStats,
} from '@/features/referrals/types/referrals.types';
import type { Dispute, DisputeListResponse } from '@/features/disputes/types/disputes.types';
import type {
  PrizePayout,
  PrizePayoutListResponse,
  PrizeSummary,
} from '@/features/prizes/types/prizes.types';

// ===========================================
// User Fixtures
// ===========================================

export const mockUser: User = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  phone: '07801234567',
  name: 'أحمد محمد',
  email: 'ahmed@example.com',
  avatar_url: undefined,
  is_verified: true,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-03-20T14:45:00Z',
};

export const mockAuthTokens: AuthTokens = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token',
  refresh_token: 'refresh-token-mock-123',
  token_type: 'Bearer',
  expires_in: 3600,
};

// ===========================================
// Draw Fixtures
// ===========================================

export const mockDraw: Draw = {
  draw_id: '660e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_date: '2024-03-21',
  draw_time: '20:00:00',
  draw_type: 'weekly',
  draw_number: 42,
  status: 'finalized',
  entry_cutoff_at: '2024-03-21T19:00:00Z',
  scheduled_broadcast_at: '2024-03-21T20:00:00Z',
  entry_pool_size: 125000,
  entry_pool_snapshot_at: '2024-03-21T19:00:00Z',
  broadcast_started_at: '2024-03-21T20:00:00Z',
  finalized_at: '2024-03-21T20:30:00Z',
  winning_numbers: '1234567890',
  winning_number_1: 1234567890,
  winning_number_2: 2345678901,
  winning_number_3: 3456789012,
  prize_tier_last_3_iqd: 25000,
  prize_tier_last_5_iqd: 250000,
  prize_tier_last_7_iqd: 2500000,
  prize_tier_last_10_iqd: 25000000,
  jackpot_amount_iqd: 100000000,
  jackpot_rollover_iqd: 0,
  jackpot_claimed: false,
  jackpot_winners_count: 0,
  total_winners: 156,
  total_payout_iqd: 15600000,
  consumer_winners: 140,
  consumer_payout_iqd: 14000000,
  merchant_winners: 16,
  merchant_payout_iqd: 1600000,
  physical_draw_mismatch: false,
  created_at: '2024-03-14T10:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

export const mockDrawList: DrawListResponse = {
  draws_list: [
    mockDraw,
    {
      ...mockDraw,
      draw_id: '660e8400-e29b-41d4-a716-446655440002',
      draw_number: 41,
      draw_date: '2024-03-14',
      status: 'finalized',
    },
    {
      ...mockDraw,
      draw_id: '660e8400-e29b-41d4-a716-446655440003',
      draw_number: 43,
      draw_date: '2024-03-28',
      status: 'scheduled',
      finalized_at: undefined,
    },
  ],
  total_draws: 3,
  page: 1,
  page_size: 20,
};

export const mockDrawWinner: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: mockUser.id,
  entry_number: '1234567890',
  digits_matched: 5,
  prize_tier: 'last_5',
  prize_iqd: 250000,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T10:00:00Z',
  requires_compliance_review: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T10:00:00Z',
};

export const mockDrawWinners: DrawWinnerListResponse = {
  draw_winners_list: [mockDrawWinner],
  total_draw_winners: 1,
  page: 1,
  page_size: 20,
};

// ===========================================
// Entry Fixtures
// ===========================================

export const mockEntry: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: mockUser.id,
  entry_number: '1234567890',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 90,
  trailing_3: 890,
  trailing_4: 7890,
  trailing_5: 67890,
  trailing_6: 567890,
  trailing_7: 4567890,
  trailing_8: 34567890,
  trailing_9: 234567890,
  trailing_10: 1234567890,
  transaction_amount_iqd: 50000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 5,
  prize_iqd: 250000,
  created_at: '2024-03-20T14:30:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

export const mockEntryList: FawzEntryListResponse = {
  fawz_entries_list: [
    mockEntry,
    {
      ...mockEntry,
      fawz_entry_id: '990e8400-e29b-41d4-a716-446655440002',
      entry_number: '9876543210',
      source: 'challenge',
      outcome: 'lost',
      digits_matched: undefined,
      prize_iqd: undefined,
    },
    {
      ...mockEntry,
      fawz_entry_id: '990e8400-e29b-41d4-a716-446655440003',
      entry_number: '5555555555',
      source: 'referral',
      outcome: 'active',
      draw_id: undefined,
      digits_matched: undefined,
      prize_iqd: undefined,
    },
  ],
  total_fawz_entries: 3,
  page: 1,
  page_size: 20,
};

export const mockEntrySummary: EntrySummary = {
  total_entries: 45,
  entries_this_week: 8,
  entries_this_month: 25,
  entries_by_source: {
    transaction: 30,
    challenge: 8,
    referral: 5,
    retroactive: 2,
    bonus: 0,
    onboarding: 0,
  },
  active_entries: 12,
  won_entries: 3,
  total_prizes_iqd: 750000,
  current_draw_count: 5,
  lifetime_count: 45,
  weekly_unique_days: 4,
};

// ===========================================
// Notification Fixtures
// ===========================================

export const mockNotification: Notification = {
  notification_id: 'aa0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  title: 'draw_result_winner',
  title_ar: 'مبروك! لقد فزت!',
  title_en: 'Congratulations! You won!',
  body_ar: 'لقد فزت بجائزة 250,000 دينار عراقي في سحب هذا الأسبوع',
  body_en: 'You won a prize of 250,000 IQD in this week\'s draw',
  notification_type: 'draw_result_winner',
  priority: 'high',
  status: 'delivered',
  recipient_type: 'consumer',
  is_read: false,
  is_pushed: true,
  is_system_critical: false,
  deep_link: '/draws/660e8400-e29b-41d4-a716-446655440001',
  related_draw_id: mockDraw.draw_id,
  created_at: '2024-03-21T20:35:00Z',
};

export const mockNotificationList: NotificationListResponse = {
  notifications_list: [
    mockNotification,
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440002',
      title: 'entry_earned',
      title_ar: 'حصلت على رقم جديد',
      notification_type: 'entry_earned',
      is_read: true,
      read_at: '2024-03-20T16:00:00Z',
      priority: 'normal',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440003',
      title: 'challenge_completed',
      title_ar: 'أكملت التحدي',
      notification_type: 'challenge_completed',
      is_read: false,
      priority: 'normal',
    },
  ],
  total_notifications: 3,
  page: 1,
  page_size: 20,
};

export const mockUnreadCount = { count: 2 };

export const mockNotificationPreference: NotificationPreference = {
  notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  category: 'draw_results',
  is_enabled: true,
  push_enabled: true,
  in_app_enabled: true,
  created_at: '2024-01-15T10:30:00Z',
};

export const mockNotificationPreferences: NotificationPreferencesListResponse = {
  notification_preferences_list: [
    mockNotificationPreference,
    { ...mockNotificationPreference, notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440002', category: 'draw_reminders' },
    { ...mockNotificationPreference, notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440003', category: 'entry_earned' },
    { ...mockNotificationPreference, notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440004', category: 'challenge_updates' },
    { ...mockNotificationPreference, notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440005', category: 'referral_rewards' },
    { ...mockNotificationPreference, notification_preference_id: 'bb0e8400-e29b-41d4-a716-446655440006', category: 'system_critical', is_enabled: true },
  ],
  total_notification_preferences: 6,
  page: 1,
  page_size: 20,
};

// ===========================================
// Challenge Fixtures
// ===========================================

export const mockChallenge: Challenge = {
  challenge_id: 'cc0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  challenge_type: 'weekly_spark',
  name_ar: 'تحدي المشتريات الأسبوعي',
  name_en: 'Weekly Shopping Challenge',
  description_ar: 'قم بـ 5 عمليات شراء هذا الأسبوع للحصول على 3 أرقام إضافية',
  description_en: 'Make 5 purchases this week to earn 3 extra entries',
  start_date: '2024-03-18',
  end_date: '2024-03-24',
  target_type: 'transaction_count',
  target_value: 5,
  reward_entries: 3,
  reward_cash_iqd: 0,
  status: 'active',
  display_order: 1,
  is_featured: true,
  checkpoints: [
    { checkpoint_index: 0, target_value: 2, reward_entries: 1, reward_cash_iqd: 0 },
    { checkpoint_index: 1, target_value: 4, reward_entries: 1, reward_cash_iqd: 0 },
    { checkpoint_index: 2, target_value: 5, reward_entries: 1, reward_cash_iqd: 0 },
  ],
  created_at: '2024-03-15T10:00:00Z',
  updated_at: '2024-03-18T00:00:00Z',
};

export const mockChallengeList: ChallengeListResponse = {
  challenges_list: [
    mockChallenge,
    {
      ...mockChallenge,
      challenge_id: 'cc0e8400-e29b-41d4-a716-446655440002',
      challenge_type: 'onboarding',
      name_ar: 'أكمل ملفك الشخصي',
      name_en: 'Complete Your Profile',
      target_type: 'profile_completion',
      target_value: 1,
      reward_entries: 2,
      status: 'active',
      is_featured: false,
    },
  ],
  total_challenges: 2,
  page: 1,
  page_size: 20,
};

export const mockUserProgress: UserChallengeProgress = {
  user_challenge_progress_id: 'dd0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: mockUser.id,
  challenge_id: mockChallenge.challenge_id,
  current_value: 3,
  target_value: 5,
  progress_percent: 60,
  status: 'in_progress',
  started_at: '2024-03-18T10:00:00Z',
  last_updated_at: '2024-03-20T14:30:00Z',
  checkpoints_claimed: [0],
  total_entries_earned: 1,
  total_cash_earned_iqd: 0,
  created_at: '2024-03-18T10:00:00Z',
  updated_at: '2024-03-20T14:30:00Z',
};

export const mockUserProgressList: UserChallengeProgressListResponse = {
  user_challenge_progresses_list: [mockUserProgress],
  total_user_challenge_progresses: 1,
  page: 1,
  page_size: 20,
};

export const mockBadge: Badge = {
  badge_id: 'ee0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  badge_code: 'first_win',
  badge_type: 'milestone',
  name_ar: 'الفوز الأول',
  name_en: 'First Win',
  description_ar: 'احصل على هذه الشارة عند فوزك الأول',
  description_en: 'Earn this badge on your first win',
  display_order: 1,
  is_active: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

export const mockBadgeList: BadgeListResponse = {
  badges_list: [mockBadge],
  total_badges: 1,
  page: 1,
  page_size: 20,
};

// ===========================================
// Referral Fixtures
// ===========================================

export const mockReferralLink: ReferralLink = {
  referral_link_id: 'ff0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  referrer_id: mockUser.id,
  referral_code: 'AHMED2024',
  short_url: 'https://fawz.iq/r/AHMED2024',
  full_url: 'https://fawz.iq/invite?code=AHMED2024',
  qr_code_url: 'https://api.fawz.iq/qr/AHMED2024.png',
  expires_at: '2024-12-31T23:59:59Z',
  is_active: true,
  click_count: 15,
  conversion_count: 5,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-03-20T14:30:00Z',
};

export const mockReferral: Referral = {
  referral_id: 'gg0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  referrer_id: mockUser.id,
  referred_id: 'hh0e8400-e29b-41d4-a716-446655440001',
  referral_link_id: mockReferralLink.referral_link_id,
  referral_code: 'AHMED2024',
  referral_type: 'consumer_to_consumer',
  status: 'rewarded',
  clicked_at: '2024-03-15T10:00:00Z',
  registered_at: '2024-03-15T10:30:00Z',
  qualified_at: '2024-03-16T14:00:00Z',
  fraud_check_different_device: true,
  fraud_check_different_qi_card: true,
  fraud_check_no_prior_activity: true,
  fraud_check_qualifying_tx_type: true,
  fraud_validation_passed: true,
  referrer_reward_entries: 3,
  referrer_reward_cash_iqd: 5000,
  referrer_rewarded_at: '2024-03-16T14:30:00Z',
  referred_reward_entries: 2,
  referred_rewarded_at: '2024-03-16T14:30:00Z',
  link_expires_at: '2024-12-31T23:59:59Z',
  created_at: '2024-03-15T10:00:00Z',
  updated_at: '2024-03-16T14:30:00Z',
};

export const mockReferralList: ReferralListResponse = {
  referrals_list: [
    mockReferral,
    {
      ...mockReferral,
      referral_id: 'gg0e8400-e29b-41d4-a716-446655440002',
      status: 'pending',
      qualified_at: undefined,
      referrer_rewarded_at: undefined,
      referred_rewarded_at: undefined,
    },
  ],
  total_referrals: 2,
  page: 1,
  page_size: 20,
};

export const mockReferralStats: ReferralStats = {
  referral_count_month: 3,
  referral_count_total: 15,
  entries_earned: 45,
  cash_earned_iqd: 75000,
  pending_referrals: 2,
  successful_referrals: 13,
};

// ===========================================
// Dispute Fixtures
// ===========================================

export const mockDispute: Dispute = {
  dispute_id: 'ii0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  dispute_number: 'DSP-2024-001',
  dispute_type: 'missing_prize',
  status: 'under_review',
  description: 'لم أستلم جائزتي من سحب الأسبوع الماضي',
  claimed_fawz_number: '1234567890',
  claimed_amount_iqd: 250000,
  submitter_type: 'consumer',
  submitted_at: '2024-03-22T09:00:00Z',
  sla_deadline_at: '2024-03-25T09:00:00Z',
  related_draw_id: mockDraw.draw_id,
  created_at: '2024-03-22T09:00:00Z',
  updated_at: '2024-03-22T10:00:00Z',
};

export const mockDisputeList: DisputeListResponse = {
  disputes_list: [mockDispute],
  total_disputes: 1,
  page: 1,
  page_size: 20,
};

// ===========================================
// Prize Payout Fixtures
// ===========================================

export const mockPrizePayout: PrizePayout = {
  prize_payout_id: 'jj0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_winner_id: mockDrawWinner.draw_winner_id,
  consumer_user_id: mockUser.id,
  prize_amount_iqd: 250000,
  prize_tier: 'last_5',
  draw_id: mockDraw.draw_id,
  draw_date: mockDraw.draw_date,
  payout_status: 'completed',
  payout_completed_at: '2024-03-22T10:00:00Z',
  retry_count: 0,
  max_retries: 3,
  requires_compliance_review: false,
  is_on_hold: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T10:00:00Z',
};

export const mockPrizePayoutList: PrizePayoutListResponse = {
  prize_payouts_list: [
    mockPrizePayout,
    {
      ...mockPrizePayout,
      prize_payout_id: 'jj0e8400-e29b-41d4-a716-446655440002',
      prize_amount_iqd: 25000,
      prize_tier: 'last_3',
      payout_status: 'pending',
      payout_completed_at: undefined,
    },
  ],
  total_prize_payouts: 2,
  page: 1,
  page_size: 20,
};

export const mockPrizeSummary: PrizeSummary = {
  lifetime_total_iqd: 750000,
  total_wins: 5,
  wins_by_tier: {
    last_3: 3,
    last_5: 2,
    last_7: 0,
    last_10: 0,
    jackpot: 0,
  },
  pending_payouts_iqd: 25000,
  completed_payouts_iqd: 725000,
};

// ===========================================
// Consent Fixtures
// ===========================================

export interface Consent {
  consent_id: string;
  tenant_id: string;
  consumer_user_id: string;
  consent_type: 'sharia_disclosure' | 'media_consent' | 'terms_of_service' | 'privacy_policy';
  is_accepted: boolean;
  accepted_at?: string;
  withdrawn_at?: string;
  version: string;
  created_at: string;
  updated_at?: string;
}

export const mockConsent: Consent = {
  consent_id: 'kk0e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: mockUser.id,
  consent_type: 'sharia_disclosure',
  is_accepted: true,
  accepted_at: '2024-01-15T10:35:00Z',
  version: '1.0',
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-01-15T10:35:00Z',
};

export const mockConsentList = {
  user_consents_list: [
    {
      user_consent_id: 'kk0e8400-e29b-41d4-a716-446655440001',
      consumer_user_id: mockUser.id,
      consent_type: 'sharia_disclosure',
      consent_version: '1.0',
      consented: true,
      consented_at: '2024-01-15T10:35:00Z',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:35:00Z',
    },
    {
      user_consent_id: 'kk0e8400-e29b-41d4-a716-446655440002',
      consumer_user_id: mockUser.id,
      consent_type: 'media_participation',
      consent_version: '1.0',
      consented: false,
      consented_at: undefined,
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-15T10:30:00Z',
    },
  ],
  total_user_consents: 2,
  page: 1,
  page_size: 20,
};

// ===========================================
// Consumer User Fixtures (Profile)
// ===========================================

export const mockConsumerUser = {
  consumer_user_id: mockUser.id,
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  user_id: mockUser.id,
  display_name: 'أحمد محمد',
  phone: mockUser.phone,
  email: mockUser.email,
  city: 'بغداد',
  governorate: 'بغداد',
  is_ambassador: false,
  is_new: false,
  total_entries_earned: 45,
  total_prizes_won_iqd: 750000,
  referral_count_month: 3,
  sharia_consent_accepted: true,
  sharia_consent_accepted_at: '2024-01-15T10:35:00Z',
  media_consent_decision: null,
  created_at: '2024-01-15T10:30:00Z',
  updated_at: '2024-03-20T14:45:00Z',
};

export const mockConsumerUserList = {
  consumer_users_list: [mockConsumerUser],
  total_consumer_users: 1,
  page: 1,
  page_size: 20,
};
