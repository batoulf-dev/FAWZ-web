/**
 * Referrals Types and Zod Schemas
 * Based on backend-fawz-referral-system API
 */

import { z } from 'zod';

// ==========================================
// Enums
// ==========================================

export const ReferralTypeEnum = z.enum([
  'consumer_to_consumer',
  'consumer_to_merchant',
  'merchant_to_consumer',
]);
export type ReferralType = z.infer<typeof ReferralTypeEnum>;

export const ReferralStatusEnum = z.enum([
  'initiated',
  'clicked',
  'registered',
  'pending',
  'qualified',
  'rewarded',
  'pending_review',
  'rejected',
  'expired',
  'archived',
]);
export type ReferralStatus = z.infer<typeof ReferralStatusEnum>;

export const ReviewDecisionEnum = z.enum(['approved', 'rejected']);
export type ReviewDecision = z.infer<typeof ReviewDecisionEnum>;

// ==========================================
// Entity Types
// ==========================================

// Referral link entity
export interface ReferralLink {
  referral_link_id: string;
  tenant_id: string;
  referrer_id: string;
  referral_code: string;
  short_url: string;
  full_url: string;
  qr_code_url?: string;
  expires_at: string;
  is_active: boolean;
  click_count: number;
  conversion_count: number;
  created_at: string;
  updated_at: string;
}

// Referral entity
export interface Referral {
  referral_id: string;
  tenant_id: string;
  referrer_id: string;
  referred_id?: string;
  referral_link_id?: string;
  referral_code: string;
  referral_type: ReferralType;
  status: ReferralStatus;
  // Click data
  clicked_at?: string;
  click_ip?: string;
  click_ip_hash?: string;
  click_device_fingerprint?: string;
  click_device_fingerprint_hash?: string;
  // Registration
  registered_at?: string;
  // Qualification
  qualified_at?: string;
  qualifying_transaction_id?: string;
  qualifying_transaction_amount_iqd?: number;
  // Fraud checks
  fraud_check_different_device: boolean;
  fraud_check_different_qi_card: boolean;
  fraud_check_no_prior_activity: boolean;
  fraud_check_qualifying_tx_type: boolean;
  fraud_validation_passed: boolean;
  fraud_validation_results?: string;
  // Review
  review_case_id?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_decision?: ReviewDecision;
  review_notes?: string;
  pending_review_at?: string;
  // Rewards
  referrer_reward_entries: number;
  referrer_reward_cash_iqd: number;
  referrer_rewarded_at?: string;
  referred_reward_entries: number;
  referred_rewarded_at?: string;
  // Expiry
  link_expires_at: string;
  expires_at?: string;
  expired_at?: string;
  rejected_at?: string;
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
}

// Referral click tracking
export interface ReferralClickTracking {
  referral_click_tracking_id: string;
  tenant_id: string;
  referral_link_id: string;
  click_ip: string;
  click_ip_hash: string;
  device_fingerprint?: string;
  device_fingerprint_hash?: string;
  user_agent?: string;
  referrer_url?: string;
  clicked_at: string;
  converted: boolean;
  converted_at?: string;
  created_at: string;
}

// ==========================================
// API Response Types
// ==========================================

// List referrals response
export interface ReferralListResponse {
  referrals_list: Referral[];
  total_referrals: number;
  page: number;
  page_size: number;
}

// List referral links response
export interface ReferralLinkListResponse {
  referral_links_list: ReferralLink[];
  total_referral_links: number;
  page: number;
  page_size: number;
}

// Referral stats response
export interface ReferralStats {
  referral_count_month: number;
  referral_count_total: number;
  entries_earned: number;
  cash_earned_iqd: number;
  pending_referrals: number;
  successful_referrals: number;
}

// ==========================================
// Query Params
// ==========================================

export interface ReferralListParams {
  page?: number;
  page_size?: number;
  status?: ReferralStatus;
  referral_type?: ReferralType;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// ==========================================
// UI Display Types
// ==========================================

// Referral row display data
export interface ReferralRowData {
  id: string;
  referredName: string;
  maskedName: string;
  status: ReferralStatus;
  statusLabel: string;
  qualifiedAt?: string;
  rewardEntries: number;
  rewardCashIqd: number;
  isSuccessful: boolean;
  isPending: boolean;
  isRejected: boolean;
}

// Referral screen state
export interface ReferralScreenState {
  referralLink: ReferralLink | null;
  stats: ReferralStats | null;
  isLinkExpired: boolean;
  isNearMonthlyLimit: boolean;
  monthlyLimit: number;
}

// Share data for WhatsApp
export interface ReferralShareData {
  code: string;
  shortUrl: string;
  message: string;
  whatsappUrl: string;
}
