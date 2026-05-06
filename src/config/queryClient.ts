/**
 * TanStack Query Client Configuration
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 30 seconds
      staleTime: 30 * 1000,
      // Cache time: 5 minutes
      gcTime: 5 * 60 * 1000,
      // Retry failed requests up to 3 times
      retry: 3,
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus (good for data freshness)
      refetchOnWindowFocus: true,
      // Don't refetch on reconnect by default
      refetchOnReconnect: 'always',
      // Don't refetch on mount if data is fresh
      refetchOnMount: true,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
      // Network mode for offline support
      networkMode: 'online',
    },
  },
});

// Query key factory pattern for consistent keys
export const createQueryKeys = <T extends string>(feature: T): {
  all: readonly [T];
  lists: () => readonly [T, 'list'];
  list: (filters: Record<string, unknown>) => readonly [T, 'list', Record<string, unknown>];
  details: () => readonly [T, 'detail'];
  detail: (id: string) => readonly [T, 'detail', string];
} => ({
  all: [feature] as const,
  lists: () => [...createQueryKeys(feature).all, 'list'] as const,
  list: (filters: Record<string, unknown>) =>
    [...createQueryKeys(feature).lists(), filters] as const,
  details: () => [...createQueryKeys(feature).all, 'detail'] as const,
  detail: (id: string) => [...createQueryKeys(feature).details(), id] as const,
});
