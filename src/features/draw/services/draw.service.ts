/**
 * Draw Service
 * API functions and TanStack Query hooks for draw management
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  Draw,
  DrawDetail,
  DrawListResponse,
  DrawListParams,
  DrawWinner,
  DrawWinnerListResponse,
  DrawWinnerListParams,
  DrawDigitEvent,
  DrawDigitEventListResponse,
  ShareCardData,
} from '../types/draw.types';

// ==========================================
// API Base Path
// ==========================================

const DRAW_BASE = '/fawz_draw_management';

// ==========================================
// Query Keys Factory
// ==========================================

export const drawKeys = {
  all: ['draws'] as const,
  lists: () => [...drawKeys.all, 'list'] as const,
  list: (params: DrawListParams) => [...drawKeys.lists(), params] as const,
  details: () => [...drawKeys.all, 'detail'] as const,
  detail: (id: string) => [...drawKeys.details(), id] as const,
  next: () => [...drawKeys.all, 'next'] as const,
  current: () => [...drawKeys.all, 'current'] as const,
  winners: () => [...drawKeys.all, 'winners'] as const,
  winnerList: (params: DrawWinnerListParams) => [...drawKeys.winners(), 'list', params] as const,
  drawWinners: (drawId: string) => [...drawKeys.winners(), 'draw', drawId] as const,
  userWins: (userId: string) => [...drawKeys.winners(), 'user', userId] as const,
  digits: (drawId: string) => [...drawKeys.all, 'digits', drawId] as const,
  shareCard: (winnerId: string) => [...drawKeys.all, 'shareCard', winnerId] as const,
};

// ==========================================
// API Functions
// ==========================================

// List draws with pagination and filters
async function listDraws(params: DrawListParams = {}): Promise<DrawListResponse> {
  const response = await apiClient.get<DrawListResponse>(`${DRAW_BASE}/draws`, {
    params: {
      page: params.page ?? 1,
      page_size: params.page_size ?? 20,
      ...params,
    },
  });
  return response.data;
}

// Get draw by ID
async function getDrawById(drawId: string): Promise<DrawDetail> {
  const response = await apiClient.get<DrawDetail>(`${DRAW_BASE}/draws/${drawId}`);
  return response.data;
}

// Get next upcoming draw
async function getNextDraw(): Promise<Draw | null> {
  const response = await apiClient.get<DrawListResponse>(`${DRAW_BASE}/draws`, {
    params: {
      status: 'scheduled',
      sort_by: 'draw_date',
      sort_order: 'asc',
      page_size: 1,
    },
  });
  return response.data.draws_list[0] ?? null;
}

// Get current live draw
async function getCurrentDraw(): Promise<Draw | null> {
  const response = await apiClient.get<DrawListResponse>(`${DRAW_BASE}/draws`, {
    params: {
      status: 'live',
      page_size: 1,
    },
  });
  return response.data.draws_list[0] ?? null;
}

// List draw winners
async function listDrawWinners(params: DrawWinnerListParams = {}): Promise<DrawWinnerListResponse> {
  const response = await apiClient.get<DrawWinnerListResponse>(
    `${DRAW_BASE}/draw_winners`,
    { params },
  );
  return response.data;
}

// Get user's wins for a specific draw
async function getDrawWinnersByDraw(drawId: string): Promise<DrawWinner[]> {
  const response = await apiClient.get<DrawWinnerListResponse>(
    `${DRAW_BASE}/draw_winners`,
    {
      params: { draw_id: drawId },
    },
  );
  return response.data.draw_winners_list;
}

// Get user's all wins
async function getUserWins(): Promise<DrawWinner[]> {
  const response = await apiClient.get<DrawWinnerListResponse>(
    `${DRAW_BASE}/draw_winners`,
    {
      params: { sort_by: 'created_at', sort_order: 'desc' },
    },
  );
  return response.data.draw_winners_list;
}

// Get draw digit events (for live draw or replay)
async function getDrawDigitEvents(drawId: string): Promise<DrawDigitEvent[]> {
  const response = await apiClient.get<DrawDigitEventListResponse>(
    `${DRAW_BASE}/draw_digit_events`,
    {
      params: { draw_id: drawId, sort_by: 'digit_position', sort_order: 'asc' },
    },
  );
  return response.data.draw_digit_events_list;
}

// Get share card data for a winner
async function getShareCardData(drawWinnerId: string): Promise<ShareCardData> {
  // This endpoint may need to be adjusted based on actual API
  const response = await apiClient.get<DrawWinner>(
    `${DRAW_BASE}/draw_winners/${drawWinnerId}`,
  );

  const winner = response.data;

  // Fetch draw details for additional info
  const draw = await getDrawById(winner.draw_id);

  return {
    drawWinnerId: winner.draw_winner_id,
    entryNumber: winner.entry_number,
    digitsMatched: winner.digits_matched,
    prizeTier: winner.prize_tier,
    prizeIqd: winner.prize_iqd,
    drawDate: draw.draw_date,
    drawType: draw.draw_type,
  };
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// List draws with pagination
export function useDrawList(params: DrawListParams = {}) {
  return useQuery({
    queryKey: drawKeys.list(params),
    queryFn: () => listDraws(params),
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single draw detail
export function useDraw(drawId: string, enabled = true) {
  return useQuery({
    queryKey: drawKeys.detail(drawId),
    queryFn: () => getDrawById(drawId),
    enabled: enabled && !!drawId,
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get next upcoming draw
export function useNextDraw() {
  return useQuery({
    queryKey: drawKeys.next(),
    queryFn: getNextDraw,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000, // Refetch every minute
  });
}

// Get current live draw
export function useCurrentDraw() {
  return useQuery({
    queryKey: drawKeys.current(),
    queryFn: getCurrentDraw,
    staleTime: 10 * 1000, // 10 seconds
    gcTime: 60 * 1000, // 1 minute
    refetchInterval: 10 * 1000, // Refetch every 10 seconds
  });
}

// Get winners for a draw
export function useDrawWinners(drawId: string, enabled = true) {
  return useQuery({
    queryKey: drawKeys.drawWinners(drawId),
    queryFn: () => getDrawWinnersByDraw(drawId),
    enabled: enabled && !!drawId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get user's all wins
export function useUserWins(enabled = true) {
  return useQuery({
    queryKey: drawKeys.userWins('me'),
    queryFn: getUserWins,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get draw digit events
export function useDrawDigitEvents(drawId: string, enabled = true) {
  return useQuery({
    queryKey: drawKeys.digits(drawId),
    queryFn: () => getDrawDigitEvents(drawId),
    enabled: enabled && !!drawId,
    staleTime: 0, // Always fetch fresh for live draw
  });
}

// Get share card data
export function useShareCardData(drawWinnerId: string, enabled = true) {
  return useQuery({
    queryKey: drawKeys.shareCard(drawWinnerId),
    queryFn: () => getShareCardData(drawWinnerId),
    enabled: enabled && !!drawWinnerId,
    staleTime: 30 * 60 * 1000, // 30 minutes (winner data doesn't change)
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

// ==========================================
// Prefetch Utilities
// ==========================================

export function usePrefetchDraw() {
  const queryClient = useQueryClient();

  return (drawId: string) => {
    queryClient.prefetchQuery({
      queryKey: drawKeys.detail(drawId),
      queryFn: () => getDrawById(drawId),
      staleTime: 30 * 1000,
    });
  };
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const drawApi = {
  listDraws,
  getDrawById,
  getNextDraw,
  getCurrentDraw,
  listDrawWinners,
  getDrawWinnersByDraw,
  getUserWins,
  getDrawDigitEvents,
  getShareCardData,
};
