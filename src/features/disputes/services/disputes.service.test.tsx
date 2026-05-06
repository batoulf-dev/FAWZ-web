/**
 * Disputes Service Tests
 * Tests for disputes service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useDisputes,
  useDispute,
  useMonthlyDisputeCount,
  useCanSubmitDispute,
  useSubmitDispute,
  useRecentDisputes,
  usePendingDisputesCount,
  disputeKeys,
  MAX_DISPUTES_PER_MONTH,
} from './disputes.service';
import type { ReactNode } from 'react';

describe('disputes.service', () => {
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

  describe('constants', () => {
    it('should have correct max disputes per month', () => {
      expect(MAX_DISPUTES_PER_MONTH).toBe(3);
    });
  });

  describe('disputeKeys', () => {
    it('should have correct base key', () => {
      expect(disputeKeys.all).toEqual(['disputes']);
    });

    it('should have correct lists key', () => {
      expect(disputeKeys.lists()).toEqual(['disputes', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(disputeKeys.list({ page: 1, status: 'submitted' })).toEqual([
        'disputes',
        'list',
        { page: 1, status: 'submitted' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(disputeKeys.detail('dispute-123')).toEqual([
        'disputes',
        'detail',
        'dispute-123',
      ]);
    });

    it('should have correct monthlyCount key', () => {
      expect(disputeKeys.monthlyCount()).toEqual(['disputes', 'monthly-count']);
    });
  });

  describe('useDisputes', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useDisputes(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useDisputes({ status: 'resolved' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useDispute', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useDispute('dispute-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useDispute(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('useMonthlyDisputeCount', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useMonthlyDisputeCount(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useCanSubmitDispute', () => {
    it('should return status object', () => {
      const { result } = renderHook(() => useCanSubmitDispute(), {
        wrapper: createWrapper(),
      });

      expect(result.current.canSubmit).toBe(false);
      expect(result.current.remainingDisputes).toBe(0);
      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useSubmitDispute', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useSubmitDispute(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useRecentDisputes', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useRecentDisputes(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept limit param', () => {
      const { result } = renderHook(() => useRecentDisputes(10), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('usePendingDisputesCount', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => usePendingDisputesCount(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });
});
