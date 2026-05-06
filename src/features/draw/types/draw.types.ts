/**
 * Draw Types and Zod Schemas
 * Based on backend-fawz-draw-management API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const DrawTypeEnum = z.enum(['weekly', 'monthly']);
export type DrawType = z.infer<typeof DrawTypeEnum>;

export const DrawStatusEnum = z.enum([
  'scheduled',
  'pool_snapshotted',
  'live',
  'finalized',
  'archived',
  'cancelled',
]);
export type DrawStatus = z.infer<typeof DrawStatusEnum>;

export const PayoutStatusEnum = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'on_hold',
  'requires_review',
]);
export type PayoutStatus = z.infer<typeof PayoutStatusEnum>;

// ==========================================
// Entity Types
// ==========================================

// Draw entity
export interface Draw {
  draw_id: string;
  tenant_id: string;
  draw_date: string;
  draw_time?: string;
  draw_type: DrawType;
  draw_number: number;
  status: DrawStatus;
  entry_cutoff_at: string;
  scheduled_broadcast_at: string;
  entry_pool_size: number;
  entry_pool_snapshot_at?: string;
  broadcast_started_at?: string;
  finalized_at?: string;
  finalized_by?: string;
  archived_at?: string;
  // Winning numbers
  winning_numbers?: string;
  winning_number_1?: number;
  winning_number_2?: number;
  winning_number_3?: number;
  // Prize tiers
  prize_tier_last_3_iqd: number;
  prize_tier_last_5_iqd: number;
  prize_tier_last_7_iqd: number;
  prize_tier_last_10_iqd: number;
  // Jackpot
  jackpot_amount_iqd: number;
  jackpot_rollover_iqd: number;
  jackpot_claimed: boolean;
  jackpot_winners_count: number;
  // Stats
  total_winners: number;
  total_payout_iqd: number;
  consumer_winners: number;
  consumer_payout_iqd: number;
  merchant_winners: number;
  merchant_payout_iqd: number;
  // Security
  sealed_commit_hash?: string;
  pre_generated_numbers_encrypted?: string;
  pre_generated_at?: string;
  pre_generated_by?: string;
  physical_draw_mismatch: boolean;
  mismatch_notes?: string;
  created_at: string;
  updated_at: string;
}

// Draw digit event (live broadcast)
export interface DrawDigitEvent {
  draw_digit_event_id: string;
  tenant_id: string;
  draw_id: string;
  digit_position: number;
  digit_value: number;
  number_index: number;
  entered_at: string;
  entered_by: string;
  created_at: string;
}

// Draw winner
export interface DrawWinner {
  draw_winner_id: string;
  tenant_id: string;
  draw_id: string;
  fawz_entry_id: string;
  consumer_user_id?: string;
  merchant_id?: string;
  entry_number: string;
  digits_matched: number;
  prize_tier: string;
  prize_iqd: number;
  payout_status: PayoutStatus;
  payout_processed_at?: string;
  payout_reference?: string;
  requires_compliance_review: boolean;
  compliance_reviewed_at?: string;
  compliance_reviewed_by?: string;
  created_at: string;
  updated_at: string;
}

// Draw prize tier
export interface DrawPrizeTier {
  draw_prize_tier_id: string;
  tenant_id: string;
  draw_id: string;
  tier_name: string;
  digits_to_match: number;
  prize_amount_iqd: number;
  max_winners?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Jackpot rollover
export interface JackpotRollover {
  jackpot_rollover_id: string;
  tenant_id: string;
  from_draw_id: string;
  to_draw_id: string;
  rollover_amount_iqd: number;
  rolled_over_at: string;
  created_at: string;
}

// ==========================================
// API Response Types
// ==========================================

// List draws response
export interface DrawListResponse {
  draws_list: Draw[];
  total_draws: number;
  page: number;
  page_size: number;
}

// List draw winners response
export interface DrawWinnerListResponse {
  draw_winners_list: DrawWinner[];
  total_draw_winners: number;
  page: number;
  page_size: number;
}

// List draw digit events response
export interface DrawDigitEventListResponse {
  draw_digit_events_list: DrawDigitEvent[];
  total_draw_digit_events: number;
  page: number;
  page_size: number;
}

// Winner summary by tier
export interface WinnerSummary {
  tier: string;
  digits_matched: number;
  winner_count: number;
  total_payout_iqd: number;
}

// Draw detail with winner summary
export interface DrawDetail extends Draw {
  winner_summary?: WinnerSummary[];
  user_winners?: DrawWinner[];
}

// ==========================================
// Query Params
// ==========================================

export interface DrawListParams {
  page?: number;
  page_size?: number;
  draw_type?: DrawType;
  status?: DrawStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface DrawWinnerListParams {
  page?: number;
  page_size?: number;
  draw_id?: string;
  consumer_user_id?: string;
  payout_status?: PayoutStatus;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==========================================
// WebSocket Types
// ==========================================

export type WebSocketConnectionState = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface DrawWebSocketMessage {
  type: 'digit_event' | 'finalization' | 'connection_count' | 'error';
  payload: DrawDigitEvent | DrawFinalization | ConnectionCount | ErrorPayload;
}

export interface DrawFinalization {
  draw_id: string;
  status: 'finalized';
  total_winners: number;
  user_winners?: DrawWinner[];
}

export interface ConnectionCount {
  count: number;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

// ==========================================
// UI State Types
// ==========================================

// Digit slot state
export interface DigitSlot {
  position: number;
  value: number | null;
  isRevealed: boolean;
  isMatching?: boolean;
}

// Live draw state
export interface LiveDrawState {
  drawId: string;
  status: DrawStatus;
  digitSlots: DigitSlot[][];
  currentNumberIndex: number;
  connectionState: WebSocketConnectionState;
  viewerCount: number;
  jackpotAmount: number;
  entryPoolSize: number;
  isFinalized: boolean;
  userResult?: {
    isWinner: boolean;
    matchedEntries: DrawWinner[];
  };
}

// Draw card display data
export interface DrawCardData {
  id: string;
  type: DrawType;
  date: string;
  status: DrawStatus;
  totalWinners: number;
  totalPayoutIqd: number;
  userWon: boolean;
  userPrizeIqd?: number;
}

// ==========================================
// Share Card Types
// ==========================================

export interface ShareCardData {
  drawWinnerId: string;
  entryNumber: string;
  digitsMatched: number;
  prizeTier: string;
  prizeIqd: number;
  drawDate: string;
  drawType: DrawType;
}
