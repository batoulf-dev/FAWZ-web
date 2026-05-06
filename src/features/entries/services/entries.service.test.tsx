/**
 * Entries Service Tests
 * Tests for entries service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useEntryList,
  useInfiniteEntries,
  useEntry,
  useEntrySummary,
  entryKeys,
} from './entries.service';
import type { ReactNode } from 'react';

describe('entries.service', () => {
  let queryClient: QueryClient;

  const createWrapper = (): React.FC<{ children: ReactNode }> =>
    function Wrapper({ children }: { children: ReactNode }): JSX.Element {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  describe('entryKeys', () => {
    it('should have correct base key', () => {
      expect(entryKeys.all).toEqual(['entries']);
    });

    it('should have correct lists key', () => {
      expect(entryKeys.lists()).toEqual(['entries', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(entryKeys.list({ page: 1, outcome: 'active' })).toEqual([
        'entries',
        'list',
        { page: 1, outcome: 'active' },
      ]);
    });

    it('should have correct infinite key with params', () => {
      expect(entryKeys.infinite({ outcome: 'won' })).toEqual([
        'entries',
        'list',
        'infinite',
        { outcome: 'won' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(entryKeys.detail('entry-123')).toEqual(['entries', 'detail', 'entry-123']);
    });

    it('should have correct summary key', () => {
      expect(entryKeys.summary()).toEqual(['entries', 'summary']);
    });
  });

  describe('useEntryList', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useEntryList(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(
        () => useEntryList({ page: 2, outcome: 'active' }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useInfiniteEntries', () => {
    it('should return infinite query object', () => {
      const { result } = renderHook(() => useInfiniteEntries(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.fetchNextPage).toBeDefined();
      expect(result.current.isFetchingNextPage).toBe(false);
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useInfiniteEntries({ source: 'transaction' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useEntry', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useEntry('entry-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useEntry(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useEntry('entry-123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useEntrySummary', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useEntrySummary(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useEntrySummary(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });
});
