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
  // Updated winning numbers for comprehensive testing:
  // winning_number_1: Last-3=890, Last-5=67890, Last-7=4567890, Last-10=1234567890
  // winning_number_2: Last-3=210, Last-5=43210, Last-7=6543210, Last-10=9876543210
  // winning_number_3: Last-3=345, Last-5=12345, Last-7=5512345, Last-10=5555512345
  winning_numbers: '1234567890',
  winning_number_1: 1234567890,
  winning_number_2: 9876543210,
  winning_number_3: 5555512345,
  prize_tier_last_3_iqd: 25000,
  prize_tier_last_5_iqd: 250000,
  prize_tier_last_7_iqd: 2500000,
  prize_tier_last_10_iqd: 25000000,
  jackpot_amount_iqd: 100000000,
  jackpot_rollover_iqd: 0,
  jackpot_claimed: true,
  jackpot_winners_count: 2,
  total_winners: 164,
  total_payout_iqd: 65850000,
  consumer_winners: 148,
  consumer_payout_iqd: 64250000,
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
    {
      ...mockDraw,
      draw_id: '660e8400-e29b-41d4-a716-446655440004',
      draw_number: 5,
      draw_type: 'monthly',
      draw_date: '2024-03-01',
      status: 'finalized',
      prize_tier_last_3_iqd: 50000,
      prize_tier_last_5_iqd: 500000,
      prize_tier_last_7_iqd: 5000000,
    },
    {
      ...mockDraw,
      draw_id: '660e8400-e29b-41d4-a716-446655440005',
      draw_number: 4,
      draw_type: 'monthly',
      draw_date: '2024-02-01',
      status: 'finalized',
      prize_tier_last_3_iqd: 50000,
      prize_tier_last_5_iqd: 500000,
      prize_tier_last_7_iqd: 5000000,
    },
  ],
  total_draws: 5,
  page: 1,
  page_size: 20,
};

// ===========================================
// DrawWinner Fixtures - Comprehensive Coverage
// Entry IDs are inlined to avoid forward reference issues
// ===========================================

// Winner #1: User's own jackpot win (Last-10, winning_number_1)
// This is the authenticated mock user's win for "your win" highlighting
// Weekly cap = 1,000,000 IQD; prize = 50M IQD → held due to cap exceeded
export const mockDrawWinnerUserJackpot: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440001',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440001', // mockEntry
  consumer_user_id: mockUser.id,
  owner_id: mockUser.id,
  owner_type: 'user',
  entry_number: '1234567890',
  digits_matched: 10,
  prize_tier: 'last_10',
  prize_iqd: 50000000, // Split jackpot (100M / 2)
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: true,
  jackpot_split_count: 2,
  original_prize_amount_iqd: 100000000,
  payout_status: 'held_cap_exceeded',
  payout_held_reason: 'Weekly payout cap exceeded (1,000,000 IQD limit)',
  requires_compliance_review: true,
  cap_exceeded: true,
  cap_exceeded_amount_iqd: 49000000, // 50M - 1M cap = 49M excess
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-21T21:00:00Z',
};

// Winner #2: Last-3 match on winning_number_1 (890)
export const mockDrawWinnerLast3Win1: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440010',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440010', // mockEntryLast3Win1
  consumer_user_id: 'user-other-001',
  owner_id: 'user-other-001',
  owner_type: 'user',
  entry_number: '1111111890',
  digits_matched: 3,
  prize_tier: 'last_3',
  prize_iqd: 25000,
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T11:00:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T11:00:00Z',
};

// Winner #3: Last-5 match on winning_number_1 (67890)
export const mockDrawWinnerLast5Win1: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440011',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440011', // mockEntryLast5Win1
  consumer_user_id: 'user-other-002',
  owner_id: 'user-other-002',
  owner_type: 'user',
  entry_number: '2222267890',
  digits_matched: 5,
  prize_tier: 'last_5',
  prize_iqd: 250000,
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T11:30:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T11:30:00Z',
};

// Winner #4: Last-7 match on winning_number_1 (4567890)
// Weekly cap = 1,000,000 IQD; prize = 2.5M IQD → held due to cap exceeded
export const mockDrawWinnerLast7Win1: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440012',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440012', // mockEntryLast7Win1
  consumer_user_id: 'user-other-003',
  owner_id: 'user-other-003',
  owner_type: 'user',
  entry_number: '3334567890',
  digits_matched: 7,
  prize_tier: 'last_7',
  prize_iqd: 2500000,
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: false,
  payout_status: 'held_cap_exceeded',
  payout_held_reason: 'Weekly payout cap exceeded (1,000,000 IQD limit)',
  requires_compliance_review: true,
  cap_exceeded: true,
  cap_exceeded_amount_iqd: 1500000, // 2.5M - 1M cap = 1.5M excess
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-21T21:00:00Z',
};

// Winner #5: Last-3 match on winning_number_2 (210)
export const mockDrawWinnerLast3Win2: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440020',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440020', // mockEntryLast3Win2
  consumer_user_id: 'user-other-004',
  owner_id: 'user-other-004',
  owner_type: 'user',
  entry_number: '4444444210',
  digits_matched: 3,
  prize_tier: 'last_3',
  prize_iqd: 25000,
  winning_number_index: 2,
  winning_number: 9876543210,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T12:30:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T12:30:00Z',
};

// Winner #6: Last-3 match on winning_number_3 (345)
// Prize = 25,000 IQD, well under 1M weekly cap → completed normally
export const mockDrawWinnerLast3Win3: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440030',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440030', // mockEntryLast3Win3
  consumer_user_id: 'user-other-005',
  owner_id: 'user-other-005',
  owner_type: 'user',
  entry_number: '6666666345',
  digits_matched: 3,
  prize_tier: 'last_3',
  prize_iqd: 25000,
  winning_number_index: 3,
  winning_number: 5555512345,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T13:00:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T13:00:00Z',
};

// Winner #6b: Last-5 match on winning_number_2 (43210) - CLEAN UNDER-CAP COMPLETED
// Prize = 250,000 IQD, under 1M weekly cap → completed normally
// This demonstrates the normal happy path for a mid-tier winner
export const mockDrawWinnerLast5Completed: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440025',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440025',
  consumer_user_id: 'user-other-007',
  owner_id: 'user-other-007',
  owner_type: 'user',
  entry_number: '8888843210', // Matches winning_number_2 Last-5: 43210
  digits_matched: 5,
  prize_tier: 'last_5',
  prize_iqd: 250000,
  winning_number_index: 2,
  winning_number: 9876543210,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T11:45:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T11:45:00Z',
};

// Winner #7a: Multi-winner's FIRST win (Last-7) - gets COMPLETED because under cap
// User 'user-multi-winner' wins 800K from this entry (under 1M cap → paid)
// Uses unique entry number '1114567890' which matches winning_number_1 Last-7: 4567890
export const mockDrawWinnerMultiWinFirst: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440051',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440051',
  consumer_user_id: 'user-multi-winner',
  owner_id: 'user-multi-winner',
  owner_type: 'user',
  entry_number: '1114567890', // Matches winning_number_1 Last-7: 4567890
  digits_matched: 7,
  prize_tier: 'last_7',
  prize_iqd: 800000, // Custom amount for testing (normally 2.5M but using 800K to show cumulative cap scenario)
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: false,
  payout_status: 'completed',
  payout_processed_at: '2024-03-22T10:30:00Z',
  requires_compliance_review: false,
  cap_exceeded: false,
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-22T10:30:00Z',
};

// Winner #8: Split jackpot winner (another user also matched Last-10 on winning_number_1)
// Weekly cap = 1,000,000 IQD; prize = 50M IQD → held due to cap exceeded
export const mockDrawWinnerSplitJackpot: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440040',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440040', // mockEntrySplitJackpot
  consumer_user_id: 'user-other-006',
  owner_id: 'user-other-006',
  owner_type: 'user',
  entry_number: '1234567890',
  digits_matched: 10,
  prize_tier: 'last_10',
  prize_iqd: 50000000, // Split jackpot (100M / 2)
  winning_number_index: 1,
  winning_number: 1234567890,
  is_jackpot: true,
  jackpot_split_count: 2,
  original_prize_amount_iqd: 100000000,
  payout_status: 'held_cap_exceeded',
  payout_held_reason: 'Weekly payout cap exceeded (1,000,000 IQD limit)',
  requires_compliance_review: true,
  cap_exceeded: true,
  cap_exceeded_amount_iqd: 49000000, // 50M - 1M cap = 49M excess
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-21T21:00:00Z',
};

// Winner #8: Multi-win scenario - user already won 800K from another entry in this draw
// This 250K prize pushes their total to 1,050,000 IQD, exceeding the 1M weekly cap by 50K
// The first 800K win was paid, but this one is held because cumulative total exceeds cap
export const mockDrawWinnerMultiWinCapped: DrawWinner = {
  draw_winner_id: '880e8400-e29b-41d4-a716-446655440050',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  draw_id: mockDraw.draw_id,
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440050', // mockEntryHeldForReview
  consumer_user_id: 'user-multi-winner',
  owner_id: 'user-multi-winner',
  owner_type: 'user',
  entry_number: '5555543210',
  digits_matched: 5,
  prize_tier: 'last_5',
  prize_iqd: 250000,
  winning_number_index: 2,
  winning_number: 9876543210,
  is_jackpot: false,
  payout_status: 'held_cap_exceeded',
  payout_held_reason: 'Weekly payout cap exceeded - cumulative wins (800K + 250K = 1,050K > 1M cap)',
  requires_compliance_review: true,
  cap_exceeded: true,
  cap_exceeded_amount_iqd: 50000, // Only 50K excess because prior wins consumed 800K of the 1M cap
  created_at: '2024-03-21T20:30:00Z',
  updated_at: '2024-03-21T21:00:00Z',
};

// Legacy alias for backward compatibility
export const mockDrawWinner = mockDrawWinnerUserJackpot;
// Alias for renamed fixture
export const mockDrawWinnerHeldForReview = mockDrawWinnerMultiWinCapped;

// Complete list of all draw winners
export const mockDrawWinnersList: DrawWinner[] = [
  mockDrawWinnerUserJackpot,     // User's jackpot (winning_number_1, Last-10) - HELD (cap exceeded)
  mockDrawWinnerLast3Win1,       // winning_number_1, Last-3 - COMPLETED (under cap)
  mockDrawWinnerLast5Win1,       // winning_number_1, Last-5 - COMPLETED (under cap)
  mockDrawWinnerLast7Win1,       // winning_number_1, Last-7 - HELD (cap exceeded)
  mockDrawWinnerLast3Win2,       // winning_number_2, Last-3 - COMPLETED (under cap)
  mockDrawWinnerLast3Win3,       // winning_number_3, Last-3 - COMPLETED (under cap)
  mockDrawWinnerLast5Completed,  // winning_number_2, Last-5 - COMPLETED (under cap, clean example)
  mockDrawWinnerSplitJackpot,    // winning_number_1, Last-10 (split) - HELD (cap exceeded)
  mockDrawWinnerMultiWinFirst,   // winning_number_1, Last-7 - COMPLETED (first multi-win, 800K under cap)
  mockDrawWinnerMultiWinCapped,  // winning_number_2, Last-5 - HELD (second multi-win, cumulative cap exceeded)
];

export const mockDrawWinners: DrawWinnerListResponse = {
  draw_winners_list: mockDrawWinnersList,
  total_draw_winners: 10,
  page: 1,
  page_size: 20,
};

// ===========================================
// Entry Fixtures
// ===========================================

// Entry matching winning_number_1 (1234567890) - JACKPOT (Last-10)
// This entry belongs to the authenticated mock user for "your win" highlighting
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
  digits_matched: 10,
  prize_iqd: 50000000, // Split jackpot (100M / 2)
  created_at: '2024-03-20T14:30:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry matching winning_number_1 Last-3 (890)
export const mockEntryLast3Win1: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440010',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-001',
  entry_number: '1111111890',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 90,
  trailing_3: 890,
  trailing_4: 1890,
  trailing_5: 11890,
  trailing_6: 111890,
  trailing_7: 1111890,
  trailing_8: 11111890,
  trailing_9: 111111890,
  trailing_10: 1111111890,
  transaction_amount_iqd: 25000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 3,
  prize_iqd: 25000,
  created_at: '2024-03-20T10:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry matching winning_number_1 Last-5 (67890)
export const mockEntryLast5Win1: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440011',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-002',
  entry_number: '2222267890',
  source: 'challenge',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 90,
  trailing_3: 890,
  trailing_4: 7890,
  trailing_5: 67890,
  trailing_6: 267890,
  trailing_7: 2267890,
  trailing_8: 22267890,
  trailing_9: 222267890,
  trailing_10: 2222267890,
  transaction_amount_iqd: 0,
  transaction_channel: undefined,
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 5,
  prize_iqd: 250000,
  created_at: '2024-03-19T15:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry matching winning_number_1 Last-7 (4567890)
export const mockEntryLast7Win1: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440012',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-003',
  entry_number: '3334567890',
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
  trailing_9: 334567890,
  trailing_10: 3334567890,
  transaction_amount_iqd: 100000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 7,
  prize_iqd: 2500000,
  created_at: '2024-03-18T12:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry matching winning_number_2 Last-3 (210)
export const mockEntryLast3Win2: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440020',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-004',
  entry_number: '4444444210',
  source: 'referral',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 10,
  trailing_3: 210,
  trailing_4: 4210,
  trailing_5: 44210,
  trailing_6: 444210,
  trailing_7: 4444210,
  trailing_8: 44444210,
  trailing_9: 444444210,
  trailing_10: 4444444210,
  transaction_amount_iqd: 0,
  transaction_channel: undefined,
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 3,
  prize_iqd: 25000,
  created_at: '2024-03-17T09:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry matching winning_number_3 Last-3 (345)
export const mockEntryLast3Win3: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440030',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-005',
  entry_number: '6666666345',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 5,
  trailing_2: 45,
  trailing_3: 345,
  trailing_4: 6345,
  trailing_5: 66345,
  trailing_6: 666345,
  trailing_7: 6666345,
  trailing_8: 66666345,
  trailing_9: 666666345,
  trailing_10: 6666666345,
  transaction_amount_iqd: 75000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 3,
  prize_iqd: 25000,
  created_at: '2024-03-16T14:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Another jackpot winner (split) - matching winning_number_1 Last-10
export const mockEntrySplitJackpot: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440040',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-006',
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
  transaction_amount_iqd: 200000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 10,
  prize_iqd: 50000000, // Split jackpot (100M / 2)
  created_at: '2024-03-15T11:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry for clean under-cap Last-5 winner - matches winning_number_2 Last-5 (43210)
export const mockEntryLast5Completed: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440025',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-other-007',
  entry_number: '8888843210',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 10,
  trailing_3: 210,
  trailing_4: 3210,
  trailing_5: 43210,
  trailing_6: 843210,
  trailing_7: 8843210,
  trailing_8: 88843210,
  trailing_9: 888843210,
  trailing_10: 8888843210,
  transaction_amount_iqd: 100000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 5,
  prize_iqd: 250000,
  created_at: '2024-03-19T16:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry for multi-win first scenario - matches winning_number_1 Last-7 (4567890)
// User 'user-multi-winner' first winning entry (800K paid)
export const mockEntryMultiWinFirst: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440051',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-multi-winner',
  entry_number: '1114567890',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 90,
  trailing_3: 890,
  trailing_4: 7890,
  trailing_5: 67890,
  trailing_6: 567890,
  trailing_7: 4567890,
  trailing_8: 14567890,
  trailing_9: 114567890,
  trailing_10: 1114567890,
  transaction_amount_iqd: 120000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 7,
  prize_iqd: 800000,
  created_at: '2024-03-18T14:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Entry for multi-win capped scenario - matches winning_number_2 Last-5
// User 'user-multi-winner' already won 800K from another entry, this is their second win
export const mockEntryMultiWinCapped: FawzEntry = {
  fawz_entry_id: '990e8400-e29b-41d4-a716-446655440050',
  tenant_id: '770e8400-e29b-41d4-a716-446655440001',
  consumer_user_id: 'user-multi-winner',
  entry_number: '5555543210',
  source: 'transaction',
  draw_week: '2024-W12',
  trailing_1: 0,
  trailing_2: 10,
  trailing_3: 210,
  trailing_4: 3210,
  trailing_5: 43210,
  trailing_6: 543210,
  trailing_7: 5543210,
  trailing_8: 55543210,
  trailing_9: 555543210,
  trailing_10: 5555543210,
  transaction_amount_iqd: 150000,
  transaction_channel: 'pos',
  multiplier_applied: 1,
  is_valid: true,
  outcome: 'won',
  outcome_draw_id: mockDraw.draw_id,
  digits_matched: 5,
  prize_iqd: 250000,
  created_at: '2024-03-14T08:00:00Z',
  updated_at: '2024-03-21T20:30:00Z',
};

// Alias for backward compatibility
export const mockEntryHeldForReview = mockEntryMultiWinCapped;

export const mockEntryList: FawzEntryListResponse = {
  fawz_entries_list: [
    mockEntry, // Jackpot winner (user's own entry)
    mockEntryLast3Win1,
    mockEntryLast5Win1,
    mockEntryLast7Win1,
    mockEntryLast3Win2,
    mockEntryLast3Win3,
    mockEntryLast5Completed, // Clean under-cap winner
    mockEntrySplitJackpot,
    mockEntryMultiWinFirst,  // Multi-win first entry (800K paid)
    mockEntryMultiWinCapped, // Multi-win second entry (250K held, cumulative cap exceeded)
    // Additional active entries for variety
    {
      ...mockEntry,
      fawz_entry_id: '990e8400-e29b-41d4-a716-446655440003',
      consumer_user_id: mockUser.id,
      entry_number: '5555555555',
      source: 'referral',
      outcome: 'active',
      outcome_draw_id: undefined,
      digits_matched: undefined,
      prize_iqd: undefined,
      trailing_3: 555,
      trailing_5: 55555,
      trailing_7: 5555555,
      trailing_10: 5555555555,
    },
    {
      ...mockEntry,
      fawz_entry_id: '990e8400-e29b-41d4-a716-446655440004',
      consumer_user_id: mockUser.id,
      entry_number: '7777777777',
      source: 'transaction',
      outcome: 'active',
      outcome_draw_id: undefined,
      digits_matched: undefined,
      prize_iqd: undefined,
      trailing_3: 777,
      trailing_5: 77777,
      trailing_7: 7777777,
      trailing_10: 7777777777,
    },
  ],
  total_fawz_entries: 12,
  page: 1,
  page_size: 20,
};

export const mockEntrySummary: EntrySummary = {
  total_entries: 45,
  entries_this_week: 5,
  entries_this_month: 25,
  entries_by_source: {
    transaction: 30,
    challenge: 8,
    referral: 5,
    retroactive: 2,
    bonus: 0,
    onboarding: 0,
  },
  active_entries: 2,
  won_entries: 1,
  total_prizes_iqd: 250000,
  current_draw_count: 3,
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
      title: 'draw_reminder',
      title_ar: 'السحب يبدأ خلال 10 دقائق!',
      title_en: 'Draw starts in 10 minutes!',
      body_ar: 'استعد! السحب الأسبوعي يبدأ قريباً. لديك 5 أرقام مشاركة.',
      body_en: 'Get ready! Weekly draw starts soon. You have 5 entries.',
      notification_type: 'draw_reminder',
      is_read: false,
      priority: 'high',
      created_at: '2024-03-21T19:50:00Z',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440003',
      title: 'referral_success',
      title_ar: 'صديقك انضم إلى فوز!',
      title_en: 'Your friend joined FAWZ!',
      body_ar: 'أحمد قبل دعوتك وحصلت على 3 أرقام مجانية!',
      body_en: 'Ahmed accepted your invite and you earned 3 free entries!',
      notification_type: 'referral_success',
      is_read: false,
      priority: 'normal',
      deep_link: '/referral',
      created_at: '2024-03-20T14:30:00Z',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440004',
      title: 'entry_earned',
      title_ar: 'حصلت على رقم جديد!',
      title_en: 'You earned a new entry!',
      body_ar: 'عملية دفع بقيمة 50,000 دينار منحتك رقم فوز جديد.',
      body_en: 'A 50,000 IQD transaction earned you a new FAWZ entry.',
      notification_type: 'entry_earned',
      is_read: true,
      read_at: '2024-03-20T16:00:00Z',
      priority: 'normal',
      deep_link: '/entries',
      created_at: '2024-03-20T15:45:00Z',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440005',
      title: 'challenge_completed',
      title_ar: 'أكملت التحدي!',
      title_en: 'Challenge completed!',
      body_ar: 'أكملت تحدي "ادفع 5 أيام متتالية" وحصلت على 10 أرقام إضافية!',
      body_en: 'You completed "Pay 5 consecutive days" and earned 10 bonus entries!',
      notification_type: 'challenge_completed',
      is_read: false,
      priority: 'normal',
      deep_link: '/challenges',
      created_at: '2024-03-19T18:00:00Z',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440006',
      title: 'matching_tickets',
      title_ar: 'لديك أرقام متطابقة!',
      title_en: 'You have matching numbers!',
      body_ar: 'تهانينا! رقمك ينتهي بـ 567 ويتطابق مع السحب الأسبوعي!',
      body_en: 'Congratulations! Your entry ending in 567 matches the weekly draw!',
      notification_type: 'draw_result_winner',
      is_read: false,
      priority: 'high',
      deep_link: '/prizes',
      created_at: '2024-03-18T20:35:00Z',
    },
    {
      ...mockNotification,
      notification_id: 'aa0e8400-e29b-41d4-a716-446655440007',
      title: 'challenge_progress',
      title_ar: 'لا تفوت التحدي!',
      title_en: "Don't miss the challenge!",
      body_ar: 'باقي يوم واحد لإكمال تحدي "ادفع 3 مرات هذا الأسبوع".',
      body_en: '1 day left to complete "Pay 3 times this week" challenge.',
      notification_type: 'challenge_progress',
      is_read: true,
      read_at: '2024-03-17T10:00:00Z',
      priority: 'normal',
      deep_link: '/challenges',
      created_at: '2024-03-17T09:00:00Z',
    },
  ],
  total_notifications: 7,
  page: 1,
  page_size: 20,
};

export const mockUnreadCount = { count: 5 };

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

// ===========================================
// Wallet Mock Values (placeholder until wallet service exists)
// ===========================================

/** Mock user wallet balance in IQD */
export const mockWalletBalance = 250000;

/** Mock monthly spending in IQD */
export const mockMonthlySpend = 1500000;
