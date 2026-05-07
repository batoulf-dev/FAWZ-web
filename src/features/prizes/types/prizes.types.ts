/**
 * Prizes Types and Zod Schemas
 * Based on backend-fawz-prize-payout-management API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const PayoutStatusEnum = z.enum([
  'pending',
  'processing',
  'completed',
  'failed',
  'on_hold',
  'requires_review',
  'cancelled',
  'held_cap_exceeded',
]);
export type PayoutStatus = z.infer<typeof PayoutStatusEnum>;

export const PrizeTierEnum = z.enum([
  'last_3',
  'last_5',
  'last_7',
  'last_10',
  'jackpot',
]);
export type PrizeTier = z.infer<typeof PrizeTierEnum>;

export const PeriodTypeEnum = z.enum(['weekly', 'monthly', 'yearly']);
export type PeriodType = z.infer<typeof PeriodTypeEnum>;

// ==========================================
// Entity Types
// ==========================================

// Prize payout entity
export interface PrizePayout {
  prize_payout_id: string;
  tenant_id: string;
  draw_winner_id: string;
  consumer_user_id?: string;
  merchant_id?: string;
  // Prize details
  prize_amount_iqd: number;
  prize_tier: PrizeTier;
  draw_id: string;
  draw_date: string;
  // Payout details
  payout_status: PayoutStatus;
  payout_method?: string;
  payout_reference?: string;
  payout_attempted_at?: string;
  payout_completed_at?: string;
  payout_failed_reason?: string;
  retry_count: number;
  max_retries: number;
  // Compliance
  requires_compliance_review: boolean;
  compliance_review_status?: string;
  compliance_reviewed_at?: string;
  compliance_reviewed_by?: string;
  compliance_notes?: string;
  // Hold status
  is_on_hold: boolean;
  hold_reason?: string;
  held_at?: string;
  held_by?: string;
  released_at?: string;
  released_by?: string;
  created_at: string;
  updated_at: string;
}

// User payout cap
export interface UserPayoutCap {
  user_payout_cap_id: string;
  tenant_id: string;
  consumer_user_id: string;
  // Weekly cap
  weekly_cap_iqd: number;
  weekly_used_iqd: number;
  weekly_remaining_iqd: number;
  weekly_reset_at: string;
  // Monthly cap
  monthly_cap_iqd: number;
  monthly_used_iqd: number;
  monthly_remaining_iqd: number;
  monthly_reset_at: string;
  created_at: string;
  updated_at: string;
}

// Budget monitoring
export interface BudgetMonitoring {
  budget_monitoring_id: string;
  tenant_id: string;
  period_type: PeriodType;
  period_start: string;
  period_end: string;
  budget_amount_iqd: number;
  actual_spend_iqd: number;
  projected_spend_iqd: number;
  utilization_percent: number;
  alert_threshold_80_sent: boolean;
  alert_threshold_100_sent: boolean;
  last_updated_at: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// API Response Types
// ==========================================

// List prize payouts response
export interface PrizePayoutListResponse {
  prize_payouts_list: PrizePayout[];
  total_prize_payouts: number;
  page: number;
  page_size: number;
}

// Prize summary stats
export interface PrizeSummary {
  lifetime_total_iqd: number;
  total_wins: number;
  wins_by_tier: Record<PrizeTier, number>;
  pending_payouts_iqd: number;
  completed_payouts_iqd: number;
}

// ==========================================
// Query Params
// ==========================================

export interface PrizePayoutListParams {
  page?: number;
  page_size?: number;
  payout_status?: PayoutStatus;
  prize_tier?: PrizeTier;
  draw_id?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==========================================
// UI Display Types
// ==========================================

// Prize row display data
export interface PrizeRowData {
  id: string;
  drawDate: string;
  drawType: string;
  prizeTier: PrizeTier;
  tierLabel: string;
  prizeIqd: number;
  formattedAmount: string;
  payoutStatus: PayoutStatus;
  statusLabel: string;
  isPaid: boolean;
  isPending: boolean;
  isOnHold: boolean;
}

// Prize history screen state
export interface PrizeHistoryState {
  prizes: PrizeRowData[];
  summary: PrizeSummary | null;
  isLoading: boolean;
  isEmpty: boolean;
}

// Prize tier display info
export interface PrizeTierInfo {
  tier: PrizeTier;
  label: string;
  labelAr: string;
  digitsMatched: number;
  color: string;
}

// Prize tiers configuration
export const PRIZE_TIERS: PrizeTierInfo[] = [
  { tier: 'last_3', label: 'Last 3', labelAr: 'آخر 3', digitsMatched: 3, color: 'bronze' },
  { tier: 'last_5', label: 'Last 5', labelAr: 'آخر 5', digitsMatched: 5, color: 'silver' },
  { tier: 'last_7', label: 'Last 7', labelAr: 'آخر 7', digitsMatched: 7, color: 'gold' },
  { tier: 'last_10', label: 'Last 10', labelAr: 'آخر 10', digitsMatched: 10, color: 'platinum' },
  { tier: 'jackpot', label: 'Jackpot', labelAr: 'الجائزة الكبرى', digitsMatched: 10, color: 'jackpot' },
];
