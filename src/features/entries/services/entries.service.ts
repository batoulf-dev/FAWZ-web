/**
 * Entries Service
 * API functions and TanStack Query hooks for entry management
 */

import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@/core/network/apiClient';
import type {
  FawzEntry,
  FawzEntryListResponse,
  EntryListParams,
  EntrySummary,
} from '../types/entries.types';

// ==========================================
// API Base Path
// ==========================================

const ENTRY_BASE = '/fawz_entry_generation';

// ==========================================
// Query Keys Factory
// ==========================================

export const entryKeys = {
  all: ['entries'] as const,
  lists: () => [...entryKeys.all, 'list'] as const,
  list: (params: EntryListParams) => [...entryKeys.lists(), params] as const,
  infinite: (params: Omit<EntryListParams, 'page'>) => [...entryKeys.lists(), 'infinite', params] as const,
  details: () => [...entryKeys.all, 'detail'] as const,
  detail: (id: string) => [...entryKeys.details(), id] as const,
  summary: () => [...entryKeys.all, 'summary'] as const,
};

// ==========================================
// API Functions
// ==========================================

// List entries with pagination and filters
async function listEntries(params: EntryListParams = {}): Promise<FawzEntryListResponse> {
  const response = await apiClient.get<FawzEntryListResponse>(
    `${ENTRY_BASE}/fawz_entries`,
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

// Get entry by ID
async function getEntryById(entryId: string): Promise<FawzEntry> {
  const response = await apiClient.get<FawzEntry>(
    `${ENTRY_BASE}/fawz_entries/${entryId}`,
  );
  return response.data;
}

// Get entry summary (aggregated stats)
async function getEntrySummary(): Promise<EntrySummary> {
  // Note: This endpoint may need to be adjusted based on actual API
  // The summary might come from a different endpoint or be computed client-side
  const [allEntries, weekEntries] = await Promise.all([
    listEntries({ page_size: 1 }),
    listEntries({
      page_size: 100,
      // Filter for current week - this may need adjustment
    }),
  ]);

  // Compute summary from entries
  const entries = weekEntries.fawz_entries_list;
  const entriesBySource: Record<string, number> = {};
  let activeCount = 0;
  let wonCount = 0;
  let totalPrizes = 0;

  // Track unique days with transactions for weekly spark
  const uniqueDays = new Set<string>();
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay()); // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0);

  entries.forEach((entry) => {
    entriesBySource[entry.source] = (entriesBySource[entry.source] || 0) + 1;
    if (entry.outcome === 'active') activeCount++;
    if (entry.outcome === 'won') {
      wonCount++;
      totalPrizes += entry.prize_iqd ?? 0;
    }

    // Track unique transaction days for weekly spark
    if (entry.source === 'transaction') {
      const entryDate = new Date(entry.created_at);
      if (entryDate >= weekStart) {
        uniqueDays.add(entryDate.toDateString());
      }
    }
  });

  return {
    total_entries: allEntries.total_fawz_entries,
    entries_this_week: entries.length,
    entries_this_month: allEntries.total_fawz_entries, // Placeholder
    entries_by_source: entriesBySource as Record<string, number>,
    active_entries: activeCount,
    won_entries: wonCount,
    total_prizes_iqd: totalPrizes,
    // Dashboard-specific fields
    current_draw_count: activeCount,
    lifetime_count: allEntries.total_fawz_entries,
    weekly_unique_days: uniqueDays.size,
  };
}

// ==========================================
// TanStack Query Hooks
// ==========================================

/* eslint-disable @typescript-eslint/explicit-function-return-type */

// List entries with pagination
export function useEntryList(params: EntryListParams = {}) {
  return useQuery({
    queryKey: entryKeys.list(params),
    queryFn: () => listEntries(params),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Infinite scroll entries
export function useInfiniteEntries(params: Omit<EntryListParams, 'page'> = {}) {
  return useInfiniteQuery({
    queryKey: entryKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) => listEntries({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total_fawz_entries / (params.page_size ?? 20));
      const currentPage = lastPage.page;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Get single entry
export function useEntry(entryId: string, enabled = true) {
  return useQuery({
    queryKey: entryKeys.detail(entryId),
    queryFn: () => getEntryById(entryId),
    enabled: enabled && !!entryId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Get entry summary
export function useEntrySummary(enabled = true) {
  return useQuery({
    queryKey: entryKeys.summary(),
    queryFn: getEntrySummary,
    enabled,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

// ==========================================
// Export API functions for direct use
// ==========================================

export const entryApi = {
  listEntries,
  getEntryById,
  getEntrySummary,
};
