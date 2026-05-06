/**
 * Entries Types and Zod Schemas
 * Based on backend-fawz-entry-generation API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const EntrySourceEnum = z.enum([
  'transaction',
  'challenge',
  'referral',
  'retroactive',
  'bonus',
  'onboarding',
]);
export type EntrySource = z.infer<typeof EntrySourceEnum>;

export const EntryOutcomeEnum = z.enum(['active', 'won', 'lost']);
export type EntryOutcome = z.infer<typeof EntryOutcomeEnum>;

export const ChannelEnum = z.enum([
  'pos',
  'qr',
  'online',
  'bill_pay',
  'top_up',
  'fawz_certified_pos',
]);
export type Channel = z.infer<typeof ChannelEnum>;

// ==========================================
// Entity Types
// ==========================================

// Fawz Entry entity
export interface FawzEntry {
  fawz_entry_id: string;
  tenant_id: string;
  consumer_user_id: string;
  merchant_id?: string;
  entry_number: string;
  source: EntrySource;
  source_reference_id?: string;
  draw_id?: string;
  draw_week?: string;
  // Trailing digit indexes (for draw matching)
  trailing_1: number;
  trailing_2: number;
  trailing_3: number;
  trailing_4: number;
  trailing_5: number;
  trailing_6: number;
  trailing_7: number;
  trailing_8: number;
  trailing_9: number;
  trailing_10: number;
  // Transaction details
  transaction_id?: string;
  transaction_amount_iqd?: number;
  transaction_channel?: Channel;
  multiplier_applied: number;
  // Status
  is_valid: boolean;
  invalidated_reason?: string;
  // Outcome (populated after draw)
  outcome?: EntryOutcome;
  outcome_draw_id?: string;
  digits_matched?: number;
  prize_iqd?: number;
  created_at: string;
  updated_at: string;
}

// Entry summary for dashboard
export interface EntrySummary {
  total_entries: number;
  entries_this_week: number;
  entries_this_month: number;
  entries_by_source: Record<EntrySource, number>;
  active_entries: number;
  won_entries: number;
  total_prizes_iqd: number;
  // Dashboard-specific fields
  current_draw_count: number;
  lifetime_count: number;
  weekly_unique_days: number;
}

// Channel multiplier config
export interface ChannelMultiplierConfig {
  channel_multiplier_config_id: string;
  tenant_id: string;
  channel: Channel;
  multiplier: number;
  effective_from: string;
  effective_until?: string;
  is_active: boolean;
  merchant_id?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// ==========================================
// API Response Types
// ==========================================

// List entries response
export interface FawzEntryListResponse {
  fawz_entries_list: FawzEntry[];
  total_fawz_entries: number;
  page: number;
  page_size: number;
}

// ==========================================
// Query Params
// ==========================================

export interface EntryListParams {
  page?: number;
  page_size?: number;
  source?: EntrySource;
  draw_id?: string;
  outcome?: EntryOutcome;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==========================================
// UI Display Types
// ==========================================

// Entry row display data
export interface EntryRowData {
  id: string;
  number: string;
  formattedNumber: string;
  source: EntrySource;
  sourceLabel: string;
  drawWeek: string;
  createdAt: string;
  relativeTime: string;
  outcome: EntryOutcome;
  outcomeLabel: string;
  digitsMatched?: number;
  prizeIqd?: number;
  isWinner: boolean;
}

// Entry filter state
export interface EntryFilterState {
  source: EntrySource | 'all';
  outcome: EntryOutcome | 'all';
  sortOrder: 'asc' | 'desc';
}
