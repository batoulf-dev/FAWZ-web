/**
 * Referrals Service Tests
 * Tests for referrals service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useMyReferralLink,
  useReferralStats,
  useReferralHistory,
  useReferralList,
  useReferral,
  useCreateReferralLink,
  useReferralShareData,
  referralKeys,
} from './referrals.service';
import type { ReactNode } from 'react';

describe('referrals.service', () => {
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

  describe('referralKeys', () => {
    it('should have correct base key', () => {
      expect(referralKeys.all).toEqual(['referrals']);
    });

    it('should have correct lists key', () => {
      expect(referralKeys.lists()).toEqual(['referrals', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(referralKeys.list({ page: 1, status: 'pending' })).toEqual([
        'referrals',
        'list',
        { page: 1, status: 'pending' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(referralKeys.detail('referral-123')).toEqual([
        'referrals',
        'detail',
        'referral-123',
      ]);
    });

    it('should have correct links keys', () => {
      expect(referralKeys.links()).toEqual(['referrals', 'links']);
      expect(referralKeys.myLink()).toEqual(['referrals', 'links', 'my']);
    });

    it('should have correct stats key', () => {
      expect(referralKeys.stats()).toEqual(['referrals', 'stats']);
    });

    it('should have correct history key', () => {
      expect(referralKeys.history()).toEqual(['referrals', 'history']);
    });
  });

  describe('useMyReferralLink', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useMyReferralLink(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useReferralStats', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useReferralStats(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useReferralHistory', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useReferralHistory(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useReferralList', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useReferralList(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useReferralList({ page: 2, status: 'rewarded' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useReferral', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useReferral('referral-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useReferral(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useReferral('referral-123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useCreateReferralLink', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useCreateReferralLink(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });

  describe('useReferralShareData', () => {
    it('should return share data object structure', () => {
      const { result } = renderHook(() => useReferralShareData(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.shareData).toBeNull();
      expect(result.current.link).toBeUndefined();
    });
  });
});
