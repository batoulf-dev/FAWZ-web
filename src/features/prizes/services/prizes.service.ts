/**
 * Prizes Service
 * API functions and TanStack Query hooks for prize/payout management
 */

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  PrizePayout,
  PrizePayoutListResponse,
  PrizePayoutListParams,
  PrizeSummary,
  PrizeTier,
} from '../types/prizes.types';

// ==========================================
// API Base Path
// ==========================================

const PRIZE_BASE = '/fawz_prize_payout_management';

// ==========================================
// Query Keys Factory
// ==========================================

export const prizeKeys = {
  all: ['prizes'] as const,
  lists: () => [...prizeKeys.all, 'list'] as const,
  list: (params: PrizePayoutListParams) => [...prizeKeys.lists(), params] as const,
  details: () => [...prizeKeys.all, 'detail'] as const,
  detail: (id: string) => [...prizeKeys.details(), id] as const,
  summary: () => [...prizeKeys.all, 'summary'] as const,
  myWins: () => [...prizeKeys.all, 'myWins'] as const,
};

// ==========================================
// API Functions
// ==========================================

// List prize payouts
async function listPrizePayouts(
  params: PrizePayoutListParams = {},
): Promise<PrizePayoutListResponse> {
  const response = await apiClient.get<PrizePayoutListResponse>(
    `${PRIZE_BASE}/prize_payouts`,
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

// Get prize payout by ID
async function getPrizePayoutById(payoutId: string): Promise<PrizePayout> {
  const response = await apiClient.get<PrizePayout>(
    `${PRIZE_BASE}/prize_payouts/${payoutId}`,
  );
  return response.data;
}

// Get user's prize wins
async function getMyWins(): Promise<PrizePayout[]> {
  const response = await apiClient.get<PrizePayoutListResponse>(
    `${PRIZE_BASE}/prize_payouts`,
    {
      params: {
        sort_by: 'created_at',
        sort_order: 'desc',
        page_size: 100,
      },
    },
  );
  return response.data.prize_payouts_list;
}

// Get prize summary/stats
async function getPrizeSummary(): Promise<PrizeSummary> {
  const allPrizes = await getMyWins();

  const winsByTier: Record<PrizeTier, number> = {
    last_3: 0,
    last_5: 0,
    last_7: 0,
    last_10: 0,
    jackpot: 0,
  };

  let lifetimeTotal = 0;
  let pendingTotal = 0;
  let completedTotal = 0;

  allPrizes.forEach((prize) => {
    lifetimeTotal += prize.prize_amount_iqd;

    if (prize.prize_tier in winsByTier) {
      winsByTier[prize.prize_tier as PrizeTier]++;
    }

    if (prize.payout_status === 'completed') {
      completedTotal += prize.prize_amount_iqd;
    } else if (
      prize.payout_status === 'pending' ||
      prize.payout_status === 'processing'
    ) {
      pendingTotal += prize.prize_amount_iqd;
    }
  });

  return {
    lifetime_total_iqd: lifetimeTotal,
    total_wins: allPrizes.length,
    wins_by_tier: winsByTier,
    pending_payouts_iqd: pendingTotal,
    completed_payouts_iqd: completedTotal,
  };
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// List prize payouts with pagination
export function usePrizePayoutList(params: PrizePayoutListParams = {}) {
  return useQuery({
    queryKey: prizeKeys.list(params),
    queryFn: () => listPrizePayouts(params),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single prize payout
export function usePrizePayout(payoutId: string, enabled = true) {
  return useQuery({
    queryKey: prizeKeys.detail(payoutId),
    queryFn: () => getPrizePayoutById(payoutId),
    enabled: enabled && !!payoutId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get user's prize wins
export function useMyWins(enabled = true) {
  return useQuery({
    queryKey: prizeKeys.myWins(),
    queryFn: getMyWins,
    enabled,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get prize summary
export function usePrizeSummary(enabled = true) {
  return useQuery({
    queryKey: prizeKeys.summary(),
    queryFn: getPrizeSummary,
    enabled,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const prizeApi = {
  listPrizePayouts,
  getPrizePayoutById,
  getMyWins,
  getPrizeSummary,
};
