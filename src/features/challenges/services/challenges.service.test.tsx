/**
 * Challenges Service Tests
 * Tests for challenges service hook structure and keys
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useChallengeList,
  useChallenge,
  useActiveChallenges,
  useOnboardingChallenges,
  useChallengeProgress,
  useAllUserProgress,
  useBadges,
  useUserBadges,
  useClaimCheckpoint,
  challengeKeys,
} from './challenges.service';
import type { ReactNode } from 'react';

describe('challenges.service', () => {
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

  describe('challengeKeys', () => {
    it('should have correct base key', () => {
      expect(challengeKeys.all).toEqual(['challenges']);
    });

    it('should have correct lists key', () => {
      expect(challengeKeys.lists()).toEqual(['challenges', 'list']);
    });

    it('should have correct list key with params', () => {
      expect(challengeKeys.list({ page: 1, status: 'active' })).toEqual([
        'challenges',
        'list',
        { page: 1, status: 'active' },
      ]);
    });

    it('should have correct detail key', () => {
      expect(challengeKeys.detail('challenge-123')).toEqual([
        'challenges',
        'detail',
        'challenge-123',
      ]);
    });

    it('should have correct active key', () => {
      expect(challengeKeys.active()).toEqual(['challenges', 'active']);
    });

    it('should have correct onboarding key', () => {
      expect(challengeKeys.onboarding()).toEqual(['challenges', 'onboarding']);
    });

    it('should have correct progress keys', () => {
      expect(challengeKeys.progress()).toEqual(['challenges', 'progress']);
      expect(challengeKeys.userProgress('challenge-123')).toEqual([
        'challenges',
        'progress',
        'challenge-123',
      ]);
      expect(challengeKeys.allProgress({ page: 1 })).toEqual([
        'challenges',
        'progress',
        'all',
        { page: 1 },
      ]);
    });

    it('should have correct badges keys', () => {
      expect(challengeKeys.badges()).toEqual(['challenges', 'badges']);
      expect(challengeKeys.badgeList()).toEqual(['challenges', 'badges', 'list']);
      expect(challengeKeys.userBadges()).toEqual(['challenges', 'badges', 'user']);
    });
  });

  describe('useChallengeList', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useChallengeList(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useChallengeList({ status: 'active' }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useChallenge', () => {
    it('should return query object when id is provided', () => {
      const { result } = renderHook(() => useChallenge('challenge-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when id is empty', () => {
      const { result } = renderHook(() => useChallenge(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
      expect(result.current.isLoading).toBe(false);
    });

    it('should not fetch when disabled', () => {
      const { result } = renderHook(() => useChallenge('challenge-123', false), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useActiveChallenges', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useActiveChallenges(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useOnboardingChallenges', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useOnboardingChallenges(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useChallengeProgress', () => {
    it('should return query object when challengeId is provided', () => {
      const { result } = renderHook(() => useChallengeProgress('challenge-123'), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });

    it('should not fetch when challengeId is empty', () => {
      const { result } = renderHook(() => useChallengeProgress(''), {
        wrapper: createWrapper(),
      });

      expect(result.current.fetchStatus).toBe('idle');
    });
  });

  describe('useAllUserProgress', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useAllUserProgress(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });

    it('should accept params', () => {
      const { result } = renderHook(() => useAllUserProgress({ page: 2 }), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('useBadges', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useBadges(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useUserBadges', () => {
    it('should return query object', () => {
      const { result } = renderHook(() => useUserBadges(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.refetch).toBeDefined();
    });
  });

  describe('useClaimCheckpoint', () => {
    it('should return mutation object', () => {
      const { result } = renderHook(() => useClaimCheckpoint(), {
        wrapper: createWrapper(),
      });

      expect(result.current.mutate).toBeDefined();
      expect(result.current.mutateAsync).toBeDefined();
      expect(result.current.isIdle).toBe(true);
    });
  });
});
