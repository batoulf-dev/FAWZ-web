/**
 * Prizes Service Tests
 * Tests for prizes service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  usePrizePayoutList,
  usePrizePayout,
  useMyWins,
  usePrizeSummary,
  prizeKeys,
} from './prizes.service';
import type { ReactNode } from 'react';

describe('prizes.service', () => {
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

  describe('prizeKeys', () => {
    it('should have correct base key', () => {
      expect(prizeKeys.all).toEqual(['prizes']);
    });

    it('should have correct lists key', () => {
      expect(prizeKeys.lists()).toEqual(['prizes', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(prizeKeys.list({ page: 1, payout_status: 'completed' })).toEqual([
        'prizes',
        'list',
        { page: 1, payout_status: 'completed' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(prizeKeys.detail('payout-123')).toEqual([
        'prizes',
        'detail',
        'payout-123',
      ]);
    });

    it('should have correct summary key', () => {
      expect(prizeKeys.summary()).toEqual(['prizes', 'summary']);
    });

    it('should have correct myWins key', () => {
      expect(prizeKeys.myWins()).toEqual(['prizes', 'myWins']);
    });
  });

  describe('usePrizePayoutList', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => usePrizePayoutList(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(
        () => usePrizePayoutList({ payout_status: 'pending' }),
        { wrapper: createWrapper() },
      );

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('usePrizePayout', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => usePrizePayout('payout-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => usePrizePayout(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => usePrizePayout('payout-123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useMyWins', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useMyWins(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useMyWins(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('usePrizeSummary', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => usePrizeSummary(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => usePrizeSummary(false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });
});
