/**
 * Referrals Service
 * API functions and TanStack Query hooks for referral management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  Referral,
  ReferralListResponse,
  ReferralListParams,
  ReferralLink,
  ReferralLinkListResponse,
  ReferralStats,
  ReferralShareData,
} from '../types/referrals.types';

// ==========================================
// API Base Path
// ==========================================

const REFERRAL_BASE = '/fawz_referral_system';

// ==========================================
// Query Keys Factory
// ==========================================

export const referralKeys = {
  all: ['referrals'] as const,
  lists: () => [...referralKeys.all, 'list'] as const,
  list: (params: ReferralListParams) => [...referralKeys.lists(), params] as const,
  details: () => [...referralKeys.all, 'detail'] as const,
  detail: (id: string) => [...referralKeys.details(), id] as const,
  links: () => [...referralKeys.all, 'links'] as const,
  myLink: () => [...referralKeys.links(), 'my'] as const,
  stats: () => [...referralKeys.all, 'stats'] as const,
  history: () => [...referralKeys.all, 'history'] as const,
};

// ==========================================
// API Functions
// ==========================================

// List referrals (history)
async function listReferrals(params: ReferralListParams = {}): Promise<ReferralListResponse> {
  const response = await apiClient.get<ReferralListResponse>(
    `${REFERRAL_BASE}/referrals`,
    {
      params: {
        page: params.page ?? 1,
        page_size: params.page_size ?? 20,
        sort_by: params.sort_by ?? 'created_at',
        sort_order: params.sort_order ?? 'desc',
        ...params,
      },
    },
  );
  return response.data;
}

// Get referral by ID
async function getReferralById(referralId: string): Promise<Referral> {
  const response = await apiClient.get<Referral>(
    `${REFERRAL_BASE}/referrals/${referralId}`,
  );
  return response.data;
}

// Get user's referral link
async function getMyReferralLink(): Promise<ReferralLink | null> {
  const response = await apiClient.get<ReferralLinkListResponse>(
    `${REFERRAL_BASE}/referral_links`,
    {
      params: {
        is_active: true,
        sort_by: 'created_at',
        sort_order: 'desc',
        page_size: 1,
      },
    },
  );
  return response.data.referral_links_list[0] ?? null;
}

// Create referral link (if none exists)
async function createReferralLink(): Promise<ReferralLink> {
  const response = await apiClient.post<{ referral_link_id: string; message: string }>(
    `${REFERRAL_BASE}/referral_links`,
    {},
  );

  // Fetch the created link
  const linkResponse = await apiClient.get<ReferralLink>(
    `${REFERRAL_BASE}/referral_links/${response.data.referral_link_id}`,
  );
  return linkResponse.data;
}

// Get or create referral link
async function getOrCreateReferralLink(): Promise<ReferralLink> {
  const existingLink = await getMyReferralLink();
  if (existingLink && new Date(existingLink.expires_at) > new Date()) {
    return existingLink;
  }
  return createReferralLink();
}

// Get referral stats
async function getReferralStats(): Promise<ReferralStats> {
  // Compute stats from referral list
  const [allReferrals, monthReferrals] = await Promise.all([
    listReferrals({ page_size: 1 }),
    listReferrals({ page_size: 100 }), // Get recent for monthly count
  ]);

  const referrals = monthReferrals.referrals_list;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  let monthCount = 0;
  let entriesEarned = 0;
  let cashEarned = 0;
  let pendingCount = 0;
  let successfulCount = 0;

  referrals.forEach((ref) => {
    const createdAt = new Date(ref.created_at);
    if (createdAt >= monthStart) {
      monthCount++;
    }

    if (ref.status === 'rewarded' || ref.status === 'qualified') {
      successfulCount++;
      entriesEarned += ref.referrer_reward_entries;
      cashEarned += ref.referrer_reward_cash_iqd;
    }

    if (ref.status === 'pending' || ref.status === 'pending_review') {
      pendingCount++;
    }
  });

  return {
    referral_count_month: monthCount,
    referral_count_total: allReferrals.total_referrals,
    entries_earned: entriesEarned,
    cash_earned_iqd: cashEarned,
    pending_referrals: pendingCount,
    successful_referrals: successfulCount,
  };
}

// Get referral history
async function getReferralHistory(): Promise<Referral[]> {
  const response = await listReferrals({
    page_size: 50,
    sort_by: 'created_at',
    sort_order: 'desc',
  });
  return response.referrals_list;
}

// Generate share data
function generateShareData(link: ReferralLink): ReferralShareData {
  const message = `🎉 سجّل في فوز واحصل على 100 رقم فوز مجاناً! استخدم رابطي: ${link.short_url}`;
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;

  return {
    code: link.referral_code,
    shortUrl: link.short_url,
    message,
    whatsappUrl,
  };
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// Get user's referral link
export function useMyReferralLink() {
  return useQuery({
    queryKey: referralKeys.myLink(),
    queryFn: getOrCreateReferralLink,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

// Get referral stats
export function useReferralStats() {
  return useQuery({
    queryKey: referralKeys.stats(),
    queryFn: getReferralStats,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get referral history
export function useReferralHistory() {
  return useQuery({
    queryKey: referralKeys.history(),
    queryFn: getReferralHistory,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// List referrals with pagination
export function useReferralList(params: ReferralListParams = {}) {
  return useQuery({
    queryKey: referralKeys.list(params),
    queryFn: () => listReferrals(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single referral
export function useReferral(referralId: string, enabled = true) {
  return useQuery({
    queryKey: referralKeys.detail(referralId),
    queryFn: () => getReferralById(referralId),
    enabled: enabled && !!referralId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Create referral link mutation
export function useCreateReferralLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createReferralLink,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referralKeys.links() });
    },
  });
}

// ==========================================
// Utility Hooks
// ==========================================

// Get share data for current link
export function useReferralShareData() {
  const { data: link, isLoading, error } = useMyReferralLink();

  const shareData = link ? generateShareData(link) : null;

  return {
    shareData,
    isLoading,
    error,
    link,
  };
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const referralApi = {
  listReferrals,
  getReferralById,
  getMyReferralLink,
  createReferralLink,
  getOrCreateReferralLink,
  getReferralStats,
  getReferralHistory,
  generateShareData,
};
